import fs from 'fs';
import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-middleware';

import webpackConfig from '../webpack.config';
import App from './index-ssr';
import { getHotspots, createHotspot } from './utils';

const logStream = fs.createWriteStream(path.join(__dirname, '/streaming-log.txt'), { flags: 'a' });

const app = express();

app.listen(process.env.port || 8080, process.env.host || '0.0.0.0');

app.use(morgan('combined', { stream: logStream}));
app.use(cors());

webpackConfig.devtool = process.env.SRCMAP === 'true' ? 'source-map' : undefined;
const compiler = webpack(webpackConfig);
app.use(webpackDevServer(compiler));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/', express.static('../public'));
app.use('/metadata', express.static('../metadata'));
app.use('/data', express.static('../data'));

const indexBody = renderToStaticMarkup(React.createElement(App));

const getScript = (id) => {
    const filepath = `metadata/scripts/${id}.fms`;
    if (fs.existsSync(filepath)) {
        const data = fs.readFileSync(filepath, 'utf8');
        if (!data) {
            return null;
        }
        return data;
    }
    return null;
};

app.get('/', (req, res) => {
    res.end(indexBody);
});

app.get('/metadata', (req, res) => {
    const filepath = 'metadata/nodes.json';
    const data = fs.readFileSync(filepath);
    if (!data) {
        return;
    }
    const metadata = JSON.parse(data);
    if (metadata) {
        metadata.nodes.forEach((n) => {
            let hotspots = null;
            try {
                hotspots = getHotspots(`data/${n.path}.hot`);
            } catch (e) {
                console.warn(`No hotspot found for node ${n.path}`);
            }
            if (hotspots) {
                if (!n.annotations) {
                    n.annotations = { };
                }
                if (!n.annotations.hotspots || n.annotations.hotspots === undefined) {
                    n.annotations.hotspots = hotspots;
                }
            }

            if (n.type === 'navigation' && n.items && n.items.length > 0) {
                hotspots = [];
                n.items.forEach((i) => {
                    if (i.type === 'left') {
                        hotspots.push(createHotspot(i.type, i.desc, i.option, 0, 0, 140, 245));
                    }
                    if (i.type === 'forward') {
                        hotspots.push(createHotspot(i.type, i.desc, i.option, 200, 0, 405, 245));
                    }
                    if (i.type === 'right') {
                        hotspots.push(createHotspot(i.type, i.desc, i.option, 460, 0, 600, 245));
                    }
                });
                if (!n.annotations) {
                    n.annotations = { };
                }
                if (!n.annotations.hotspots || n.annotations.hotspots === undefined) {
                    n.annotations.hotspots = hotspots;
                }
            }

            const s = getScript(n.id);
            if (s) {
                n.script = s;
            }
            if (metadata.selected === n.id) {
                metadata.node = n;
            }
        });
    }

    res.send(metadata);
});

app.get('/script/:id', (req, res) => {
    const filepath = `metadata/scripts/${req.params.id}.fms`;
    const data = fs.readFileSync(filepath, 'utf8');
    if (!data) {
        return;
    }
    res.send(data);
});

// app.get('/metadata', (req, res) => {
//     const filepath = 'metadata/nodes.json';
//     const fileSize = fs.statSync(filepath).size;
//     const head = {
//         'Content-Length': fileSize,
//         'Content-Type': 'application/json',
//     };
//     res.writeHead(200, head);
//     fs.createReadStream(filepath).pipe(res);
// });

app.post('/metadata', (req, res) => {
    const filepath = 'metadata/nodes.json';
    const fileStream = fs.createWriteStream(filepath, { flags: 'w+' });
    req.pipe(fileStream);
    res.writeHead(200);
    res.send();
});

// DASH
app.get('/dash/:path/:name', (req, res) => {
    const filepath = `data/${req.params.path}/dash/${req.params.name}/manifest.mpd`;
    const fileSize = fs.statSync(filepath).size;

    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'application/dash+xml',
    };
    res.writeHead(200, head);
    fs.createReadStream(filepath).pipe(res);
});

// MP4
app.get('/hls/:path/:name', (req, res) => {
    const filepath = `data/${req.params.path}/${req.params.name}/${req.params.name}.m3u8`;
    const fileSize = fs.statSync(filepath).size;

    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'application/x-mpegURL',
    };
    res.writeHead(200, head);
    fs.createReadStream(filepath).pipe(res);
});


app.get('/dash/:path/:name/:video/:folder/:segment/:file', (req, res) => {
    const filepath = `data/${req.params.path}/dash/${req.params.name}/${req.params.video}/${req.params.folder}/${req.params.segment}/${req.params.file}`;
    const fileSize = fs.statSync(filepath).size;

    if (req.headers.range) {
        const range = req.headers.range.replace(/bytes=/, '').split('-');
        const start = parseInt(range[0], 10);
        const end = range[1] ? parseInt(range[1], 10) : fileSize - 1;

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filepath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filepath).pipe(res);
    }
});

const getMP4 = (req, res, filepath) => {
    const fileSize = fs.statSync(filepath).size;

    if (req.headers.range) {
        const range = req.headers.range.replace(/bytes=/, '').split('-');
        const start = parseInt(range[0], 10);
        const end = range[1] ? parseInt(range[1], 10) : fileSize - 1;

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filepath, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filepath).pipe(res);
    }
};

// MP4
app.get('/mp4/:path/:name', (req, res) => {
    const filepath = `data/${req.params.path}/${req.params.name}.mp4`;
    getMP4(req, res, filepath);
});
app.get('/mp4/:name', (req, res) => {
    const filepath = `data/${req.params.name}.mp4`;
    getMP4(req, res, filepath);
});

app.get('/vtt/:path/:name', (req, res) => {
    const filepath = `data/${req.params.path}/${req.params.name}.vtt`;
    const fileSize = fs.statSync(filepath).size;
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'text/vtt',
    };
    res.writeHead(200, head);
    fs.createReadStream(filepath).pipe(res);
});

app.get('/hot/:path/:name', (req, res) => {
    const filepath = `data/${req.params.path}/${req.params.name}.hot`;
    res.send(getHotspots(filepath));
});
