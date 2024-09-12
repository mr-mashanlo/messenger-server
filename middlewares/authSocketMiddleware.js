const jwt = require( 'jsonwebtoken' );
const { Unauthorized } = require( '../services/errorService' );

const authSocketMiddleware = async ( socket, next ) => {
  const token = socket.handshake.headers.cookie ? socket.handshake.headers.cookie.split( '=' )[1] : null;

  if ( !token ) {
    return next( new Unauthorized( [ { path: 'headers', msg: 'Access denied' } ] ) );
  }

  const verifiedToken = jwt.verify( token, process.env.ACCESS_KEY, ( error, decoded ) => { return error || decoded; } );
  if ( verifiedToken instanceof Error ) {
    return next( new Unauthorized( [ { path: 'expired', msg:'Your token has expired' } ] ) );
  }

  socket.me = { id: verifiedToken._id };

  next();
};

module.exports = authSocketMiddleware;