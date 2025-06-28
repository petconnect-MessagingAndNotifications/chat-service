const ChatMessage = require('../models/ChatMessage.js');

// Enviar mensaje
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id; // desde JWT

    const newMessage = new ChatMessage({
      sender: senderId,
      receiver: receiverId,
      message
    });

    await newMessage.save();

    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Obtener conversación entre dos usuarios
const getMessages = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    const messages = await ChatMessage.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ timestamp: 1 });

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
