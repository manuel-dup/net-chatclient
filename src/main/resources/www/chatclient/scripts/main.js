"use strict";

(function() {
    var RUNNING = false;

    var nickname = localStorage.getItem("nickname");

    var now = function() {
        return new Date().toLocaleTimeString();
    };

    var setNickname = function(nickname) {
       $('#nickname').text(nickname);
    };

    var scrollConversationToBottom = function() {
        if (RUNNING) {
            var conversation = $('#conversation')[0];
            var height = conversation.scrollHeight;
            if (conversation.scrollTop < conversation.scrollTopMax) {
                $(conversation).stop().animate({scrollTop: height}, 500);
            }
        }
    };

    var buildChatPhrase = function(message) {
        var time = $('<div></div>').addClass("col message-time").text("[" + now() + "]");
        var nick = $('<div></div>').addClass("col message-nickname").text(nickname + ":");
        var msg = $('<div></div>').addClass("col message-content").text(message);

        return $('<div></div>').addClass("row")
                .append(time)
                .append(nick)
                .append(msg);
    };

    var addMessageToConversation = function(message) {
        if (typeof message !== 'undefined' && message.length > 0) {
            $('#conversation').append(buildChatPhrase(message));
            scrollConversationToBottom();
        }
    };

    var sendEnteredMessage = function() {
        addMessageToConversation($('#message').val());
        $('#message').val("");
    };

    var updateNickname = function() {
        var newNickname = $('#user-nickname').val();

        if (typeof newNickname !== 'undefined'
            && newNickname.length > 0 && newNickname.length <= 10)
        {
            $('#user-nickname').removeClass("invalid");
            localStorage.setItem("nickname", newNickname);

            nickname = localStorage.getItem("nickname");
            setNickname(nickname);

            $('#user-info').modal('close');
        } else {
            $('#user-nickname').addClass("invalid");
        }
    };

    $('#user-info-submit').click(updateNickname);
    $('.send-message').click(sendEnteredMessage);
    $('#message').keyup(function(event) {
        // when pressing "Enter"
        if (event.which === 13) {
            sendEnteredMessage();
        }
    });
    $('.modal').modal();

    if (nickname === null || nickname.length <= 0) {
        $('#user-info').modal('open');
    } else {
        setNickname(nickname);
    }

    RUNNING = true;
    scrollConversationToBottom();
})();

