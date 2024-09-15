const MessageModel = require( '../schemas/messageModel' );
const AlertModel = require( '../schemas/alertModel' );

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
    await MessageModel.create( message );
    const recieverSocketId = this.activeConnections.get( message.recieverId );
    if ( recieverSocketId ) { socket.to( recieverSocketId ).emit( 'message', message ); };
  };

  onFetchMessages = async ( socket, recieverId ) => {
    const senderId = socket.me.id;
    const messages = await MessageModel.find( { $or: [ { senderId, recieverId }, { senderId: recieverId, recieverId: senderId } ] } );
    socket.emit( 'initialize_messages', messages );
  };

  onFecthAlerts = async ( socket, recieverId ) => {
    const senderId = socket.me.id;
    const alerts = await this.saveAndGetAlerts( senderId, recieverId );
    socket.emit( 'initialize_alerts', alerts );
  };

  saveAndGetAlerts = async ( senderId, recieverId ) => {
    let alerts = await AlertModel.findOne( { user: recieverId } );
    if ( alerts ) {
      return await AlertModel.findOneAndUpdate( { user: recieverId }, { $addToSet: { alerts: senderId } } );
    } else {
      return await AlertModel.create( { user: recieverId, alerts: [ senderId ] } );
    }
  };

}

const socketController = new SocketController();

module.exports = socketController;