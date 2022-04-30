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

		if(object.username != null){
			$("#login").hide();
		}else{
			$("#logout").hide();
		}
    });
	
	
})(jQuery);
