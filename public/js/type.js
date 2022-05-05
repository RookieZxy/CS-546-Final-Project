(function ($){
    $('#type-sort-select').change(function(){
        //console.log("type ajax is working.")
        var sortBy = $('#type-sort-select').val();
        var type = $('#type-name').text();
        console.log(sortBy, type);
        var requestConfig = {
            url : `/types/${type}`,
            method : 'POST',
            data :{
                sortBy : sortBy
            }
        };

        $.ajax(requestConfig).then(function(responseMessage){
            console.log(responseMessage);
            $('#type-movies').empty();
            
            $.each(responseMessage,function(){
                $('#type-movies').append(`
                <a href="/movie/${this._id}" id="${this.name}">
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


})(window.jQuery);