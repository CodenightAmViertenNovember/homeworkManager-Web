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
			if(json.role > 0) {
				console.log(json);
				localStorage.setItem("currentUserSid", json.sid);
				localStorage.setItem("currentUserRole", json.role);
				window.location.href = 'homeworkView.html';
			} else {
				showError('This is an invalid login. Try again.', 4000);
			}
		} else if (json.type === 'homework') {

			console.log('test');
			json.forEach(function(item, index) {
				$homeworkList = $('.homeworkList');
				if(index != 0) {
					$homeworkList.append('<div class="bottomBorder"></div>');
				}

				let tempDate = new Date(item.date);
				let date = tempDate.getDate() + ' / ' + (tempDate.getMonth() + 1) + ' / ' + getFullYear();

				$homeworkList.append('<div class="homeworkElement">');
				$homeworkList.append('<div class="subjectSymbol">');
				$homeworkList.append('<p class="subjectSymbol">' + item.subject.slice(0,2).toUpperCase() + '</p>');
				$homeworkList.append('</div>');
				$homeworkList.append('<div class="homeworkWrap">');
				$homeworkList.append('<div class="homeworkTitle">' + item.content + '</div>');
				$homeworkList.append('<div class="dueDate">' + date + '</div>');
				$homeworkList.append('</div>');
				$homeworkList.append('</div>');
			});

		} else if (json.type == 'get_classes') {
			json.forEach(function(item, index) {
				$('#classSelect').append('<option id="class' + item.id + '">' + item.name + '</option>');
			});
		} else if (json.type == 'sid_gone') {
			let sid = localStorage.getItem("currentUserSid");
			connection.send(JSON.stringify({type: 'logout', sid: sid}));
			window.location.href = 'index.html';
		}
	} catch (e) {
		console.log('error when parsing json', e);
	}
};

function sendUserLogin(username, password) {
	connection.send(JSON.stringify({type: 'login', username: username, password: password}));
}

function requestHomeworkView(){
	// let currentUser = localStorage.getItem("currentUser");
}


