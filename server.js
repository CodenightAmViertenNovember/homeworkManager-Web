const PORT = 3001;

var admin = require('firebase-admin');
var http = require('http');
var generateSafeId = require('generate-safe-id');
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
		var value = snapshot.val(), k, role = 0, successful, uid = null;
		for (k in value) {
			if (value[k].name === username && value[k].password === password) {
				successful = true;
				role = value[k].role;
				uid = k;
				break;
			}
		}
		callback(successful, uid, role);
	}, (err) => {
		callback(false, null, 0);
	});
}
function getHomework(className, callback) {
	db.ref('head/classes/' + className).once('value', (snapshot) => {
		var value = snapshot.val(), k, list = [];
		if (value.homework) {
			for (k in value.homework) list.push(value.homework[k]);
		}
		callback(list);
	}, (err) => {
		callback([]);
	});
}


var sessionIds = [];
wss.on('connection', (ws, req) => {
	// keep a session object as reference
	var sessionObj = {
		socket: ws,
		last_message: Date.now(),
		sid: generateSafeId(),
		uid: null,
		role: 0
	};
	// add to sessionObj to array
	sessionIds.push(sessionObj);
	sessionObj.socket.on('message', (message) => {
		// store timestamp to detect inactive users
		sessionObj.last_message = Date.now();
		try {
			var json = JSON.parse(message);
			if (json.type === 'login') {
				// login message
				checkLogin(json.username, json.password, (s, uid, role) => {
					// if successfully authorized, 
					if (role) {
						sessionObj.role = role;
						sessionObj.uid = uid;
					}
					ws.send(JSON.stringify({
						type: 'login',
						role: role
					}));
				});
			} else {
				// other messages, require session id and appropriate authority level
				if (json.sid !== sessionObj.sid) {
					console.log(json.sid);
					var i = sessionIds.length;
					while (i-- != 0) {
						console.log(i, sessionIds[i]);
						if (sessionIds[i].sid === json.sid) break;
					}
					if (i < 0) {
						// not found
						ws.send(JSON.stringify({
							type: 'sid_gone'
						}));
						return;
					} else {
						// re-use old session
						var reUse = sessionIds[i];
						sessionObj.role = reUse.role;
						sessionObj.uid = reUse.uid;
						// delete old one
						sessionIds.splice(i, 1);
						console.log('reuse', json.sid, i);
					}
				}
				// check for neccesarry authority level
				if (sessionObj.role) {
					// respond to client requests
					switch (json.type) {
						case 'homework':
							if (sessionObj.role) {
								// authorized user
								getHomework(json.classId, (list) => {
									// send homework
									ws.send(JSON.stringify({
										type: 'homework',
										homework: list
									}));
								});
							}
							break;
					}
				} else {
					// not authorized
					ws.send(JSON.stringify({
						type: 'unauth'
					}));
				}
			}
		} catch (ex) {
			console.log('invalid json data', ex);
		}
	});
});
setInterval(() => {
	sessionIds.forEach((element, index) => {
		if (element.last_message < Date.now() - 1000 * 60 * 30) {
			// remove element after 30 minutes of inactivity
			if (element.socket) element.socket.close();
			sessionIds.splice(index, 1);
		}
	});
}, 1000);


/*
let server = http.createServer((req, res) => {
	var url = req.url;

	//beautify URL, shows foo.bar when requested foo.bar/index.html
	if (url === '/index.html') {
		res.writeHead(301, {'Location': '/'});
		res.end();
		return;
	}
	if (url === '/') {
		url = '/index.html';
	}
	fs.readFile('./' + url, (err, data) => {
		if (err) {
			res.writeHead(404);
			res.end('Error 404:\nPage not found\n');
		} else {
			let extension = url.slice(url.lastIndexOf('.') - url.length + 1);
			let mimeList = { html: 'text/html', less: 'text/css', css: 'text/css', svg: 'image/svg+xml', png: 'image/png', js: 'application/javascript' },
				mime = 'application/octet-stream';

			if (extension in mimeList) mime = mimeList[extension];

			res.writeHead(200, {'Content-Type': mime});
			res.end(data);
		}
	});
});
server.listen(config['http-port']);
*/
