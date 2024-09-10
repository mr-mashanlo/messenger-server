const { Schema, model } = require( 'mongoose' );

const UserModel = new Schema( {
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  fullname: { type: String, default: '' },
  online: { type: Boolean, default: false }
} );

module.exports = model( 'User', UserModel );