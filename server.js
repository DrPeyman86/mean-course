let http = require('http');
const debug = require('debug')('node-angular');
const app = require('./nodeJs/app');

//function to make sure the port number we get from process.env.PORT is a valid number
const normalizePort = val => {
  var port = parseInt(val, 10);//determine if integer

  if (isNaN(port)) {
    //named pipe
    return val;
  }

  if (port >= 0) {
    //port number
    return port;
  }

  return false;

}

//catch certain function if it occurs in app and exit the app properly
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCESS":
      console.error(bind + " requires elevated privilages");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;

  }

};

//output to debug what the address/port we are listening to as incoming requests are made to log what is being requested
const onListening = ()=> {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe" + addr: "port " + port;
  debug("Listening on " + bind)
}

const port = normalizePort(process.env.PORT || "3000")//send 3000 as a string since process.env.PORT is also sent as string. but you could also send as number
//add the app as a listener for incoming requests from that server defined here
app.set('port', port)
const server = http.createServer(app)
// const server = http.createServer((req,res)=>{
//   res.end('This is my first response');
// })

server.on("error", onError);//tell us if some error occured in the app
server.on("Listening", onListening);//or tell us if everything is ok and output what was being listened to at time of request to app
server.listen(port);
