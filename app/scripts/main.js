"use strict";

(function() {
    console.log("Loading chat...");

    const BOT = {class: "bot"};
    const HUMAN = {class: "human"};

    var sendBotMessage = function(message) {
        $('#conversation').append(buildChatPhrase(message, BOT));
    };

    var sendHumanMessage = function(message) {
        $('#conversation').append(buildChatPhrase(message, HUMAN));
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

    sendBotMessage("Hello I'm a bot");
    sendHumanMessage("Hello I'm a human");
})();

