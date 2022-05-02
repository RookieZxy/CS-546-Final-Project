(function ($) {
    var movieId = $('#movieId').val();

    $("#comment").hide();
    $("#alert").hide();
    console.log($("#comment").val())
    if($("#comment").val() == 1){
        alert($("#alert").val());
    }else if($("#comment").val() == 3){
        confirm('reply successfully');
    }

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
            // var num = '1';
            // var id = $("#movieId").val();
            var user = $("#userName1").val();

            for (var i = 0; i < searchList.length; i++) {
                var requestConfig2 = {
                    url: '/comment/searchSub',
                    method: 'POST',
                    data: {
                        parentId: searchList[i]._id
                    }
                };
                // console.log(replyList);
                // var li = `<div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." /></div>`
                // var li1 = ` <div class="fw-bold"> ${searchList[i].userName}   &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   Rating: ${searchList[i].rate}</div></br>`
                // var li2 = `<form action="/comment/reply" method="post"> ${searchList[i].content} <input type="text" value=${searchList[i].movieId} name="movieId" hidden>
                // <input type="text" value=${user} name="userName" hidden>  <input type="text" value=${searchList[i]._id} name="parentId" hidden>
                // <input type="text" name = "replyMessage"> <button id ="reply" >reply</button></br></br>
                // <ul id = ${searchList[i]._id}></ul></form>`;
                var li = `<div class="d-flex mb-4">  <div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." /></div>
                <div class="ms-3"> <div class="fw-bold"> ${searchList[i].userName}   &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   Rating: ${searchList[i].rate}</div>
                <form action="/comment/reply" method="post"> ${searchList[i].content} <input type="text" value=${searchList[i].movieId} name="movieId" hidden>
                <input type="text" value=${user} name="userName" hidden>  <input type="text" value=${searchList[i]._id} name="parentId" hidden>
                <input type="text" name = "replyMessage"> <button id ="reply" >reply</button>
                <ul id = ${searchList[i]._id}></ul></form>   </div></div>`;

                $('#commentList').append(li);
                // $('#commentList').append(li1);
                // $('#commentList').append(li2);

                $.ajax(requestConfig2).then(function (responseMessage) {
                    var replyList = $(responseMessage);
                    // console.log(replyListName);
                    for (var i = 0; i < replyList.length; i++) {
                        // var li1 = `<div class="fw-bold"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />  ${replyList[i].userName}</div>`;
                        // var li2 = `<li style = "list-style: none"> ${replyList[i].content}</li></br>`
                        var li1 = `<div class="d-flex mt-4"><div class="flex-shrink-0"><img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." /></div>
                        <div class="ms-3"> <div class="fw-bold">  ${replyList[i].userName}</div> 
                         ${replyList[i].content}</div></div>`
                        $(`#${replyList[i].parentId}`).append(li1);
                        // $(`#${replyList[i].parentId}`).append(li2);
                    }
                    // $(`#replyList`).show();
                })
                // num += 1;
            }
            $('#commentList').show();
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