// Backend server using Node.js, Express, and Socket.IO

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let viewerCount = 0;
let totalViewers = 0;

io.on('connection', (socket) => {
  viewerCount++;
  totalViewers++;
  io.emit('viewerCountUpdate', { currentViewers: viewerCount, totalViewers });

  socket.on('disconnect', () => {
    viewerCount--;
    io.emit('viewerCountUpdate', { currentViewers: viewerCount, totalViewers });
  });
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
