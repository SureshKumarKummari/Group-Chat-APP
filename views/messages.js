 function addSentMessage(message) {
        let d = document.getElementById('msg-page');

        // Create the necessary DOM elements
        let outgoingChatsDiv = document.createElement('div');
        outgoingChatsDiv.classList.add('outgoing-chats');

        let outgoingChatsImgDiv = document.createElement('div');
        outgoingChatsImgDiv.classList.add('outgoing-chats-img');

        let img = document.createElement('img');
        img.setAttribute('src', './user.jpg');

        let outgoingMsgDiv = document.createElement('div');
        outgoingMsgDiv.classList.add('outgoing-msg');

        let outgoingMsgInboxDiv = document.createElement('div');
        outgoingMsgInboxDiv.classList.add('outgoing-chats-msg');

        let p = document.createElement('p');
        p.classList.add('multi-msg');
        p.textContent = message;

        let span = document.createElement('span');
        span.classList.add('time');
        span.textContent = '18:30 PM | July 24';

        // Append the elements to the appropriate parent elements
        outgoingMsgInboxDiv.appendChild(p);
        outgoingMsgInboxDiv.appendChild(span);

        outgoingMsgDiv.appendChild(outgoingMsgInboxDiv);

        outgoingChatsImgDiv.appendChild(img);

        outgoingChatsDiv.appendChild(outgoingChatsImgDiv);
        outgoingChatsDiv.appendChild(outgoingMsgDiv);

        // Append the whole structure to the target element
        d.appendChild(outgoingChatsDiv);


    }


     function addreceivedMessage(message) {

        let d = document.getElementById('msg-page');

        // Create the necessary DOM elements
        let receivedChatsDiv = document.createElement('div');
        receivedChatsDiv.classList.add('received-chats');

        let receivedChatsImgDiv = document.createElement('div');
        receivedChatsImgDiv.classList.add('received-chats-img');

        let img = document.createElement('img');
        img.setAttribute('src', './user.jpg');

        let receivedMsgDiv = document.createElement('div');
        receivedMsgDiv.classList.add('received-msg');

        let receivedMsgInboxDiv = document.createElement('div');
        receivedMsgInboxDiv.classList.add('received-msg-inbox');

        let p = document.createElement('p');
        p.classList.add('single-msg');
        p.textContent = message;

        let span = document.createElement('span');
        span.classList.add('time');
        span.textContent = '18:31 PM | July 24';

        // Append the elements to the appropriate parent elements
        receivedMsgInboxDiv.appendChild(p);
        receivedMsgInboxDiv.appendChild(span);

        receivedMsgDiv.appendChild(receivedMsgInboxDiv);

        receivedChatsImgDiv.appendChild(img);

        receivedChatsDiv.appendChild(receivedChatsImgDiv);
        receivedChatsDiv.appendChild(receivedMsgDiv);

        // Append the whole structure to the target element
        d.appendChild(receivedChatsDiv);

    }