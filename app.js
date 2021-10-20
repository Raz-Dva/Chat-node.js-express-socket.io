const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var users = [
    { name: 'admin', id: 1 },
    { name: 'admin2', id: 2 }
];
app.use('/', express.static(__dirname));
app.use('/css', express.static('css'));
app.use('/img', express.static('img'));
app.use('/js', express.static('js'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
// --------------- IO --------------- 
io.on('connection', function (socket) {
    socket.emit('load users', users);
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
    socket.on('authorize', function (nameUser) {
        var checkName = users.some(function (user) {
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
    socket.on('disconnect', function () {
        users.forEach((e) => {
            if (e.id == socket.id) {
                var y = users.indexOf(e);
                users.splice(y, 1)
                return false;
            }
        });
        io.emit('load users', users);
    });
});
http.listen(port, function () {
    console.log('Server listening at port %d', port);
});