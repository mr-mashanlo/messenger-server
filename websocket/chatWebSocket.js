const WebSocket = require( 'ws' );
const jwt = require( 'jsonwebtoken' );
const UserModel = require( '../schemas/userModel' );
const ChatModel = require( '../schemas/chatModel' );

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
    activeConnections.set( senderId, ws );
    await UserModel.updateOne( { _id: senderId }, { $set: { online: true } } );
    activeConnections.forEach( connection => connection.send( JSON.stringify( { type: 'user_connected', userId: senderId } ) ) );

    ws.on( 'message', async ( message ) => {
      const parsedMessage = JSON.parse( message );
      const reciever = activeConnections.get( parsedMessage.recieverId );

      let chat = await ChatModel.findOne( { members: [ parsedMessage.senderId, parsedMessage.recieverId ] } );
      if ( !chat ) {
        chat = await ChatModel.create( { members: [ parsedMessage.senderId, parsedMessage.recieverId ] } );
        const sender = activeConnections.get( parsedMessage.senderId );
        sender.send( JSON.stringify( { type: 'chat', chatId: chat._id } ) );
      }

      if ( reciever && reciever.readyState === WebSocket.OPEN ) {
        reciever.send( JSON.stringify(
          {
            type: 'message',
            chatId: chat._id,
            senderId: parsedMessage.senderId,
            timestamp: parsedMessage.timestamp,
            content: { text: parsedMessage.content.text }
          }
        ) );
      }
    } );

    ws.on( 'close', async () => {
      activeConnections.delete( senderId );
      await UserModel.updateOne( { _id: senderId }, { $set: { online: false } } );
      activeConnections.forEach( connection => connection.send( JSON.stringify( { type: 'user_disconnected', userId: senderId } ) ) );
    } );

  } );
};

module.exports = chatWebSocket;