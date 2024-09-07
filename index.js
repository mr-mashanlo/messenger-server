require( 'dotenv' ).config();
const http = require( 'http' );
const cors = require( 'cors' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const cookieParser = require( 'cookie-parser' );
const authRouter = require( './routers/authRouter' );
const userRouter = require( './routers/userRouter' );
const chatWebSocket = require( './websocket/chatWebSocket' );
const errorMiddleware = require( './middlewares/errorMiddleware' );

const app = express();
const server = http.createServer( app );
app.use( cors( { credentials: true, origin: [ process.env.FRONT_URI ] } ) );
app.use( cookieParser() );
app.use( express.json() );
app.use( '/auth', authRouter );
app.use( '/user', userRouter );
app.use( errorMiddleware );

chatWebSocket( server );

const start = async () => {
  try {
    await mongoose.connect( process.env.MONGODB_URI );
    server.listen( process.env.PORT, () => console.log( `Server is running on port ${process.env.PORT}` ) );
  } catch ( error ) {
    console.log( error );
  }
};

start();