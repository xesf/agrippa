import fs from 'fs';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const logStream = fs.createWriteStream(__dirname + '/streaming-log.txt', { flags: 'a'});

const app = express();

app.listen(process.env.port || 2349, process.env.host || '0.0.0.0');

app.use(morgan('combined',{ stream: logStream}));
app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/metadata', function (req, res) {
    const path = `metadata/nodes.json`;
    const fileSize = fs.statSync(path).size;
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'application/json',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
});

app.post('/metadata', function (req, res) {
    const path = `metadata/nodes.json`;
    req.pipe(fs.createWriteStream(path, { flags: 'w+' }));
    res.writeHead(200);
});

// DASH
app.get('/dash/:path/:name', function(req, res) {
    const path = `data/${req.params.path}/dash/${req.params.name}/manifest.mpd`;
    const fileSize = fs.statSync(path).size;

    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'application/dash+xml',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
});

// MP4
app.get('/hls/:path/:name', function(req, res) {
    const path = `data/${req.params.path}/${req.params.name}/${req.params.name}.m3u8`;
    const fileSize = fs.statSync(path).size;

    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'application/x-mpegURL',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
});


app.get('/dash/:path/:name/:video/:folder/:segment/:file', function(req, res) {
    const path = `data/${req.params.path}/dash/${req.params.name}/${req.params.video}/${req.params.folder}/${req.params.segment}/${req.params.file}`;
    const fileSize = fs.statSync(path).size;

    if (req.headers.range) {
        const range = req.headers.range.replace(/bytes=/, "").split("-");
        const start = parseInt(range[0], 10);
        const end = range[1] ? parseInt(range[1], 10) : fileSize-1;

        const chunksize = (end-start)+1;
        const file = fs.createReadStream(path, {start, end});
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
        fs.createReadStream(path).pipe(res);
    }
});

// MP4
app.get('/mp4/:path/:name', function(req, res) {
    const path = `data/${req.params.path}/${req.params.name}.mp4`;
    const fileSize = fs.statSync(path).size;

    if (req.headers.range) {
        const range = req.headers.range.replace(/bytes=/, "").split("-");
        const start = parseInt(range[0], 10);
        const end = range[1] ? parseInt(range[1], 10) : fileSize-1;

        const chunksize = (end-start)+1;
        const file = fs.createReadStream(path, {start, end});
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
        fs.createReadStream(path).pipe(res);
    }
});
