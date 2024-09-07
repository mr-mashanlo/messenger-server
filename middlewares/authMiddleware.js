const jwt = require( 'jsonwebtoken' );
const { Unauthorized } = require( '../services/errorService' );

const authMiddleware = async ( req, res, next ) => {

  const { AToken } = req.cookies;
  if ( !AToken ) {
    return next( new Unauthorized( [ { path: 'headers', msg: 'Access denied' } ] ) );
  }

  const verifiedToken = jwt.verify( AToken, process.env.ACCESS_KEY, ( error, decoded ) => { return error || decoded; } );
  if ( verifiedToken instanceof Error ) {
    return next( new Unauthorized( [ { path: 'expired', msg:'Your token has expired' } ] ) );
  }

  req.me = { id: verifiedToken.id, email: verifiedToken.email };

  next();
};

module.exports = authMiddleware;