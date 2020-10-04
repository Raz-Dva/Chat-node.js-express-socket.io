$(document).ready(function () {
    const messages = document.getElementById("messages");
    const socket = io();
    var userInfo = new Object(),
        hint = $(".hint"),
        arrUsers;
    // ------ scroll chat to bottom ------
    function scrollBottom() {
        var scrollHeight = Math.max(
            messages.scrollHeight,
            messages.offsetHeight,
            messages.clientHeight
        );
        if (scrollHeight > messages.clientHeight) {
            messages.scrollTop = scrollHeight - messages.clientHeight;
        }
    }
    // -------- get users -------
    function getUsers(allUsers) {
        $("#num_par").text(allUsers.length);
        $("#aside_users").empty();
        allUsers.forEach(function (item, i, arr) {
            $("#aside_users").append($("<li></li>").text(item.name));
        });
    }
    // ------ validation user name -----------
    function TestLogin1(login) {
        if (/^[a-zA-Z1-9]+$/.test(login) === false) {
            hint.text("Login must contain only Latin letters");
            return false;
        }
        if (login.length < 4 || login.length > 20) {
            hint.text("Login must be from 4 to 20 characters");
            return false;
        }
        if (parseInt(login.substr(0, 1))) {
            hint.text("Login must start with a letter");
            return false;
        }
        return true;
    }
    scrollBottom();
    // ------ submit msg  -----------
    $("form").submit(function () {
        var msgText = $("#input_message").val();
        socket.emit("chat message", {
            msgText: msgText,
            id: userInfo.id,
            name: userInfo.name,
        });
        $("#input_message").val("");
        return false;
    });
    // ------ get msg  -----------
    socket.on("chat message", function (msgData) {
        if (msgData.id == userInfo.id) {
            $("#messages").append(
                $(
                    '<li  class="author"><p class="message_user-text">' +
                    msgData.msgText +
                    '</p> <p class="message_user-name"><img class="message_user-img" src="/img/user.svg" alt=""><strong>' +
                    msgData.name +
                    "</strong></p></li>"
                )
            );
        } else {
            $("#messages").append(
                $(
                    '<li> <p class="message_user-name"><img class="message_user-img" src="/img/user.svg" alt=""><strong>' +
                    msgData.name +
                    '</strong></p><p class="message_user-text">' +
                    msgData.msgText +
                    "</p></li>"
                )
            );
        }
        scrollBottom();
    });
    // -------- load users ----
    socket.on("load users", function (users) {
        arrUsers = users;
        getUsers(users);
    });
    // --------success authorization  ----
    socket.on("succes authorization", function (user) {
        userInfo = user;
        $("#user-name").text(userInfo.name);
        $(".background_wrap").hide();
    });
    // -------- failed authorization ----
    socket.on("failed authorization", function () {
        $("#authorize-input").addClass("invalid");
        hint.text("Already exist");
    });
    // --------- autorization ----------
    $("#authorize-btn").click(function () {
        // console.log(this)
        var valAuthorize = $("#authorize-input").val();
        if (TestLogin1(valAuthorize)) {
            $("#authorize-input").removeClass("invalid");
            // console.log('valid')
            socket.emit("authorize", valAuthorize);
        } else {
            $("#authorize-input").addClass("invalid");
        }
    });
});