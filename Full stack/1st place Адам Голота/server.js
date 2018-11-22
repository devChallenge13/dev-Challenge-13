const express = require('express');
const app = express();
const port = 8080;
const ioClient = require('socket.io-client');
const server = require('http').createServer(app);
const path = require('path');

// For client
const io = require('socket.io')(server);



// DATA
let chosenDeviceIp = null; 
let devices = {}; // ip: name
let sockets = {}; // ip: socket

// SOCKETS


io.on('connection', (client) => {
  client.on('get devices', () => {
    client.emit('devices', devices);
  });
  client.on('add device', (ip) => {
    let dSocket = ioClient.connect('http://' + ip);
    dSocket.on('connect', () => {
      dSocket.emit('get info');
      dSocket.on('name', (name) => {
        devices[ip] = name;
        sockets[ip] = {socket: dSocket},
        client.emit('devices', devices);
      });
    });
  });
  client.on('remove device', (ip) => {
    delete devices[ip];
    console.log(devices);
    sockets[ip].socket.emit('disconnect');
    client.emit('devices', devices);
  });
  client.on('chosen device', (ip) => {
    let emitIndicators = (indicators) => {
      client.emit('indicators', indicators);
    }
    let emitCommands = (commands) => {
      client.emit('commands', commands);

    }
    if (chosenDeviceIp)
    {
      sockets[chosenDeviceIp].socket.off('indicators', emitIndicators);
      sockets[chosenDeviceIp].socket.off('commands', emitCommands);
    }

    chosenDeviceIp = ip;
    sockets[ip].socket.on('indicators', emitIndicators);
    sockets[ip].socket.on('commands', emitCommands);

    sockets[ip].socket.emit('get indicators');
    sockets[ip].socket.emit('get commands');
  });
  client.on('execute', command => {
    console.log(command);
    sockets[chosenDeviceIp].socket.emit(command);
  });
});

// LOAD CLIENT

app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () => console.log(`Server running on port ${port}`));