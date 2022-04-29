(function ($) {
    var movieId = $('#movieId').val().trim();
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


        for (var i = 0; i < searchList.length; i++) {
            var requestConfig2 = {
                url: '/comment/searchSub',
                method: 'POST',
                data: {
                    parentId: searchList[i]._id
                }
            };

            var li1 = `<li> ${searchList[i].userName}</li>`
            // var li2 = `<li action="/comment/reply" method="post" style = "list-style: none"> ${searchList[i].content} <input type="text" value=${searchList[i]} name="parent" hidden>
            // <input type="text" name = "replyMessage"> <button id ="reply" >reply</button>
            // <ul id = "replyList${num}"></ul></li><br>`;
            var li2 = `<form action="/comment/reply" method="post"> ${searchList[i].content} <input type="text" value=${searchList[i].movieId} name="movieId" hidden>
            <input type="text" value=${searchList[i].userName} name="userName" hidden>  <input type="text" value=${searchList[i]._id} name="parentId" hidden>
             <input type="text" name = "replyMessage"> <button id ="reply" >reply</button>
            <ul id = "replyList${num}"></ul></form><br>`;
            $('#commentList').append(li1);
            $('#commentList').append(li2);

            $.ajax(requestConfig2).then(function (responseMessage) {
                var replyList = $(responseMessage);
                console.log(replyList);
                for(var i = 0; i < replyList.length; i++){
                    var li1 = `<li> ${replyList[i].userName}</li>`;
                    var li2 = `<li style = "list-style: none"> ${replyList[i].content}</li></br>`

                    $(`#replyList${num}`).append(li1);
                    $(`#replyList${num}`).append(li2);
                }
                $(`#replyList${num}`).show();
            });
            num += 1;
        }
        $('#commentList').show();
    });


})(window.jQuery);