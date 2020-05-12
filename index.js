var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

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
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

