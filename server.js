const PORT = 3001;

var admin = require('firebase-admin');
var http = require('http');
var wss = new WebSocket.Server({ port: PORT });

var serviceAccount = require('./firebase_key.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://tidal-airway-182817.firebaseio.com'
});

var db = admin.database();

function checkLogin(username, password, callback) {
	db.ref('head/users').once('value', (snapshot) => {
		var value = snapshot.val(), k, successful;
		for (k in value) {
			if (value[k].name === username && value[k].password === password) {
				successful = true;
				break;
			}
		}
		callback(successful);
	}, (err) => {
		callback(false);
	});
}

/*checkLogin('florian.winkler', 'abc123', (result) => {
	console.log(result);
});*/

function getHomeworks(className, callback) {
	db.ref('head/classes/' + className).once('value', (snapshot) => {
		var value = snapshot.val(), k, list = [];
		for (k in value.homework) list.push(value.homework[k]);
		callback(list);
	}, (err) => {
		callback({error: ''});
	});
}
getHomeworks('1', (err) => {
	console.log('yay');
});



wss.on('connection', (ws, req) => {

	ws.on('message', (message) => {
		let json = JSON.parse(message);
		console.log(json);
		ws.send(JSON.stringify({data: 'value'}));
	});
});

