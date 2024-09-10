const { Schema, model } = require( 'mongoose' );

const MessageModel = new Schema( {
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat' },
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { text: { type: String }, media: { type: String } },
  timestamp: { type: Date, default: Date.now }
} );

module.exports = model( 'Message', MessageModel );