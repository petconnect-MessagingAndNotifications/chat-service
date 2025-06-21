const ChatMessage = require('../models/ChatMessage.js');

// Enviar mensaje
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id; // viene del authMiddleware

    const newMessage = new ChatMessage({
      senderId,
      receiverId,
      message
    });

    await newMessage.save();

    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Obtener conversación con un usuario
const getMessages = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    const messages = await ChatMessage.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ sentAt: 1 }); // ordenar por fecha ascendente

    res.json({ success: true, data: messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  sendMessage,
  getMessages
};
