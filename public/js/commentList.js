(function ($) {

    var movieId = $('#movieId').val();
    if (movieId != undefined) {
        var requestConfig = {
            url: '/comment/search',
            method: 'POST',
            data: {
                movieId: movieId
            }
        };

        $.ajax(requestConfig).then(function (responseMessage) {
            var searchList = $(responseMessage);
            var num = 1;
            var id = $("#movieId").val();
            var user = $("#userName1").val();

            for (var i = 0; i < searchList.length; i++) {
                var requestConfig2 = {
                    url: '/comment/searchSub',
                    method: 'POST',
                    data: {
                        parentId: searchList[i]._id
                    }
                };

                var li1 = `<div class="ms-3"> ${searchList[i].userName}</div>`
                // var li2 = `<li action="/comment/reply" method="post" style = "list-style: none"> ${searchList[i].content} <input type="text" value=${searchList[i]} name="parent" hidden>
                // <input type="text" name = "replyMessage"> <button id ="reply" >reply</button>
                // <ul id = "replyList${num}"></ul></li><br>`;
                var li2 = `<form action="/comment/reply" method="post"> ${searchList[i].content} <input type="text" value=${searchList[i].movieId} name="movieId" hidden>
                <input type="text" value=${user} name="userName" hidden>  <input type="text" value=${searchList[i]._id} name="parentId" hidden>
                 <input type="text" name = "replyMessage"> <button id ="reply" >reply</button>
                <ul id = "replyList"></ul></form><br>`;
                $('#commentList').append(li1);
                $('#commentList').append(li2);

                $.ajax(requestConfig2).then(function (responseMessage) {
                    var replyList = $(responseMessage);
                    // console.log(replyList);
                    for (var i = 0; i < replyList.length; i++) {
                        var li1 = `<li> ${replyList[i].userName}</li>`;
                        // console.log(replyList[i].userName);
                        // console.log(replyList[i].content);
                        var li2 = `<li style = "list-style: none"> ${replyList[i].content}</li></br>`
                        // var li3 = `<p>111111</p>`;
                        $(`#replyList`).append(li1);
                        $(`#replyList`).append(li2);
                        // $(`#replyList`).append(li3);
                    }
                    $(`#replyList${num}`).show();
                })
                num += 1;
            }
            $('#commentList').show();
        });
    }

    // $('#addComment').submit((event) => {
    //     event.preventDefault();


        
    // });



    $('#addComment').submit((event) => {
        event.preventDefault();
        // console.log($("#input-7-sm").val());
        if ($(`#content`).val().length != 0) {
            var id = $("#movieId").val();
            $.ajax({
                method: "POST",
                url: `http://localhost:3000/movie/comment`,
                data: {
                    userName: $("#userName1").val(),
                    movieId: id,
                    content: $("#content").val(),
                    rate: $("#input-7-sm").val()
                }
            }).then((data) => {
                window.location.replace(`/movie/${id}`);
                confirm("Comment successfully");
            }).fail((error) => {
                console.log(error);
                alert(error.responseJSON.error);
            });
        } else {
            alert('Please input content');
        }

    })



})(window.jQuery);