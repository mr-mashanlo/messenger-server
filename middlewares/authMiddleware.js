const jwt = require( 'jsonwebtoken' );
const { Unauthorized } = require( '../services/errorService' );

const authMiddleware = async ( req, res, next ) => {
  const token = req.cookies.AToken;

  if ( !token ) {
    return next( new Unauthorized( [ { path: 'headers', msg: 'Access denied' } ] ) );
  }

  const verifiedToken = jwt.verify( token, process.env.ACCESS_KEY, ( error, decoded ) => { return error || decoded; } );
  if ( verifiedToken instanceof Error ) {
    return next( new Unauthorized( [ { path: 'expired', msg:'Your token has expired' } ] ) );
  }

  req.me = { id: verifiedToken._id };

  next();
};

module.exports = authMiddleware;