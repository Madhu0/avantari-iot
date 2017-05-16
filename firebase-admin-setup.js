var admin = require("firebase-admin");

var serviceAccount = require("./avantri-iot-project-firebase-adminsdk-un82o-51661dce92.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://avantri-iot-project.firebaseio.com/"
});

var db = admin.database();
var ref = db.ref("sensedData/");

module.exports ={
  ref,
};