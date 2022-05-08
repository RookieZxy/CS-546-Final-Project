(function ($){
    $('#type-sort-select').change(function(){
        var sortBy = $('#type-sort-select').val();
        var type = $('#type-name').text();
        var requestConfig = {
            url : `/types/${type}`,
            method : 'POST',
            data :{
                sortBy : sortBy
            }
        };

        $.ajax(requestConfig).then(function(responseMessage){
            $('#type-movies').empty();
            $.each(responseMessage,function(){
                $('#type-movies').append(`
                <a href="/movie/${this._id}" id="type-single-movie">
                <div class="col">
                    <div class="card shadow-sm card-zoom">
                        <img class="bd-placeholder-img card-img-top" width="100%" height="600"
                             src="${this.poster}" alt="${this.name}">
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

    // $(document).on('change', 'input[type=radio][name=ratingOptions]', function (){
    //     var rating = $(this).val();
    //     $('.type-single-movie').each(function(index, element){
    //         if ($(element).children('.type-single-movie-rating').text() >= rating){
    //             $(element).show();
    //         }
    //         else{
    //             $(element).hide();
    //         }
    //     })
    // })

    // $(document).on('change', 'input[type=radio][name=search-ratingOptions]', function (){
    //     var rating = $(this).val();
    //     $('.search-single-movie').each(function(index, element){
    //         if ($(element).children('.search-single-movie-rating').text() >= rating){
    //             $(element).show();
    //         }
    //         else{
    //             $(element).hide();
    //         }
    //     })
    // })

    // $(document).on('change', 'input[type=radio][name=runTimeOptions]', function (){
    //     var choice = $(this).val();
    //     if (choice == "0"){
    //         $('.type-single-movie').each(function(index, element){
    //             if ($(element).children('.type-single-movie-runTime').text() >= 0){
    //                 $(element).show();
    //             }
    //             else{
    //                 $(element).hide();
    //             }
    //         })
    //     }else if (choice == "1"){
    //         $('.type-single-movie').each(function(index, element){
    //             if ($(element).children('.type-single-movie-runTime').text() <= 90){
    //                 $(element).show();
    //             }
    //             else{
    //                 $(element).hide();
    //             }
    //         })
    //     }else{
    //         $('.type-single-movie').each(function(index, element){
    //             if ($(element).children('.type-single-movie-runTime').text() >= 90){
    //                 $(element).show();
    //             }
    //             else{
    //                 $(element).hide();
    //             }
    //         })
    //     }
    // })

    // $(document).on('change', 'input[type=radio][name=search-runTimeOptions]', function (){
    //     var choice = $(this).val();
    //     if (choice == "0"){
    //         $('.search-single-movie').each(function(index, element){
    //             if ($(element).children('.search-single-movie-runTime').text() >= 0){
    //                 $(element).show();
    //             }
    //             else{
    //                 $(element).hide();
    //             }
    //         })
    //     }else if (choice == "1"){
    //         $('.search-single-movie').each(function(index, element){
    //             if ($(element).children('.search-single-movie-runTime').text() <= 90){
    //                 $(element).show();
    //             }
    //             else{
    //                 $(element).hide();
    //             }
    //         })
    //     }else{
    //         $('.search-single-movie').each(function(index, element){
    //             if ($(element).children('.search-single-movie-runTime').text() >= 90){
    //                 $(element).show();
    //             }
    //             else{
    //                 $(element).hide();
    //             }
    //         })
    //     }
    // })


    $(document).on('change', 'input[type=radio]', function (){
        var rating = parseFloat($('input[name=ratingOptions]:checked').val());
        var runtime = parseInt($('input[name=runTimeOptions]:checked').val());
        var amount = 0;
        //console.log(rating, runtime);
        $('.single-movie').each(function(index, element){
            var tempRating = $(element).children('.single-movie-rating').text();
            var tempRunTime = $(element).children('.single-movie-runTime').text();
            //console.log(tempRating, tempRunTime );
            if (tempRating >= rating && tempRunTime <= runtime){
                amount++;
                $(element).show();
            }
            else{
                $(element).hide();
            }
        })
        //console.log(amount);
    })

})(window.jQuery);