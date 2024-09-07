const WebSocket = require( 'ws' );
const jwt = require( 'jsonwebtoken' );
const UserModel = require( '../schemas/userModel' );

const chatWebSocket = ( server ) => {
  const wss = new WebSocket.Server( { server } );
  const activeConnections = new Map();

  wss.on( 'connection', async ( ws, req ) => {

    const token = req.headers.cookie.split( '=' )[1];
    if ( !token ) {
      ws.close();
      return;
    }

    const verifiedToken = jwt.verify( token, process.env.ACCESS_KEY, ( error, decoded ) => { return error || decoded; } );
    if ( verifiedToken instanceof Error ) {
      ws.close();
      return;
    }

    const senderId = verifiedToken._id;
    const users = await UserModel.find().select( '-password' );
    activeConnections.set( senderId, ws );
    const updatedUsers = users.map( user => ( Array.from( activeConnections.keys() ).includes( user.id ) ? { ...user._doc, online: true } : user ) );
    activeConnections.forEach( connection => connection.send( JSON.stringify( { type: 'users', data: updatedUsers } ) ) );

    ws.on( 'message', ( message ) => {
      const parsedMessage = JSON.parse( message );
      const receiverId = parsedMessage.receiverId;
      const messageContent = parsedMessage.data;
      const targetWs = activeConnections.get( receiverId );
      if ( targetWs && targetWs.readyState === WebSocket.OPEN ) {
        targetWs.send( JSON.stringify( { type: 'message', senderId, receiverId, data: messageContent } ) );
      }
    } );

    ws.on( 'close', () => {
      activeConnections.delete( senderId );
      const updatedUsers = users.map( user => ( Array.from( activeConnections.keys() ).includes( user.id ) ? { ...user._doc, online: true } : user ) );
      activeConnections.forEach( connection => connection.send( JSON.stringify( { type: 'users', data: updatedUsers } ) ) );
    } );

  } );
};

module.exports = chatWebSocket;