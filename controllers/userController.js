const UserModel = require( '../schemas/userModel' );
const TokenModel = require( '../schemas/tokenModel' );

class UserController {

  getAll = async ( req, res, next ) => {
    try {
      const id = req.me.id;
      const users = await UserModel.find( { _id: { $ne: id } } ).select( '-password' );
      return res.send( users );
    } catch ( error ) {
      next( error );
    }
  };

  getOne = async ( req, res, next ) => {
    try {
      const userID = req.params.id;
      const user = await UserModel.findOne( { _id: userID } ).select( '-password' );
      return res.send( user );
    } catch ( error ) {
      next( error );
    }
  };

  update = async ( req, res, next ) => {
    try {
      const userID = req.params.id;
      const updates = req.body.updates;
      const user = await UserModel.findOneAndUpdate( { _id: userID }, { $set: { ...updates } }, { new: true } );
      return res.send( user );
    } catch ( error ) {
      next( error );
    }
  };

  delete = async ( req, res, next ) => {
    try {
      const id = req.params.id;
      await UserModel.deleteOne( { _id: id } );
      await TokenModel.deleteOne( { user: id } );
      return res.send( { success: true, msg: 'Deleted' } );
    } catch ( error ) {
      next( error );
    }
  };

};

const userController = new UserController();

module.exports = userController;