(function($) {

	"use strict";

	$('#users').click(function () {
		$.ajax({
			method: 'GET',
			url: 'http://localhost:3000/users'
		}).then((object) => {
			
		})
	})

})(jQuery);
