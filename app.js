/**
 * Created by Amitabh on 22-09-2015.
 */
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

usernames = [];

var userColor = {};


server.listen(process.env.PORT || 3000);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

io.sockets.on('connection', function (socket) {
    socket.on('new user', function (data, callback) {
        if (usernames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUserColor(socket.username);
            updateUsernames();

        }

    });
    function updateUsernames() {
        io.sockets.emit('usernames', usernames, userColor);
    }

    function updateUserColor(username) {

        userColor[username] = getColor();
    }

    //function getColor() {
    //    var letters = 'ABCDE'.split('');
    //    var color = '#';
    //    for (var i=0; i<3; i++ ) {
    //        color += letters[Math.floor(Math.random() * letters.length)];
    //    }
    //    return color;
    //}
    function getColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    //function getColor() {
    //    rgb = Math.floor(Math.random() * 255);
    //    return rgb;
    //}

//send message
    socket.on('send message', function (data) {
        io.sockets.emit('new message', {msg: data, user: socket.username, color: userColor});
    });
    //disconnect
    socket.on('disconnect', function (data) {
        if (!socket.username)return;
        usernames.splice(usernames.indexof(socket.username), 1);
        updateUsernames();
    })
});