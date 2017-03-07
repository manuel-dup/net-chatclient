"use strict";

(function() {
    var RUNNING = false;

    var socket;
    var uuid;
    var nickname = localStorage.getItem("nickname");

    var dateTime = function(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    };

    var setNickname = function(nickname) {
       $('#nickname').text(nickname);
       socket.send(JSON.stringify({type: 'nickname', nickname: nickname}));
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
        var time = $('<div></div>').addClass("col message-time").text("[" + dateTime(message.timestamp) + "]");
        var nick = $('<div></div>').addClass("col message-nickname").text(message.from + ":");
        var msg = $('<div></div>').addClass("col message-content").text(message.text);

        return $('<div></div>').addClass("row")
                .append(time)
                .append(nick)
                .append(msg);
    };

    var addMessageToConversation = function(message) {
        if (typeof message !== 'undefined' && message.length > 0) {
            socket.send(JSON.stringify({
                type: "message",
                text: message
            }));
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
            $('#user-nickname').val("");

            $('#user-info').modal('close');

        } else {
            $('#user-nickname').addClass("invalid");
        }
    };

    var setNbPersons = function(nbPersons) {
        $('#nb-personnes').text(nbPersons);
    };

    var someoneLeft = function(data) {
        console.log(data.nickname, "left the chat");
        Materialize.toast('<b>' + data.nickname + '</b>&nbsp;est parti', 4000);
        setNbPersons(data.nbPersons);
    };

    var someoneJoined = function(data) {
        Materialize.toast('<b>' + data.nickname + '</b>&nbsp;a rejoint le chat', 4000);
        setNbPersons(data.nbPersons);
    };

    $('#user-info-submit').click(updateNickname);
    $('.send-message').click(sendEnteredMessage);
    $('#message').keyup(function(event) {
        // when pressing "Enter"
        if (event.which === 13) {
            sendEnteredMessage();
        }
    });
    $('#user-info.modal').modal({dismissible: false});
    $('#reset-app').click(function() {
        localStorage.clear();
        document.location.reload();
    });

    // ------------- WebSocket stuff -------------

    socket = new WebSocket("ws://localhost:8581/");

    socket.onopen = function(open){
        console.log("Socket has been opened with", open.target.url);

        if (nickname === null || nickname.length <= 0) {
            $('#user-info').modal('open');
        } else {
            setNickname(nickname);
        }

        RUNNING = true;
        scrollConversationToBottom();
    }


    socket.onmessage = function(msg){
        console.log("Received message: '" + msg.data + "'");
        var data = JSON.parse(msg.data);
        if (data.type === 'welcome') {
            uuid = data.uuid;
            setNbPersons(data.nbPersons);
            console.log("My UUID is " + uuid);

        } else if (data.type === 'newcomer') {
            someoneJoined(data);


        } else if (data.type === 'message') {
            $('#conversation').append(buildChatPhrase(data));
            scrollConversationToBottom();

        } else if (data.type === 'leaver') {
            someoneLeft(data);

        } else {
            console.log("Unknown message type", data.type);
        }
    }

    socket.onerror = function(error){
        Materialize.toast('Impossible de se connecter au serveur de chat', 4000);
        console.log("Error", error.eventPhase, error);
    }

    socket.onclose = function(close) {
        console.log("Server closed connection");
    }

    // ------------- WebSocket stuff end -------------
})();

