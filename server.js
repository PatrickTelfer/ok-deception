const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

app.use(express.static(path.join(__dirname, 'public')));

let numOfUsers = 0;
let users = [];

io.on('connection', (socket) => {
    let addedUser = false;

    socket.on('add user', (username) => {
        console.log(username);
        console.log(addedUser);
        if (addedUser === true) {
            return;
        } else {
            socket.username = username;
            ++numOfUsers;
            
            addedUser = true;
            io.emit('login', {
                numOfUsers: numOfUsers,
                users: users
            });

            users.push(username);

            io.emit('added', {
                username: socket.username,
                numOfUsers: numOfUsers
            });
        }
    });

    socket.on('disconnect' , () => {
        if (addedUser) {
            --numOfUsers;
            console.log(users);
            users = users.filter(item => item != socket.username);
            io.emit('user left', {
                username: socket.username,
                users: users
            });
        }
    });

});