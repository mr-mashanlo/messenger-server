require( 'dotenv' ).config();
const cors = require( 'cors' );
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const cookieParser = require( 'cookie-parser' );
const authRouter = require( './routers/authRouter' );
const userRouter = require( './routers/userRouter' );
const errorMiddleware = require( './middlewares/errorMiddleware' );
const authSocketMiddleware = require( './middlewares/authSocketMiddleware' );
const socket = require( './websocket/socket' );

const app = express();

app.use( cors( { credentials: true, origin: process.env.FRONT_URI } ) );
app.use( cookieParser() );
app.use( express.json() );
app.use( '/auth', authRouter );
app.use( '/user', userRouter );
app.use( errorMiddleware );

mongoose.connect( process.env.MONGODB_URI );

const server = app.listen( process.env.PORT, () => console.log( `Server is running on port ${process.env.PORT}` ) );
const io = require( 'socket.io' )( server, { cors: { credentials: true, origin: process.env.FRONT_URI } } );

io.use( authSocketMiddleware );
io.on( 'connection', socket );