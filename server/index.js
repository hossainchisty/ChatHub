const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
  }
});

// Serve static files from the public folder
app.use(express.static('public'));

let name = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('new user', (name) => {
    console.log(`New user: ${name}`);
    name[socket.id] = name;
    io.emit('user joined', name);
  });

  socket.on('message', ({ name, message }) => {
    const timestamp = new Date().toLocaleTimeString();
    io.emit('message', { name, message, timestamp });
  });
  

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });
  

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    socket.broadcast.emit('user left', socket.name);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
