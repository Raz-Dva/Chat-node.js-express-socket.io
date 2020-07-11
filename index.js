// Require (‘socket.io’) (http) создает новый экземпляр socket.io, подключенный к http-серверу. Обработчик событий io.on обрабатывает события подключения, отключения и т. Д. В нем, используя объект сокета.

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var count = 0;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/main.css', function(req, res) {
    res.sendFile(__dirname + '/main.css');
});
app.get('/normalize.css', function(req, res) {
    res.sendFile(__dirname + '/normalize.css');
});

// --------------- IO --------------- 
io.on('connection', function(socket) {
    // console.log(count++ + ' -- ' + socket.id)
    socket.emit('get id', socket.id);

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});




http.listen(3000, function() {
    console.log('listening on *:3000');
});