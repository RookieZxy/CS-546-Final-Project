(function ($) {

    $('#searchForm').submit((event) => {
        event.preventDefault();
        $('#error').hide();
        //$('#showList').empty();
        $('#showList').show();
        var inputText = $('#search_termInput').val();
        if(inputText === ''){
            $('#showList').show();
            $('#error').show();
            $('#search_termInput').val("");
        }
        else{
            $('#showList').empty();
            $('#error').hide();
            var requestConfig = {
                url: '/movie/search',
                method: 'POST',
                data: {search_termInput:inputText}
            };
            $.ajax(requestConfig).then(function(responseMessage){
                var searchList = $(responseMessage);
                for (var i = 0; i < searchList.length; i++)
                {

                    var li2 = `<li><a href='/movie/${searchList[i]._id}'> ${searchList[i].name}</a></li>`;
                    $('#showList').append(li2);
                }
                $('#show').hide();
                $('#showList').show();
                $('#homeLink').hide();
            })
        }
    })

    // $('#commentForm').submit((event) => {
    //     event.preventDefault();
    //     const userName = userName;
    //     const movieId = req.body.movieId;
    //     var myDate = new Date();
    //     const date = myDate.toLocaleDateString(); 
    //     const rate = req.body.rate;
    //     var inputText = $('#search_termInput').val().trim();
    //     if(inputText === ''){
    //         $('#showList').show();
    //         $('#error').show();
    //         $('#search_termInput').val("");
    //     }
    //     else{
    //         $('#showList').empty();
    //         $('#error').hide();
    //         var requestConfig = {
    //             url: '/movie/search',
    //             method: 'POST',
    //             data: {search_termInput:inputText}
    //         };
    //         $.ajax(requestConfig).then(function(responseMessage){
    //             var searchList = $(responseMessage);
    //             for (var i = 0; i < searchList.length; i++)
    //             {

    //                 var li2 = `<li><a href='/movie/${searchList[i]._id}'> ${searchList[i].name}</a></li>`;
    //                 $('#showList').append(li2);
    //             }
    //             $('#show').hide();
    //             $('#showList').show();
    //             $('#homeLink').hide();
    //         })
    //     }
    // })

  })(window.jQuery);