const express = require('express');
const app = express();
const port = 5001;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const name = "Kettle";


let indicators = {
  "On": "yes",
  "Water amount": "1 liter",
  "Water temperature": "50 *C"
}

let commands = ['turn on', 'turn off'];

io.on('connection', (socket) => {
  console.log("Dashboard connected");
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
    indicators["On"] = "No";
    socket.emit('indicators', indicators);
  });
});
server.listen(port, () => console.log(`Kettle running on port ${port}`));