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
            'Referer': 'https://masukestin.com/'
        }
    }).on('response', function(response) {
        const contentType = response.headers['content-type'];

        if (contentType && contentType.includes('application/vnd.apple.mpegurl')) {
            let body = '';

            response.on('data', chunk => body += chunk);
            response.on('end', () => {
                const modified = body.replace(/(.*\.m3u8|.*\.ts)/g, (match) => {
                    return '/stream?url=' + encodeURIComponent(match);
                });
                res.send(modified);
            });
        } else {
            response.pipe(res);
        }
    });
});

app.listen(10000, () => {
    console.log("Proxy PRO corriendo");
});
