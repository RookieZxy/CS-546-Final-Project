(function ($) {
    "use strict";

    function checkAccount(account) {
        var Regx = /^[A-Za-z0-9]*$/;
        var account = account.trim();
        var check = true;
        if (typeof account !== 'string') {
            alert(`${account} is not a string`);
            check = false;
        } else if (account.length > 16) {
            alert('The length of account should not be more than 16');
            check = false;
        } else if (!Regx.test(account)) {
            alert('account should only be combained by alphanumeric characters');
            check = false;
        }
        return check;
    }

    function checkInfo(account, p, firstName, lastName, confirm) {
        var Regx = /^[A-Za-z0-9]*$/;
        var account = account.trim();
        var confirm = confirm.trim();
        var password = p.trim();
        var firstName = firstName.trim();
        var lastName = lastName.trim();
        var check = true;
        if (typeof account !== 'string') {
            alert(`${account} is not a string`);
            check = false;
        } else if (account.length < 4) {
            alert('account should be at least 4 characters and not be empty spaces');
            check = false;
        } else if (account.length > 16) {
            alert('The length of account should not be more than 16');
            check = false;
        } else if (account.indexOf(" ") != -1) {
            alert('account should not have spaces');
            check = false;
        } else if (!Regx.test(account)) {
            alert('account should only be combained by alphanumeric characters');
            check = false;
        } else if (typeof firstName !== 'string' || typeof lastName !== 'string') {
            alert(`firstName and lastName should be string`);
            check = false;
        } else if (firstName.length == 0 || lastName.length == 0) {
            alert(`firstName and lastName should not be empty spaces`);
            check = false;
        } else if (typeof password !== 'string') {
            alert(`${password} is not a string`)
            check = false;
        } else if (password.indexOf(" ") != -1) {
            alert('password should not have spaces')
            check = false;
        } else if (password.length < 6) {
            alert('password should not be empty spaces and should be at least 6 characters')
            check = false;
        } else if (password.length > 16) {
            alert('The length of password should not be more than 16');
            check = false;
        } else if (confirm != password) {
            alert('inputed two new password are not consistent');
            check = false;
        }

        return check;
    }

    $('#userSearch').submit((event) => {
        event.preventDefault();
        // console.log($("#account").val());
        var check = checkAccount($("#account").val());
        $('#userList').empty();
        if (check) {
            $.ajax({
                method: "POST",
                url: `http://localhost:3000/userManage/account`,
                data: {
                    account: $("#account").val(),
                }
            }).then((data) => {
                var searchList = $(data);
                console.log(searchList)
                // var li1 = `<li style = "list-style: none"> account  firstName  lastName</li>`
                var tr = `<tr><th>accound</th><th>first name</th><th>last name</th></tr>`
                $('#userList').append(tr);
                for (var i = 0; i < searchList.length; i++) {
                    // var li1 = `<li> ${searchList[i].account}</li>`
                    // var li2 = `<li> ${searchList[i].firstName}</li>`
                    // var li3 = `<li> ${searchList[i].lastName}</li>`
                    var tr1 = `<tr><td> ${searchList[i].account}</td><td> ${searchList[i].firstName}</td><td> ${searchList[i].lastName}</td><td><button id="updateUser">update</button></td></tr>`

                    // $('#userList').append(li1);
                    // $('#userList').append(li2);
                    // $('#userList').append(li3);
                    $('#userList').append(tr1);
                }
                // window.location.replace('/users');
                // confirm("Updated information successfully");
            }).fail((error) => {
                alert(error.responseJSON.error);
            });
        }
    });

    $('#updateForm').submit((event) => {
        event.preventDefault();
        // console.log($("#account").val());
        var check = checkInfo($("#account2").val(), $("#password2").val(),$("#firstName2").val(),$("#lastName2").val(),$("#confirm2").val());
        if (check) {
            $.ajax({
                method: "POST",
                url: `http://localhost:3000/userManage/update`,
                data: {
                    account: $("#account2").val(),
                    password: $("#password2").val(),
                    confirm: $("#confirm2").val(),
                    firstName: $("#lastName2").val(),
                    lastName: $("#lastName2").val(),
                }
            }).then((data) => {
                confirm("add successfully");
            }).fail((error) => {
                alert(error.responseJSON.error);
            });
        }
    });

    $('#removeForm').submit((event) => {
        event.preventDefault();
        // console.log($("#account").val());
        var check = checkInfo($("#account2").val(), $("#password2").val(),$("#firstName2").val(),$("#lastName2").val(),$("#confirm2").val());
        if (check) {
            $.ajax({
                method: "POST",
                url: `http://localhost:3000/userManage/update`,
                data: {
                    account: $("#account2").val(),
                    password: $("#password2").val(),
                    confirm: $("#confirm2").val(),
                    firstName: $("#lastName2").val(),
                    lastName: $("#lastName2").val(),
                }
            }).then((data) => {
                confirm("add successfully");
            }).fail((error) => {
                alert(error.responseJSON.error);
            });
        }
    });



})(jQuery);