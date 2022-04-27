(function($) {

	"use strict";
	$("#userManage").hide();
	var requestAdmin = {
		method: 'GET',
		url: 'http://localhost:3000/home/userInfo'
	}
	$.ajax(requestAdmin).then((object) => {      
        if(object.isAdmin == true){
			$("#userManage").show();
		}

		if(object.username != null){
			$("#login").hide();
		}
    });
	
	
})(jQuery);
