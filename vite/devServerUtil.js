const net = require('net');

function getActivePort(aHost = '0.0.0.0', aPort = 8000) {
  return new Promise((reslove) => {
    const server = net.createServer().listen(aPort, aHost);
    let tryPort = aPort;
    server.on('listening', () => {
      server.close();
      reslove(tryPort);
    });
    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        setTimeout(() => {
          tryPort += 1;
          server.listen(tryPort, aHost);
        }, 500);
      }
    });
  });
}

module.exports = {
  getActivePort
};
