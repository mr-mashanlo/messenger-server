const { Schema, model } = require( 'mongoose' );

const MessageModel = new Schema( {
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
} );

module.exports = model( 'Message', MessageModel );