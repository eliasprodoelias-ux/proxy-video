const express = require('express');
const request = require('request');

const app = express();

const BASE_URL = "https://masukestin.com/stream/85tBvX3pwtKZlp6P47Zp7Q/kjhhiuahiuhgihdf/1774077237/57405811/";

app.get('/stream', (req, res) => {
    const target = req.query.url || "master.m3u8";
    const fullUrl = target.startsWith("http") ? target : BASE_URL + target;

    request({
        url: fullUrl,
        headers: {
            'Referer': 'https://masukestin.com/',
            'User-Agent': 'Mozilla/5.0'
        }
    }).on('response', function(response) {
        const contentType = response.headers['content-type'];

        // Si es playlist (.m3u8)
        if (contentType && contentType.includes('application/vnd.apple.mpegurl')) {
            let body = '';

            response.on('data', chunk => body += chunk);
            response.on('end', () => {

                const modified = body.split('\n').map(line => {
                    if (
                        line &&
                        !line.startsWith('#') &&
                        (line.includes('.m3u8') || line.includes('.ts'))
                    ) {
                        return '/stream?url=' + encodeURIComponent(line);
                    }
                    return line;
                }).join('\n');

                res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
                res.send(modified);
            });

        } else {
            // Si es video (.ts u otro)
            response.pipe(res);
        }
    }).on('error', err => {
        res.status(500).send('Error en proxy');
    });
});

app.listen(10000, () => {
    console.log("Proxy PRO corriendo");
});
