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
}
connection.onmessage = function(message) {
	// master send data
	try {
		var json = JSON.parse(message.data);
		console.log('received json:', json);
	} catch (e) {
		console.log('error when parsing json');
	}
};
connection.send(JSON.stringify({data: 'value'});
