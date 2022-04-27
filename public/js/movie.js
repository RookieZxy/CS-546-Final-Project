(function ($) {

    $('#searchForm').submit((event) => {
        event.preventDefault();
        $('#error').hide();
        $('#showList').empty();
        $('#showList').hide();
        var inputText = $('#search_termInput').val().trim();
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
  })(window.jQuery);