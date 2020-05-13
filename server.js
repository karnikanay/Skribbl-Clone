'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    if(socket.lastRoom) {
      io.to(socket.lastRoom).emit('chat message', msg);
    }
  });
  
  socket.on('join', (room) => {
    if(socket.lastRoom) {
      socket.leave(socket.lastRoom);
      socket.lastRoom = null;
    }
    socket.join(room);
    socket.lastRoom = room;
  });

  socket.on('stroke', (circle) => {
    io.to(socket.lastRoom).emit('stroke', circle);
  });

});

