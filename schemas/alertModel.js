const { Schema, model } = require( 'mongoose' );

const AlertModel = new Schema( {
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  alerts: [ { type: Schema.Types.ObjectId, ref: 'User' } ]
} );

module.exports = model( 'Alert', AlertModel );