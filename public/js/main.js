(function ($) {
	"use strict";
	$("#userManage").hide();
	$("#addmovie").hide();
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
			$("#addmovie").show();
		} else {
			$("#logout").hide();
		}
		if($("#login_flag").val() == 'false'){
			alert($("#error").val())
		}
	});


})(jQuery);