function submitLogin(){
	let username = $('#userName').val();
	let password = $('#userPassword').val();

	if(username!='' && password!='' && username!=null && password!=null) {
		// sendUserLogin(username, password);
		connection.send(JSON.stringify({type: 'login', username: username, password: password}));
	} else {
		showError('Fill in all fields and try again!', 4000);
	}
}

function loadHomeworkView(){
	let sid = localStorage.getItem("currentUserSid");
	let role = parseInt(localStorage.getItem("currentUserRole"));

	console.log(role);
	
	switch(role) {
	    case 0:
	        window.location.href = 'index.html';
	        break;
	    case 1:
	        console.log('student');
	        connection.send(JSON.stringify({type: 'homework', sid: sid}));
	        break;
	    case 2:
	        $('.teacherOption').show();
	        connection.send(JSON.stringify({type: 'homework', sid: sid}));
	        connection.send(JSON.stringify({type: 'get_classes', sid: sid}));
	        break;
	    case 3:
	        window.location.href = 'adminView.html';
	        break;
	    default:
	        console.log('error');
	}
}

function logout(){
	connection.send(JSON.stringify({type: 'logout', sid: sid}));
	window.location.href = 'index.html';
}