const session = require("express-session");
const { users } = require("../../data");

(function($) {

	"use strict";
	$("#userManage").hide();
	var requestAdmin = {
		method: 'GET',
		url: 'http://localhost:3000/userInfo'
	}
	$.ajax(requestAdmin).then((object) => {      
        if(object.isAdmin == true){
			$("#userManage").show();
		}
		// var session = sessionStorage.getItem('user');
		// console.log(session);
		// if(session.get(user))
		if(object.username != null){
			$("#login").hide();
		}else{
			$("#logout").hide();
		}
    });
	
	
})(jQuery);
