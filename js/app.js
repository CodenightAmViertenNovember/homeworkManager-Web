function submitLogin(){
	let username = $('#userName').val();
	let password = $('#userPassword').val();

	if(username!='' && password!='' && username!=null && password!=null) {
		sendUserLogin(username, password);
	} else {
		showError('Fill in all fields and try again!', 4000);
	}
}
