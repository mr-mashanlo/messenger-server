const { Schema, model } = require( 'mongoose' );

const ChatModel = new Schema( {
  members: [ { type: Schema.Types.ObjectId, ref: 'User', required: true } ]
} );

module.exports = model( 'Chat', ChatModel );