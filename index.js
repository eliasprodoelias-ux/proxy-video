const express = require('express');
const request = require('request');

const app = express();

app.get('/stream', (req, res) => {
    const url = "https://masukestin.com/stream/85tBvX3pwtKZlp6P47Zp7Q/kjhhiuahiuhgihdf/1774077237/57405811/master.m3u8";

    request({
        url: url,
        headers: {
            'Referer': 'https://masukestin.com/'
        }
    }).pipe(res);
});

app.listen(10000, () => {
    console.log("Servidor corriendo");
});
