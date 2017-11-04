var admin = require("firebase-admin");

var serviceAccount = require("./firebase_key.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://tidal-airway-182817.firebaseio.com"
});

var db = admin.database();


