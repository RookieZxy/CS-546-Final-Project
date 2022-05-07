(function ($){
    $('#type-sort-select').change(function(){
        //console.log("type ajax is working.")
        var sortBy = $('#type-sort-select').val();
        var type = $('#type-name').text();
        //console.log(sortBy, type);
        var requestConfig = {
            url : `/types/${type}`,
            method : 'POST',
            data :{
                sortBy : sortBy
            }
        };

        $.ajax(requestConfig).then(function(responseMessage){
            //console.log($('#type-movies').attr('value'));
            $('#type-movies').empty();
            
            $.each(responseMessage,function(){
                $('#type-movies').append(`
                <a href="/movie/${this._id}" id="type-single-movie">
                <div class="col">
                    <div class="card shadow-sm card-zoom">
                        <img class="bd-placeholder-img card-img-top" width="100%" height="600"
                             src="${this.poster}">
                        <div class="card-body">
                            <p class="card-text text-center fs-5 fw-bold">${this.name}</p>
                        </div>
                    </div>
                </div>
                </a>
                `);
            })
            
        })
    })


    $('#type-filter-rating li').click(function(event){
        event.preventDefault();
        var rating = $(this).attr('rating');
        $('.type-single-movie').each(function(index, element){
            if ($(element).attr('rating') >= rating){
                $(element).show();
            }
            else{
                $(element).hide();
            }
        })
    })

    $('#search-filter-rating li').click(function(event){
        event.preventDefault();
        var rating = $(this).attr('rating');
        $('.search-single-movie').each(function(index, element){
            if ($(element).attr('rating') >= rating){
                $(element).show();
            }
            else{
                $(element).hide();
            }
        })
    })

    $('#type-filter-runTime li').click(function(event){
        event.preventDefault();
        var choice = $(this).attr('runTime');
        if (choice == "0"){
            $('.type-single-movie').each(function(index, element){
                if ($(element).attr('runTime') >= 0){
                    $(element).show();
                }
                else{
                    $(element).hide();
                }
            })
        }else if (choice == "1"){
            $('.type-single-movie').each(function(index, element){
                if ($(element).attr('runTime') <= 90){
                    $(element).show();
                }
                else{
                    $(element).hide();
                }
            })
        }else{
            $('.type-single-movie').each(function(index, element){
                if ($(element).attr('runTime') >= 90){
                    $(element).show();
                }
                else{
                    $(element).hide();
                }
            })
        }
    })

    $('#search-filter-runTime li').click(function(event){
        event.preventDefault();
        var choice = $(this).attr('runTime');
        if (choice == "0"){
            $('.search-single-movie').each(function(index, element){
                if ($(element).attr('runTime') >= 0){
                    $(element).show();
                }
                else{
                    $(element).hide();
                }
            })
        }else if (choice == "1"){
            $('.search-single-movie').each(function(index, element){
                if ($(element).attr('runTime') <= 90){
                    $(element).show();
                }
                else{
                    $(element).hide();
                }
            })
        }else{
            $('.search-single-movie').each(function(index, element){
                if ($(element).attr('runTime') >= 90){
                    $(element).show();
                }
                else{
                    $(element).hide();
                }
            })
        }
    })

})(window.jQuery);