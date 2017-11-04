window.WebSocket = window.WebSocket || window.MozWebSocket;

const WS_ADDR = 'ws://localhost:3001/';

var connection = new WebSocket(WS_ADDR);

connection.onopen = function() {
	// connection opened successfully
	console.log('connection opened');
};

connection.onerror = function(error) {
	// an error occurred
	console.log(error);
};

connection.onclose = function() {
	// connection to server lost
	console.log('connection lost');
};

connection.onmessage = function(message) {
	// master send data
	try {
		var json = JSON.parse(message.data);
		console.log('received json:', json);
		if(json.type === 'login') {
			if(json.successful) {
				window.location.href = 'homeworkView.html';
			} else {
				showError('This is an invalid login. Try again.', 4000);
			}
		}
	} catch (e) {
		console.log('error when parsing json', e);
	}
};

function sendUserLogin(username, password) {
	connection.send(JSON.stringify({type: 'login', username: username, password: password}));
}
