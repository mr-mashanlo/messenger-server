const Router = require( 'express' );
const router = new Router();
const { check } = require( 'express-validator' );
const authController = require( '../controllers/authController' );
const authMiddleware = require( '../middlewares/authMiddleware' );

router.post( '/signin', [ check( 'email', 'Invalid email address' ).isEmail(), check( 'password', 'Invalid password' ).isLength( { min: 6 } ) ], authController.signin );
router.post( '/signup', [ check( 'email', 'Invalid email address' ).isEmail(), check( 'password', 'Invalid password' ).isLength( { min: 6 } ) ], authController.signup );
router.get( '/logout', authMiddleware, authController.logout );
router.delete( '/delete', authMiddleware, authController.delete );
router.get( '/token', authController.token );

module.exports = router;