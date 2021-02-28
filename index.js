var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


var usernames = {};

io.sockets.on('connection', function (socket) {

    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });

    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'mChat', 'Welcome ' + username + ' !! You have successfully connected :)');
        socket.broadcast.emit('updatechat', 'mChat'
            , username + ' has joined the chat!!');
        io.sockets.emit('updateusers', usernames);
    });

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'mChat'
            , socket.username + ' has left the chat!!');
    });
    socket.on('typing', function () {
        socket.broadcast.emit('typing', socket.username);
    })

    socket.on('fileUpload', (data, imgurl) => {
        io.sockets.emit('fileUpload', socket.username, data, imgurl);
    });
});

var port = 8080;
server.listen(port);
console.log('Server Running On : ' + port);