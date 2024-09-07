const { Schema, model } = require( 'mongoose' );

const UserModel = new Schema( {
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  fullname: { type: String, default: '' }
} );

module.exports = model( 'User', UserModel );