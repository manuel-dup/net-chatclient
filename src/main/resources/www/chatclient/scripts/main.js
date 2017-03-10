"use strict";

(function() {
    var socket;
    var uuid;
    var nickname = localStorage.getItem("nickname");

    var dateTime = function(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    };

    // afficher le pseudo
    var setNickname = function(nickname) {
       $('#nickname').text(nickname);
       socket.send(JSON.stringify({type: 'nickname', nickname: nickname}));
    };

    // faire défiler la conversation jusqu'en bas
    var scrollConversationToBottom = function() {
        var conversation = $('#conversation')[0];
        var height = conversation.scrollHeight;
        if (conversation.scrollTop < height) {
            $(conversation).stop().animate({scrollTop: height}, 500);
        }
    };

    // construire la ligne contenant le message
    var buildChatPhrase = function(message) {
        var time = $('<div></div>').addClass("col message-time").text("[" + dateTime(message.timestamp) + "]");
        var nick = $('<div></div>').addClass("col message-nickname").text(message.from + ":");
        var msg = $('<div></div>').addClass("col message-content").text(message.text);

        var msgClass = "col " + (message.from === nickname ? "mymessages": "othersmessages");

        return $('<div></div>').addClass("row").append(
                    $('<div></div>').addClass(msgClass)
                        .append(time)
                        .append(nick)
                        .append(msg));
    };

    // envoyer un message vers le serveur
    var addMessageToConversation = function(message) {
        if (typeof message !== 'undefined' && message.length > 0) {
            socket.send(JSON.stringify({
                type: "message",
                text: message
            }));
        }
    };

    // envoyer le message écrit
    var sendEnteredMessage = function() {
        addMessageToConversation($('#message').val());
        $('#message').val("");
    };

    // modifier le pseudo
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

    // afficher le nombre de personnes connectées
    var setNbPersons = function(nbPersons) {
        $('#nb-personnes').text(nbPersons);
    };

    // quelqu'un a quitté le chat
    var someoneLeft = function(data) {
        console.log(data.nickname, "left the chat");
        Materialize.toast('<b>' + data.nickname + '</b>&nbsp;est parti', 4000);
        setNbPersons(data.nbPersons);
    };

    // quelqu'un a rejoint le chat
    var someoneJoined = function(data) {
        Materialize.toast('<b>' + data.nickname + '</b>&nbsp;a rejoint le chat', 4000);
        setNbPersons(data.nbPersons);
    };

    // afficher les messages précédents dans la conversation
    var initializeConversation = function(history) {
        var length = history.length;
        for (var i = 0 ; i < length ; i++) {
            $('#conversation').append(buildChatPhrase(history[i]));
        }
        scrollConversationToBottom();
    };

    // quand on clique sur le bouton pour enregistrer son pseudo
    $('#user-info-submit').click(updateNickname);

    $('#user-nickname').keyup(function(event) {
        // quand on appuye sur "Entrée" en écrivant son pseudo
        if (event.which === 13) {
            updateNickname();
        }
    });

    // quand on clique sur le bouton pour envoyer un message
    $('.send-message').click(sendEnteredMessage);
    $('#message').keyup(function(event) {
        // quand on appuye sur "Entrée" en tapant un message
        if (event.which === 13) {
            sendEnteredMessage();
        }
    });
    $('#user-info.modal').modal({dismissible: false});
    $('#reset-app').click(function() {
        localStorage.clear();
        document.location.reload();
    });

    // ------------- Communications avec le serveur -------------

    var wsUrl;
    if (location.hostname === 'herge3.eptica.com') {
        wsUrl = "ws://herge3.eptica.com:28079/"
    } else {
        wsUrl = "ws://" + location.hostname + ":8581/"
    }

    // connexion avec le serveur
    socket = new WebSocket(wsUrl);

    socket.onopen = function(open){
        console.log("Socket has been opened with", open.target.url);

        if (nickname === null || nickname.length <= 0) {
            $('#user-info').modal('open');
        } else {
            setNickname(nickname);
        }
    }

    var handleServerMessage =  function(msg){
        console.log("Received message: '" + msg.data + "'");
        var data = JSON.parse(msg.data);
        if (data.type === 'welcome') {
            uuid = data.uuid;
            setNbPersons(data.nbPersons);
            console.log("My UUID is " + uuid);

        } else if (data.type === 'newcomer') {
            someoneJoined(data);

        } else if (data.type === 'message') {
            $('#conversation').append(buildChatPhrase(data.message));
            scrollConversationToBottom();

        } else if (data.type === 'leaver') {
            someoneLeft(data);

        } else if (data.type === 'history') {
            initializeConversation(data.history);

        } else {
            console.log("Unknown message type", data.type);
        }
    };

    socket.onmessage = handleServerMessage;

    socket.onerror = function(error){
        Materialize.toast('Impossible de se connecter au serveur de chat', 4000);
        console.log("Error", error.eventPhase, error);
    }

    socket.onclose = function() {
        console.log("Server closed connection");
    }

    // ------------- FIN Communications avec le serveur -------------
})();

