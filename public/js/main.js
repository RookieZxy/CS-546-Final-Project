(function ($) {
	"use strict";
	$("#userManage").hide();
	var requestAdmin = {
		method: 'GET',
		url: 'http://localhost:3000/userInfo'
	}
	
	$.ajax(requestAdmin).then((object) => {
		if (object.isAdmin == true) {
			$("#userManage").show();
		}
		if (object.username != null) {
			$("#login").hide();
			$("#signup").hide();
		} else {
			$("#logout").hide();
		}
	});
	console.log($("#login_flag").val())
	if($("#login_flag").val() == 'false'){
		alert("Please login first")
	}
	// $('#users').click(function () {
	// 	$.ajax({
	// 		method: 'GET',
	// 		url: 'http://localhost:3000/users'
	// 	}).then((object) => {
			
	// 	})
	// })

})(jQuery);