const socket = server => {

  console.log( server.id );
  console.log( server.handshake.headers.cookie );

};

module.exports = socket;