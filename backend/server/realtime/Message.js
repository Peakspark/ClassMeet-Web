const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true, maxlength: 1000 }
  },
  { timestamps: true } 
);
messageSchema.index({ roomId: 1, createdAt: -1 });
module.exports = mongoose.model('Message', messageSchema);