const express = require('express');
const app = express();
const port = 5003;
const server = require('http').Server(app);
const io = require('socket.io')(server);
const name = "Thermostat";

let indicators = {
  "Floor heating on": "Yes",
  "Air conditioning on": "No",
  "Floor temperature": "19 *C",
  "Air temperature": "21 *C",
  "Suggested floor temperature": "23 *C",
  "Suggested air temperature": "20 *C"
}

let commands = [
  'Turn air conditioning on', 
  'Turn air conditioning off',
  'Turn floor heating on',
  'Turn floor heating off'
];

io.on('connection', (socket) => {
  socket.emit('name', name);
  
  socket.on('get commands', () => {
    socket.emit('commands', commands);
  });
  socket.on('get indicators', () => {
    socket.emit('indicators', indicators);
  });

  // COMMANDS
  socket.on('Turn air conditioning on', () => {
    indicators["Air conditioning on"] = "Yes";
    socket.emit('indicators', indicators);
  });
  socket.on('Turn air conditioning off', () => {
    indicators["Air conditioning on"] = "No";
    socket.emit('indicators', indicators);
  });
  socket.on('Turn floor heating on', () => {
    indicators["Floor heating on"] = "Yes";
    socket.emit('indicators', indicators);
  });
  socket.on('Turn floor heating off', () => {
    indicators["Floor heating on"] = "No";
    socket.emit('indicators', indicators);
  });
});

server.listen(port, () => console.log(`Thermostat running on port ${port}`));