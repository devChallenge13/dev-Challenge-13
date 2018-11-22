const express = require('express');
const app = express();
const port = 5002;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const name = "Toaster";


let indicators = {
  "On": "Yes"
}

let commands = ['turn on', 'turn off'];

io.on('connection', (socket) => {
  socket.emit('name', name);
  
  socket.on('get commands', () => {
    socket.emit('commands', commands);
  });
  socket.on('get indicators', () => {
    socket.emit('indicators', indicators);
  });

  // COMMANDS
  socket.on('turn on', () => {
    indicators["On"] = "Yes";
    socket.emit('indicators', indicators);
  });
  socket.on('turn off', () => {
    console.log(indicators);
    indicators["On"] = "No";
    socket.emit('indicators', indicators);
  });
});

server.listen(port, () => console.log(`Toaster running on port ${port}`));