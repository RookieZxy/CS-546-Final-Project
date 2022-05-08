(function ($) {
  var movieId = $("#movieId").val();

  $("#comment").hide();
  $("#alert").hide();
  console.log($("#comment").val());
  if ($("#comment").val() == 1) {
    alert($("#alert").val());
  } else if ($("#comment").val() == 3) {
    confirm("reply successfully");
  }

  if (movieId != undefined) {
    var requestConfig = {
      url: "/comment/search",
      method: "POST",
      data: {
        movieId: movieId,
      },
    };

    $.ajax(requestConfig).then(function (responseMessage) {
      var searchList = $(responseMessage);
      // var num = '1';
      // var id = $("#movieId").val();
      var user = $("#userName1").val();

      for (var i = 0; i < searchList.length; i++) {
        var requestConfig2 = {
          url: "/comment/searchSub",
          method: "POST",
          data: {
            parentId: searchList[i]._id,
          },
        };
        var li = `<li class="d-flex flex-start mt-3">
                    <img class="rounded-circle shadow-1-strong me-3"
                         src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp" alt="avatar"
                         width="65"
                         height="65"/>
                    <div class="flex-grow-1 flex-shrink-1">
                        <div>
                            <form action="/comment/reply" method="post">
                            <div class="d-flex justify-content-between align-items-center">
                                <p class="mb-1" style="color: black;">
                                    ${searchList[i].userName} <span>- Rating: ${searchList[i].rate}</span>
                                </p>
                                <button class="btn btn-success" id ="reply" type="submit">reply</button>
                            </div>
                                <p class="mb-1" style="color: black;">
                                    ${searchList[i].content}
                                </p>
                                <input type="text" value=${searchList[i].movieId} name="movieId" hidden>
                                <input type="text" value=${user} name="userName" hidden>
                                <input type="text" value=${searchList[i]._id} name="parentId" hidden>
                                <label for="replyMessage" hidden></label>
                                <textarea class="form-control w-75" id="replyMessage" name="replyMessage" placeholder="Reply to this comment"></textarea>
                            </form>
                            <ul id = ${searchList[i]._id}></ul>
                        </div></div></li>`;

        $("#commentList").append(li);

        $.ajax(requestConfig2).then(function (responseMessage) {
          var replyList = $(responseMessage);
          // console.log(replyListName);
          for (var i = 0; i < replyList.length; i++) {
            var li1 = `<li class="d-flex flex-start mt-3">
                                    <img class="rounded-circle shadow-1-strong"
                                         src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp"
                                         alt="avatar"
                                         width="60" height="60"/>
                                    <div class="flex-grow-1 flex-shrink-1">
                                        <div>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <p class="mb-1" style="color: black;">
                                                    ${replyList[i].userName}
                                                </p>
                                            </div>
                                            <p class="small mb-0" style="color: black;">
                                                ${replyList[i].content}
                                            </p>
                                        </div>
                                    </div>
                                </li>`;

            $(`#${replyList[i].parentId}`).append(li1);
            // $(`#${replyList[i].parentId}`).append(li2);
          }
          // $(`#replyList`).show();
        });
        // num += 1;
      }
      $("#commentList").show();
    });
  }

  // $('#replyComment').submit((event) => {
  //     event.preventDefault();
  //     console.log(11)
  //     if($('#replyMessage').val().length != 0){
  //         var id = $("#movieId").val();
  //         $.ajax({
  //             method: "POST",
  //             url: `http://localhost:3000/movie/comment/reply`,
  //             data: {
  //                 userName: $("#userName").val(),
  //                 parentId: $("#parentId").val(),
  //                 movieId: id,
  //                 replyMessage: $("#replyMessage").val(),
  //             }
  //         }).then((data) => {
  //             window.location.replace(`/movie/${id}`);
  //             confirm("Reply successfully");
  //         }).fail((error) => {
  //             console.log(error);
  //             alert(error.responseJSON.error);
  //         });
  //     }else {
  //         alert('Please input message');
  //     }

  // });

  $("#addComment").submit((event) => {
    event.preventDefault();
    // console.log($("#input-7-sm").val());
    if ($(`#content`).val().length != 0) {
      var id = $("#movieId").val();
      $.ajax({
        method: "POST",
        url: `/movie/comment`,
        data: {
          userName: $("#userName1").val(),
          movieId: id,
          content: $("#content").val(),
          rate: $("#input-7-sm").val(),
        },
      })
        .then((data) => {
          $("#commentList").empty();
          if (movieId != undefined) {
            var requestConfig = {
              url: "/comment/search",
              method: "POST",
              data: {
                movieId: movieId,
              },
            };

            $.ajax(requestConfig).then(function (responseMessage) {
              var searchList = $(responseMessage);
              // var num = '1';
              // var id = $("#movieId").val();
              var user = $("#userName1").val();

              for (var i = 0; i < searchList.length; i++) {
                var requestConfig2 = {
                  url: "/comment/searchSub",
                  method: "POST",
                  data: {
                    parentId: searchList[i]._id,
                  },
                };
                var li = `<li class="d-flex flex-start mt-3">
                                <img class="rounded-circle shadow-1-strong me-3"
                                     src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(32).webp" alt="avatar"
                                     width="65"
                                     height="65"/>
                                <div class="flex-grow-1 flex-shrink-1">
                                    <div>
                                        <form action="/comment/reply" method="post">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <p class="mb-1" style="color: black;">
                                                ${searchList[i].userName} <span>- Rating: ${searchList[i].rate}</span>
                                            </p>
                                            <button class="btn btn-success" id ="reply" type="submit">reply</button>
                                        </div>
                                            <p class="mb-1" style="color: black;">
                                                ${searchList[i].content}
                                            </p>
                                            <input type="text" value=${searchList[i].movieId} name="movieId" hidden>
                                            <input type="text" value=${user} name="userName" hidden>
                                            <input type="text" value=${searchList[i]._id} name="parentId" hidden>
                                            <label for="replyMessage" hidden></label>
                                            <textarea class="form-control w-75" id="replyMessage" name="replyMessage" placeholder="Reply to this comment"></textarea>
                                        </form>
                                        <ul id = ${searchList[i]._id}></ul>
                                    </div></div></li>`;

                $("#commentList").append(li);

                $.ajax(requestConfig2).then(function (responseMessage) {
                  var replyList = $(responseMessage);
                  // console.log(replyListName);
                  for (var i = 0; i < replyList.length; i++) {
                    var li1 = `<li class="d-flex flex-start mt-3">
                                                <img class="rounded-circle shadow-1-strong"
                                                     src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp"
                                                     alt="avatar"
                                                     width="60" height="60"/>
                                                <div class="flex-grow-1 flex-shrink-1">
                                                    <div>
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <p class="mb-1" style="color: black;">
                                                                ${replyList[i].userName}
                                                            </p>
                                                        </div>
                                                        <p class="small mb-0" style="color: black;">
                                                            ${replyList[i].content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>`;

                    $(`#${replyList[i].parentId}`).append(li1);
                    // $(`#${replyList[i].parentId}`).append(li2);
                  }
                  // $(`#replyList`).show();
                });
                // num += 1;
              }
              $("#commentList").show();
            });
          }
          confirm("Comment successfully");
        })
        .fail((error) => {
          console.log(error);
          alert(error.responseJSON.error);
        });
    } else {
      alert("Please input content");
    }
  });
})(window.jQuery);
