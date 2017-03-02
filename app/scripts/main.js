"use strict";

(function() {
    console.log("Loading chat...");

    const BOT = {class: "bot"};
    const HUMAN = {class: "human"};
    var RUNNING = false;

    var scrollConversationToBottom = function() {
        if (RUNNING) {
            var conversation = $('#conversation')[0];
            var height = conversation.scrollHeight;
            if (conversation.scrollTop < conversation.scrollTopMax) {
                $(conversation).stop().animate({scrollTop: height}, 500);
            }
        }
    }

    var addMessageToConversation = function(message, role) {
        if (typeof message !== 'undefined' && message.length > 0) {
            $('#conversation').append(buildChatPhrase(message, role));
            scrollConversationToBottom();
        }
    }

    var sendBotMessage = function(message) {
        addMessageToConversation(message, BOT);
    };

    var sendHumanMessage = function(message) {
        addMessageToConversation(message, HUMAN);
    };

    var buildChatPhrase = function(message, role) {
        var time = $('<div></div>').addClass("col message-time").text("[" + now() + "]");
        var avatar = $('<div></div>').addClass("col avatar").addClass(role.class);
        var msg = $('<div></div>').addClass("col message-content").text(message);

        return $('<div></div>').addClass("row")
                .append(time)
                .append(avatar)
                .append(msg);
    }

    var now = function() {
        return new Date().toLocaleTimeString();
    };

    var sendEnteredMessage = function() {
        sendHumanMessage($('#message').val());
        $('#message').val("");
    }

    $('#send-message').click(sendEnteredMessage);
    $('#message').keyup(function(event) {
        // when pressing "Enter"
        if (event.which === 13) {
            sendEnteredMessage();
        }
    });

    sendBotMessage("Hello I'm a bot");
    sendHumanMessage("Hello I'm a human");
    RUNNING = true;
    scrollConversationToBottom();
})();

