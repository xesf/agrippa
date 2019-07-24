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

app.get('/', (req, res) => {
    res.end(indexBody);
});

app.get('/metadata', (req, res) => {
    const filepath = 'metadata/nodes.json';
    const fileSize = fs.statSync(filepath).size;
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'application/json',
    };
    res.writeHead(200, head);
    fs.createReadStream(filepath).pipe(res);
});

app.post('/metadata', (req, res) => {
    const filepath = 'metadata/nodes.json';
    req.pipe(fs.createWriteStream(filepath, { flags: 'w+' }));
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

// MP4
app.get('/mp4/:path/:name', (req, res) => {
    const filepath = `data/${req.params.path}/${req.params.name}.mp4`;
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
