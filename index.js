// Require (‘socket.io’) (http) создает новый экземпляр socket.io, подключенный к http-серверу. Обработчик событий io.on обрабатывает события подключения, отключения и т. Д. В нем, используя объект сокета.

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var users = [
    { name: 'admin', id: 1 },
    { name: 'admin2', id: 2 }

];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/main.css', function(req, res) {
    res.sendFile(__dirname + '/main.css');
});
app.get('/normalize.css', function(req, res) {
    res.sendFile(__dirname + '/normalize.css');
});
app.get('/img/user.svg', function(req, res) {
    res.sendFile(__dirname + '/img/user.svg');
});
// --------------- IO --------------- 
io.on('connection', function(socket) {
    // connections.push(socket);
    // socket.emit('get id', socket.id);
    socket.emit('load users', users);

    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    socket.on('authorize', function(nameUser) {
        var checkName = users.some(function(user) {
            if (user.name === nameUser) {
                return true
            }
        });
        if (checkName) {
            socket.emit('failed authorization');

        } else {
            users.push({ id: socket.id, name: nameUser });
            io.emit('load users', users);
            socket.emit('succes authorization', { id: socket.id, name: nameUser })
        }

    });

    io.on('disconnect', function() {
        if (userName) {
            var index = users.indexOf(userName);
            console.log(index)
            users.splice(index, 1);
            userName = null;
            socket.emit('load users', users);
        }


        console.log('user disconnected');
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});