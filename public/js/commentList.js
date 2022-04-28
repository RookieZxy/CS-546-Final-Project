(function ($) {
    var movieId = $('#movieId').val().trim();
    var requestConfig = {
        url: '/comment/search',
        method: 'POST',
        data: {movieId: movieId}
    };
    
    $.ajax(requestConfig).then(function (responseMessage) {
        var searchList = $(responseMessage);
        for (var i = 0; i < searchList.length; i++) {
            var li1 = `<li> ${searchList[i].userName}</li>`
            var li2 = `<li style = "list-style: none"> ${searchList[i].content} <input type="text" value=${searchList[i]._id} name="parentId" hidden> <button id ="reply" >reply</button></li><br>`;
            $('#commentList').append(li1);
            $('#commentList').append(li2);
        }
        $('#commentList').show();
    })


})(window.jQuery);