(function ($) {
    "use strict";

    function checkLogin(account, p) {
        var Regx = /^[A-Za-z0-9]*$/;
        var account = account.trim();
        var password = p.trim();
        var check = true;
        if (typeof account !== 'string'){
            confirm(`${account} is not a string`);
            check = false;
        }
        else if (account.length < 4){
            confirm('account should be at least 4 characters and not be empty spaces');
            check = false;
        }
        else if (account.length > 16){
            confirm('The length of account should not be more than 16');
            check = false;
        }
        else if (account.indexOf(" ") != -1){
            confirm('account should not have spaces');
            check = false;
        }
        else if (!Regx.test(account)){
            confirm('account should only be combained by alphanumeric characters');
            check = false;
        }
        else if (typeof password !== 'string') {
            confirm(`${password} is not a string`)
            check = false;
        } else if (password.indexOf(" ") != -1) {
            confirm('password should not have spaces')
            check = false;
        } else if (password.length < 6) {
            confirm('password should not be empty spaces and should be at least 6 characters')
            check = false;
        } else if (password.length > 16){
            confirm('The length of password should not be more than 16');
            check = false;
        }
        return check;
    }
    $('#signUpForm').submit((event) => {
        event.preventDefault();
        // console.log($("#account").val());
        var check = checkLogin($("#account").val(), $("#password").val());
        if(check){
            $.ajax({
                method: "POST",
                url: `/signup`,
                data: {
                    account: $("#account").val(),
                    password: $("#password").val(),
                    confirm: $("#confirm").val(),
                    firstname: $("#firstname").val(),
                    lastname: $("#lastname").val(),
                }
            }).then((data) => {
                window.location.replace('/login')
            }).fail((error) => {
                // console.log(error);
                // console.log(error.responseJSON.error);
                alert(error.responseJSON.error);
            });
        }
    });
})(jQuery);