require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Conect to MongoDB'))
  .catch((err) => console.error('❌ Error conection MongoDB:', err.message));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat Service API',
      version: '1.0.0',
      description: 'API from microservice Chat PetConnect',
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use('/messages', chatRoutes);

// WebSocket
io.on('connection', (socket) => {
  console.log('🟢 Nuevo cliente conectado:', socket.id);

  socket.on('sendMessage', (message) => {
    console.log('📩 Mensaje recibido vía WebSocket:', message);
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Arranque del servidor
const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
  console.log(`🚀 Chat Service corriendo en puerto ${PORT}`);
});
