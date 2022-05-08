(function ($) {
  "use strict";
  $("#userManage").hide();
  $("#addmovie").hide();
  $("#invalidList").hide();
  var requestAdmin = {
    method: "GET",
    url: "/userInfo",
  };

  $.ajax(requestAdmin).then((object) => {
    if (object.isAdmin == true) {
      $("#userManage").show();
      $("#invalidList").show();
    }
    if (object.username != null) {
      $("#login").hide();
      $("#signup").hide();
      $("#addmovie").show();
    } else {
      $("#logout").hide();
    }
    if ($("#login_flag").val() == "false") {
      alert($("#error").val());
    }
  });
})(jQuery);
