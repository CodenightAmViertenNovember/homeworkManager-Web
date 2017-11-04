const PORT = 3001;

var admin = require('firebase-admin');
var http = require('http');
var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: PORT });

var serviceAccount = require('./firebase_key.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://tidal-airway-182817.firebaseio.com'
});

var db = admin.database();

function checkLogin(username, password, callback) {
	db.ref('head/users').once('value', (snapshot) => {
		var value = snapshot.val(), k, l, successful, uid = null;
		for (k in value) {
			if (value[k].name === username && value[k].password === password) {
				successful = true;
				l = value[k].role + 1;
				uid = k;
				break;
			}
		}
		callback(successful, uid, l);
	}, (err) => {
		callback(false, null, 0);
	});
}
function getHomework(className, callback) {
	db.ref('head/classes/' + className).once('value', (snapshot) => {
		var value = snapshot.val(), k, list = [];
		for (k in value.homework) list.push(value.homework[k]);
		callback(list);
	}, (err) => {
		callback([]);
	});
}

wss.on('connection', (ws, req) => {
	var authorityLevel = false, userId, lastMsg = Date.now();
	ws.on('message', (message) => {
		lastMsg = Date.now();
		try {
			let json = JSON.parse(message);
			switch (json.type) {
				case 'login':
					checkLogin(json.username, json.password, (s, uid, lvl) => {
						// if successfully authorized, 
						if (s && uid) {
							authorityLevel = lvl;
							userId = uid;
						}
						ws.send(JSON.stringify({
							type: 'login',
							successful: s,
							userId: uid
						}));
					});
					break;
				case 'homework':
					if (authorized) {
						// authorized user
						getHomework(json.classId, (list) => {
							// send homework
							ws.send(JSON.stringify({
								type: 'homework',
								homework: list
							}));
						});
					} else {
						// not authorized
						ws.send(JSON.stringify({
							type: 'unauth'
						}));
					}
					break;
			}
		} catch (ex) {
			console.log('invalid json data');
		}
	});
	ws.on('close', (err) => {
		console.log('connection closed', err);
		delete ws;
	});

	var intervalId = setInterval(() => {
		if (Date.now() - lastMsg > 1000 * 60 * 10) {
			console.log('deleted inactive user');
			clearInterval(intervalId);
			delete ws;
		}
	}, 1000);
});
