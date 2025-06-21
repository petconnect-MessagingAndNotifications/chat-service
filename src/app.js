const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Ruta REST de prueba
app.get('/', (req, res) => {
  res.send('Chat Service is running...');
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log(`New user connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    console.log(`Message received: ${data.message} from ${data.user}`);
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
});
