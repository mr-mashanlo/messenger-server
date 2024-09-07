const { GeneralError } = require( '../services/errorService' );

// eslint-disable-next-line no-unused-vars
const errorMiddleware = ( err, req, res, next ) => {
  if ( err instanceof GeneralError ) {
    return res.status( err.getCode() ).json( { code: err.code, errors: err.errors } );
  }
  return res.status( 500 ).json( { code: err.code, errors: err.errors } );
};

module.exports = errorMiddleware;