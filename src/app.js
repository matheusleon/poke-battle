const PORT = 3002

var express = require('express')
var path = require('path')
var https = require('https')

var app = express();
app.use(express.static('public'));

// console.log('dir = ' + __dirname)

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/singleplayer', function (req, res) {
    res.sendFile(path.join(__dirname + '/singleplayer.html'));
});


app.listen(PORT, function () {
    console.log('Listening to PORT: ' + PORT);
});