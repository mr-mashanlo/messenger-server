const MessageModel = require( '../schemas/messageModel' );

class SocketController {

  constructor() {
    this.activeConnections = new Map();
  };

  onConnect = async socket => {
    const senderId = socket.me.id;
    this.activeConnections.set( senderId, socket.id );
    socket.on( 'disconnect', () => this.onDisconnect( socket.me.id ) );
    socket.on( 'message', message => this.onMessage( socket, message ) );
    socket.on( 'fetch_messages', recieverId => this.onFetchMessages( socket, recieverId ) );
  };

  onDisconnect = id => {
    this.activeConnections.delete( id );
  };

  onMessage = async ( socket, message ) => {
    const recieverSocketId = this.activeConnections.get( message.recieverId );
    if ( recieverSocketId ) socket.to( recieverSocketId ).emit( 'message', message );
    await MessageModel.create( message );
  };

  onFetchMessages = async ( socket, recieverId ) => {
    const senderId = socket.me.id;
    const messages = await MessageModel.find( { $or: [ { senderId, recieverId }, { senderId: recieverId, recieverId: senderId } ] } );
    socket.emit( 'initialize_messages', messages );
  };

}

const socketController = new SocketController();

module.exports = socketController;