(function ($) {
    "use strict";

    function checkPassword(previous, confirm, p) {
        var confirm = confirm.trim();
        var previous = previous.trim();
        var password = p.trim();
        var check = true;
        if (typeof password !== 'string') {
            alert(`${password} is not a string`)
            check = false;
        } else if (password.indexOf(" ") != -1) {
            alert('new password should not have spaces')
            check = false;
        } else if (password.length < 6) {
            alert('new password should not be empty spaces and should be at least 6 characters')
            check = false;
        } else if (password.length > 16) {
            alert('The length of new password should not be more than 16');
            check = false;
        } else if (typeof previous !== 'string') {
            alert(`${previous} is not a string`)
            check = false;
        } else if (previous.indexOf(" ") != -1) {
            alert('previous password should not have spaces')
            check = false;
        } else if (previous.length < 6) {
            alert('previous password should not be empty spaces and should be at least 6 characters')
            check = false;
        } else if (previous.length > 16) {
            alert('The length of previous password should not be more than 16');
            check = false;
        } else if (confirm != password) {
            alert('inputed two new password are not consistent');
            check = false;
        }

        return check;
    }

    function checkName( firstName, lastName) {
        var firstName = firstName.trim();
        var lastName = lastName.trim();
        var check = true;
        if (typeof firstName !== 'string' || typeof lastName !== 'string') {
            alert(`firstName and lastName should be string`);
            check = false;
        } else if (firstName.length == 0 || lastName.length == 0) {
            alert(`firstName and lastName should not be empty spaces`);
            check = false;
        } 
        return check;
    }
    $('#changeInfo').hide();
    $('#pre').hide();
    $('#new').hide();
    $('#confirm2').hide();
    $('#p').hide();
    // $('#confirm').hide();
    $('#changePassword').click(function () {
        // alert('sdf');
        $('#changeInfo').show();
        $('#changePassword').hide();
        $('#first').hide();
        $('#last').hide();
        $('#pre').show();
        $('#new').show();
        $('#confirm2').show();
    });

    $('#changeInfo').click(function () {
        $('#changePassword').show();
        $('#first').show();
        $('#last').show();
        $('#pre').hide();
        $('#new').hide();
        $('#changeInfo').hide();
        $('#confirm2').hide();
    });

    $('#updateInfo').submit((event) => {
        event.preventDefault();
        if ($('#prePassword').val().length == 0 && $('#newPassword').val().length == 0) {
            // console.log($("#password").val(), $("#firstName").val(), $("#lastName").val())
            var check = checkName($("#firstName").val(), $("#lastName").val());
            if (check) {
                $.ajax({
                    method: "POST",
                    url: `/users`,
                    data: {
                        // password: $("#password").val(),
                        firstName: $("#firstName").val(),
                        lastName: $("#lastName").val(),
                    }
                }).then((data) => {
                    window.location.replace('/users');
                    confirm("Updated information successfully");
                }).fail((error) => {
                    alert(error.responseJSON.error);
                });
            }
        } else {
            var check = checkPassword($("#prePassword").val(), $("#confirmPw").val(), $("#newPassword").val());
            // console.log($("#prePassword").val(), $("#confirmPw").val(), $("#newPassword").val())
            if (check) {
                $.ajax({
                    method: "POST",
                    url: `/users/password`,
                    data: {
                        prepassword: $("#prePassword").val(),
                        password: $("#newPassword").val(),
                        confirmPw: $("#confirmPw").val(),
                    }
                }).then((data) => {
                    window.location.replace('/users');
                    confirm("Updated password successfully");
                }).fail((error) => {
                    alert(error.responseJSON.error);
                });
            }
        }

    });
})(jQuery);