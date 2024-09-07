const jwt = require( 'jsonwebtoken' );
const TokenModel = require( '../schemas/tokenModel' );

class TokenService {

  generate = ( payload ) => {
    const RToken = jwt.sign( payload, process.env.REFRESH_KEY, { expiresIn: '30d' } );
    const AToken = jwt.sign( payload, process.env.ACCESS_KEY, { expiresIn: '1h' } );
    return { RToken, AToken };
  };

  create = async ( user ) => {
    const { RToken, AToken } = this.generate( { _id: user._id, email: user.email } );
    const existsToken = await TokenModel.findOne( { user: user._id } );
    if ( existsToken ) {
      await TokenModel.updateOne( { user: user._id }, { $set: { AToken, RToken } } );
      return { RToken, AToken };
    } else {
      await TokenModel.create( { user: user._id, RToken, AToken } );
      return { RToken, AToken };
    }
  };

  async delete( AToken ) {
    const existsToken = await TokenModel.deleteOne( { AToken } );
    return existsToken;
  }

}

const tokenService = new TokenService();

module.exports = tokenService;