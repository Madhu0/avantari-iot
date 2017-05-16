var express = require("express");
//var bodyPraser = require("body-parser");
var firebaseRef = require("./firebase-admin-setup.js").ref;
var firebaseAuth = require("firebase-auth");

var app = express();
var ws = require("express-ws")(app);
// app.use(bodyPraser);

var subcribers = [];

app.get('/client.htm', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

app.get('/iot-client.htm', function(req, res){
  res.sendFile(__dirname + '/IOT-client.html');
})

app.ws('/sensedData', function(ws, req){
  
  // console.log("reached here 1", firebaseRef);
  // console.log(req);
  
  ws.on('message', function(message){
    // console.log("Client message: -> ", message);
    ws.send(message);
    var newRef = firebaseRef.push();
    newRef.set({
      time: (new Date()).toString(),
      value: message, 
    });
    subcribers.forEach(function(v, index){
      if (v.readyState < 3) {
        v.send(message);
      } else {
        subcribers.slice(index, 1);
      }
    });
  });
  
  ws.on('error', function(error){
    console.error("error", error);
  })
})

app.ws('/notifySubscribers', function(ws, req){
  
  // console.log("reached here 1", firebaseRef);
  // console.log(req);
  
  // ws.on('message', function(message){
  //   console.log("Client message: -> ", message);
  //   ws.send(message);
  //   var newRef = firebaseRef.push();
  //   newRef.set({
  //     time: new Date(),
  //     value: message, 
  //   });
  // })
  
  subcribers.push(ws);

  ws.on('error', function(error){
    console.error("error", error);
  })
})

app.listen(8000);



// var io = require("socket.io").listen(app.listen(port));
// io.sockets.on("connection", function(socket){
//   console.log("connection established");
//   socket.emit("message", {"message": "loll, funny syntax"});
//   socket.on("message", function(data){
//     console.log("data inbound: -> ", data);
//   })
// })
// console.log("listening on the port 8000");
