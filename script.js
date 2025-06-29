document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const replyPreview = document.getElementById('replyPreview');
    const cancelReply = document.getElementById('cancelReply');
    const replyingTo = document.getElementById('replyingTo');
    const replyContent = document.getElementById('replyContent');
    
    let currentUser = {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    };
    
    let otherUser = {
        id: 2,
        name: 'Michael Smith',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    };
    
    let replyToMessage = null;
    
    const initialMessages = [
        {
            id: 1,
            sender: otherUser,
            content: 'Hey Sarah, how are you doing?',
            timestamp: new Date(Date.now() - 3600000),
            isCurrentUser: false
        },
        {
            id: 2,
            sender: currentUser,
            content: "I'm good, thanks! How about you?",
            timestamp: new Date(Date.now() - 1800000),
            isCurrentUser: true
        },
        {
            id: 3,
            sender: otherUser,
            content: "I'm doing well. Just wanted to check about the project deadline.",
            timestamp: new Date(Date.now() - 900000),
            isCurrentUser: false
        }
    ];
    
    initialMessages.forEach(message => {
        renderMessage(message);
    });
    
    function sendMessage() {
        const content = messageInput.value.trim();
        if (content === '') return;
        
        const newMessage = {
            id: Date.now(),
            sender: currentUser,
            content: content,
            timestamp: new Date(),
            isCurrentUser: true,
            replyTo: replyToMessage
        };
        
        renderMessage(newMessage);
        messageInput.value = '';
        
        if (replyToMessage) {
            setTimeout(() => {
                const replyMessage = {
                    id: Date.now() + 1,
                    sender: otherUser,
                    content: getRandomResponse(),
                    timestamp: new Date(),
                    isCurrentUser: false,
                    replyTo: newMessage
                };
                renderMessage(replyMessage);
                scrollToBottom();
            }, 1000);
        }
        
        if (replyToMessage) {
            cancelReplyHandler();
        }
        
        scrollToBottom();
    }
    
    function renderMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `flex mb-4 ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`;
        
        let replyIndicator = '';
        if (message.replyTo) {
            replyIndicator = `
                <div class="bg-gray-100 rounded-lg p-2 mb-1 border-l-4 border-indigo-400">
                    <p class="text-xs text-gray-500 font-medium">Replying to ${message.replyTo.sender.name}</p>
                    <p class="text-sm text-gray-600 truncate">${message.replyTo.content}</p>
                </div>
            `;
        }
        
        messageElement.innerHTML = `
            <div class="flex max-w-xs lg:max-w-md ${message.isCurrentUser ? 'flex-row-reverse' : ''}">
                <img src="${message.sender.avatar}" alt="${message.sender.name}" class="w-8 h-8 rounded-full mt-1 ${message.isCurrentUser ? 'ml-3' : 'mr-3'}">
                <div>
                    <div class="${message.isCurrentUser ? 'bg-indigo-600 text-white' : 'bg-white'} rounded-lg p-3 shadow">
                        ${replyIndicator}
                        <p>${message.content}</p>
                    </div>
                    <div class="flex items-center ${message.isCurrentUser ? 'justify-end' : 'justify-start'} mt-1 space-x-2">
                        <span class="text-xs text-gray-500">${formatTime(message.timestamp)}</span>
                        ${message.isCurrentUser ? '<i class="fas fa-check-double text-xs text-gray-400"></i>' : ''}
                    </div>
                </div>
            </div>
        `;
        
        if (!message.isCurrentUser) {
            const messageBubble = messageElement.querySelector('.bg-white, .bg-indigo-600');
            messageBubble.classList.add('cursor-pointer', 'hover:opacity-90');
            messageBubble.addEventListener('click', () => {
                replyToMessage = message;
                showReplyPreview(message);
            });
        }
        
        messagesContainer.appendChild(messageElement);
    }
    
    function showReplyPreview(message) {
        replyPreview.classList.remove('hidden');
        replyingTo.textContent = message.sender.name;
        replyContent.textContent = message.content;
        messageInput.focus();
    }
    
    function cancelReplyHandler() {
        replyPreview.classList.add('hidden');
        replyToMessage = null;
    }
    
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function getRandomResponse() {
        const responses = [
            "Sounds good!",
            "I'll get back to you on that.",
            "Thanks for letting me know.",
            "Can we discuss this later?",
            "I appreciate your message!",
            "Let me think about it.",
            "That's interesting.",
            "I agree with you.",
            "We should meet to discuss this further."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    cancelReply.addEventListener('click', cancelReplyHandler);
    
    scrollToBottom();
});