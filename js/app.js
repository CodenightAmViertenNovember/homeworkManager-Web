function submitLogin(){
	let username = $('#userName').val();
	let password = $('#userPassword').val();

	if(username!='' && password!='' && username!=null && password!=null) {

	} else {
		showError('Fill in all fields and try again!', 4000);
	}
}