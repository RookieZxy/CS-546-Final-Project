// const {
//     update
// } = require("../../data/users/users");

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

    function checkInfo(account, firstName, lastName) {
        var Regx = /^[A-Za-z0-9]*$/;
        var account = account.trim();
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
        }

        return check;
    }

    function checkInfo2(account, firstName, lastName, password) {
        var Regx = /^[A-Za-z0-9]*$/;
        var password = password.trim();
        var account = account.trim();
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
            confirm(`${password} is not a string`)
            check = false;
        } else if (password.indexOf(" ") != -1) {
            confirm('password should not have spaces')
            check = false;
        } else if (password.length < 6) {
            confirm('password should not be empty spaces and should be at least 6 characters')
            check = false;
        } else if (password.length > 16) {
            confirm('The length of password should not be more than 16');
            check = false;
        }

        return check;
    }

    function checkPassword(password) {
        var password = password.trim();
        var check = true;
        if (typeof password !== 'string') {
            confirm(`${password} is not a string`)
            check = false;
        } else if (password.indexOf(" ") != -1) {
            confirm('password should not have spaces')
            check = false;
        } else if (password.length < 6) {
            confirm('password should not be empty spaces and should be at least 6 characters')
            check = false;
        } else if (password.length > 16) {
            confirm('The length of password should not be more than 16');
            check = false;
        }

        return check;
    }

    $('#userTable').empty();
    $.ajax({
        method: "POST",
        url: `/userManage/account`,
        data: {
            account: $("#account").val(),
        }
    }).then((data) => {
        var searchList = $(data);
        for (var i = 0; i < searchList.length; i++) {
            var t = `<tr id="tr${i}">
            <td><p class="fw-bold mb-1">${searchList[i].account}</p></td>
            <td><p class="fw-bold mb-1">${searchList[i].firstName}</p></td>
            <td><p class="fw-bold mb-1">${searchList[i].lastName}</p></td>
            <td><p class="fw-bold mb-1">${searchList[i].isAdmin}</p></td>
            <td>
                <input id="account${i}" value="${searchList[i].account}" hidden>
                <input id="firstName${i}" value="${searchList[i].firstName}" hidden>
                <input id="lastName${i}" value="${searchList[i].lastName}" hidden>
                <input id="isAdmin${i}" value="${searchList[i].isAdmin}" hidden>
                <button id="edit${i}" type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#updateForm">Edit</button>
                <button id="changePassword${i}" type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#passwordForm">Change password</button>
                <button id="remove${i}" type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#removeForm">Remove</button>
                <button id="changeAdmin${i}" type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#adminForm">SetAdmin</button>
            </td>
            </tr>`;

            $('#userTable').append(t);
        }

        const delBtns = $("#userTable button");
        for (let i = 0; i < delBtns.length / 4; i++) {
            // const delBtn = delBtns[i];
            $(delBtns[i * 4]).click(function () {
                $("#updateAccount").html($(`#account${i}`).val());
                $("#updateFirstName").val($(`#firstName${i}`).val());
                $("#updateLastName").val($(`#lastName${i}`).val());
                // $("updateForm").show();
            });
            $(delBtns[i * 4 + 1]).click(function () {
                $("#passwordAccount").text($(`#account${i}`).val());
            });
            $(delBtns[i * 4 + 2]).click(function () {
                //$("#removeAccount").val($(`#account${i}`).val());
                $("#removeAccount").text($(`#account${i}`).val());
            });
            $(delBtns[i * 4 + 3]).click(function () {
                var isAdmin = $(`#isAdmin${i}`).val()
                $("#adminAccount").text($(`#account${i}`).val());
                // $("#adminStatus").val(`${isAdmin}`)
                // $("#adminStatus").find(`option[text='${isAdmin}']`).attr("selected", true);
            });
        }
    }).fail((error) => {
        alert(error.responseJSON.error);
    });




    $('#userSearch').submit((event) => {
        event.preventDefault();
        var check = checkAccount($("#account").val());
        $('#userTable').empty();
        if (check) {
            $.ajax({
                method: "POST",
                url: `/userManage/account`,
                data: {
                    account: $("#account").val(),
                }
            }).then((data) => {
                var searchList = $(data);
                // console.log(searchList)
                var id = 1;
                // var tr = `<tr><th>accound</th><th>first name</th><th>last name</th></tr>`
                // $('#userList').append(tr);
                for (var i = 0; i < searchList.length; i++) {
                    var t = `<tr id="tr${id}">
                    <td><p id="account${id}" class="fw-bold mb-1">${searchList[i].account}</p></td>
                    <td><p id="firstName${id}" class="fw-bold mb-1">${searchList[i].firstName}</p></td>
                    <td><p id="lastName${id}" class="fw-bold mb-1">${searchList[i].lastName}</p></td>
                    <td><p id="isAdmin${id}" class="fw-bold mb-1">${searchList[i].isAdmin}</p></td>
                    <td>
                        <button id="edit${id}" type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#updateForm">Edit</button>
                        <button id="changePassword${id}" type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#passwordForm">Change password</button>
                        <button id="remove${id}" type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#removeForm">Remove</button>
                        <button id="changeAdmin${i}" type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#adminForm">SetAdmin</button>
                    </td>
                    </tr>`;

                    $('#userTable').append(t);
                }
                const delBtns = $("#userTable button");
                for (let i = 0; i < delBtns.length / 4; i++) {
                    // const delBtn = delBtns[i];
                    $(delBtns[i * 4]).click(function () {
                        $("#updateAccount").html($(`#account${i}`).val());
                        $("#updateFirstName").val($(`#firstName${i}`).val());
                        $("#updateLastName").val($(`#lastName${i}`).val());
                        // $("updateForm").show();
                    });
                    $(delBtns[i * 4 + 1]).click(function () {
                        $("#passwordAccount").text($(`#account${i}`).val());
                    });
                    $(delBtns[i * 4 + 2]).click(function () {
                        // $("#removeAccount").val($(`#account${i}`).val());
                        $("#removeAccount").text($(`#account${i}`).val());
                    });
                    $(delBtns[i * 4 + 3]).click(function () {
                        $("#adminAccount").text($(`#account${i}`).val());
                    });
                }
            }).fail((error) => {
                alert(error.responseJSON.error);
            });
        }

    });

    $('#updateForm').submit((event) => {
        event.preventDefault();
        var check = true;
        var check = checkInfo($("#updateAccount").html(), $("#updateFirstName").val(), $("#updateLastName").val());
        if (check) {
            $.ajax({
                method: "POST",
                url: `/userManage/update`,
                data: {
                    account: $("#updateAccount").html(),
                    firstName: $("#updateFirstName").val(),
                    lastName: $("#updateLastName").val(),
                }
            }).then((data) => {
                confirm("update successfully");
                window.location.replace("/userManage");
            }).fail((error) => {
                alert(error.responseJSON.error);
            });
        }
    });

    $('#addForm').submit((event) => {
        event.preventDefault();
        var check = true;
        var check = checkInfo2($("#addAccount").val(), $("#addFirstName").val(), $("#addLastName").val(), $("#addPassword").val());
        if ($("#addPassword").val() != $("#addConfirmPw").val())
            alert(`The two inputed password are not consistent`)
        if (check) {
            $.ajax({
                method: "POST",
                url: `/userManage/add`,
                data: {
                    account: $("#addAccount").val(),
                    password: $("#addPassword").val(),
                    firstName: $("#addFirstName").val(),
                    lastName: $("#addLastName").val(),
                }
            }).then((data) => {
                confirm("added successfully");
                window.location.replace("/userManage");
            }).fail((error) => {
                alert(error.responseJSON.error);
            });
        }
    });

    $('#removeForm').submit((event) => {
        event.preventDefault();
        var check = checkAccount($("#removeAccount").text())
        if (check) {
            $.ajax({
                method: "POST",
                url: `/userManage/remove`,
                data: {
                    account: $("#removeAccount").text(),
                }
            }).then((data) => {
                confirm("removed successfully");
                window.location.replace("/userManage");
            }).fail((error) => {
                alert(error.responseJSON.error);
            });
        }
    });

    $('#passwordForm').submit((event) => {
        event.preventDefault();
        var check = true;
        var check = checkPassword($("#newPassword").val());
        if ($("#newPassword").val() != $("#confirmPw").val())
            alert('Two inputed password are not consistent')
        else {
            if (check) {
                $.ajax({
                    method: "POST",
                    url: `/userManage/password`,
                    data: {
                        account: $("#passwordAccount").text(),
                        password: $("#newPassword").val(),
                    }
                }).then((data) => {
                    confirm("Password changed");
                    window.location.replace("/userManage");
                }).fail((error) => {
                    alert(error.responseJSON.error);
                });
            }
        }
    });

    $('#adminForm').submit((event) => {
        event.preventDefault();
        // console.log($("#adminStatus").val());
        // var isAdmin = $("#adminStatus").val()
        // if(isAdmin == 'True')
        //     isAdmin = true;
        // else if(isAdmin == 'False')
        //     isAdmin = false;
        $.ajax({
            method: "POST",
            url: `/userManage/admin`,
            data: {
                account: $("#adminAccount").text(),
                isAdmin: $("#adminStatus").val(),
            }
        }).then((data) => {
            confirm("Administrator changed");
            window.location.replace("/userManage");
        }).fail((error) => {
            alert(error.responseJSON.error);
        });
    });


})(jQuery);