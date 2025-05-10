document.addEventListener('DOMContentLoaded', () => {
    const messageList = document.getElementById('messageList');
    const messageContent = document.getElementById('messageContent');
    const noMessage = document.getElementById('noMessage');
    const markAsReadBtn = document.getElementById('markAsReadBtn');
    const deleteMessageBtn = document.getElementById('deleteMessageBtn');
    const msgName = document.getElementById('msgName');
    const msgEmail = document.getElementById('msgEmail');
    const msgDate = document.getElementById('msgDate');
    const msgText = document.getElementById('msgText');
    const filterButtons = document.querySelectorAll('.filter-button[data-status]');

    let currentMessageId = null;
    let allMessages = [];

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            loadMessages('pending');
        } else {
            window.location.href = "/pages/auth/login.html";
        }
    });

    function loadMessages(status = '') {
        let query = firebase.firestore().collection('messages');

        if (status) {
            query = query.where('status', '==', status);
        }

        query.orderBy('data', 'desc')
            .get()
            .then(querySnapshot => {
                messageList.innerHTML = '';
                allMessages = [];
                if (querySnapshot.empty) {
                    messageList.innerHTML = '<li class="list-group-item">Nenhuma mensagem encontrada com este status.</li>';
                    hideMessageDetails();
                    return;
                }
                querySnapshot.forEach(doc => {
                    const messageData = { id: doc.id, ...doc.data() };
                    allMessages.push(messageData);
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'list-group-item-action');
                    listItem.addEventListener('click', () => showMessageDetails(messageData));

                    const messageInfo = document.createElement('div');
                    messageInfo.classList.add('message-info');
                    const sender = document.createElement('div');
                    sender.classList.add('message-sender');
                    sender.textContent = messageData.nome;
                    const subject = document.createElement('div');
                    subject.classList.add('message-subject');
                    let shortMessage = messageData.mensagem;
                    if (shortMessage.length > 20) {
                        shortMessage = shortMessage.substring(0, 20) + '...';
                    }
                    subject.textContent = shortMessage;

                    messageInfo.appendChild(sender);
                    messageInfo.appendChild(subject);

                    const messageDate = document.createElement('div');
                    messageDate.classList.add('message-date');
                    const date = new Date(messageData.data.seconds * 1000);
                    messageDate.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    listItem.appendChild(messageInfo);
                    listItem.appendChild(messageDate);

                    if (messageData.status === 'pending') {
                        listItem.classList.add('unread');
                    }

                    messageList.appendChild(listItem);
                });
                if (currentMessageId) {
                    const selectedMessage = allMessages.find(msg => msg.id === currentMessageId);
                    if (selectedMessage) {
                        showMessageDetails(selectedMessage);
                    } else {
                        hideMessageDetails();
                    }
                } else {
                    hideMessageDetails();
                }
            })
            .catch(error => {
                console.error("Erro ao buscar mensagens:", error);
                messageList.innerHTML = '<li class="list-group-item">Erro ao carregar as mensagens.</li>';
                hideMessageDetails();
            });
    }

    function showMessageDetails(message) {
        currentMessageId = message.id;
        msgName.textContent = message.nome;
        msgEmail.textContent = message.email;
        msgDate.textContent = new Date(message.data.seconds * 1000).toLocaleString();
        msgText.textContent = message.mensagem;
        markAsReadBtn.dataset.messageId = message.id;
        deleteMessageBtn.dataset.messageId = message.id;

        if (message.status === 'read') {
            markAsReadBtn.classList.add('d-none');
            deleteMessageBtn.classList.remove('d-none');
        } else {
            markAsReadBtn.classList.remove('d-none');
            deleteMessageBtn.classList.add('d-none');
        }

        messageContent.classList.remove('d-none');
        noMessage.classList.add('d-none');
    }

    function hideMessageDetails() {
        currentMessageId = null;
        messageContent.classList.add('d-none');
        noMessage.classList.remove('d-none');
    }

    markAsReadBtn.addEventListener('click', () => {
        const messageId = markAsReadBtn.dataset.messageId;
        if (messageId) {
            firebase.firestore().collection('messages').doc(messageId)
                .update({ status: 'read' })
                .then(() => {
                    console.log(`Mensagem com ID ${messageId} marcada como lida.`);
                    const activeFilterButton = document.querySelector('.filter-button.active');
                    const currentFilter = activeFilterButton ? activeFilterButton.dataset.status : 'pending';
                    loadMessages(currentFilter);
                    const updatedMessage = allMessages.find(msg => msg.id === messageId);
                    if (updatedMessage) {
                        showMessageDetails(updatedMessage);
                    } else {
                        hideMessageDetails();
                    }
                })
                .catch(error => {
                    console.error("Erro ao marcar mensagem como lida:", error);
                    alert("Erro ao marcar mensagem como lida.");
                });
        }
    });

    deleteMessageBtn.addEventListener('click', () => {
        const messageId = deleteMessageBtn.dataset.messageId;
        if (messageId) {
            if (confirm("Tem certeza que deseja excluir esta mensagem?")) {
                firebase.firestore().collection('messages').doc(messageId)
                    .delete()
                    .then(() => {
                        console.log(`Mensagem com ID ${messageId} excluída.`);
                        const activeFilterButton = document.querySelector('.filter-button.active');
                        const currentFilter = activeFilterButton ? activeFilterButton.dataset.status : 'pending';
                        loadMessages(currentFilter);
                        hideMessageDetails();
                    })
                    .catch(error => {
                        console.error("Erro ao excluir mensagem:", error);
                        alert("Erro ao excluir mensagem.");
                    });
            }
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const status = this.dataset.status;
            loadMessages(status);
        });
    });
});