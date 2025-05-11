document.addEventListener('DOMContentLoaded', () => {
    const ratingList = document.getElementById('ratingList');
    const ratingDetails = document.getElementById('ratingDetails');
    const noRating = document.getElementById('noRating');
    const approveRatingBtn = document.getElementById('approveRatingBtn');
    const deleteRatingBtn = document.getElementById('deleteRatingBtn');
    const ratingAuthor = document.getElementById('ratingAuthor');
    const ratingDate = document.getElementById('ratingDate');
    const ratingComment = document.getElementById('ratingComment');
    const ratingScore = document.getElementById('ratingScore');
    const filterButtons = document.querySelectorAll('.filter-button[data-status]');

    let currentRatingId = null;
    let allRatings = [];

    loadRatings('pending'); // Carrega avaliações pendentes inicialmente

    function loadRatings(status = '') {
        let query = firebase.firestore().collection('reviews'); // Usando 'reviews' como nome da collection

        if (status) {
            query = query.where('status', '==', status);
        }

        query.orderBy('data', 'desc')
            .get()
            .then(querySnapshot => {
                ratingList.innerHTML = '';
                allRatings = [];
                if (querySnapshot.empty) {
                    ratingList.innerHTML = '<li class="list-group-item">Nenhuma avaliação encontrada com este status.</li>';
                    hideRatingDetails();
                    return;
                }
                querySnapshot.forEach(doc => {
                    const ratingData = { id: doc.id, ...doc.data() };
                    console.log("Dados da avaliação:", ratingData); // Para depuração
                    allRatings.push(ratingData);
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'list-group-item-action');
                    listItem.addEventListener('click', () => showRatingDetails(ratingData));

                    const ratingInfo = document.createElement('div');
                    ratingInfo.classList.add('rating-info');
                    const author = document.createElement('div');
                    author.classList.add('rating-author');
                    author.textContent = ratingData.nome;
                    const comment = document.createElement('div');
                    comment.classList.add('rating-comment');
                    let shortComment = ratingData.mensagem;
                    if (shortComment && shortComment.length > 10) {
                        shortComment = shortComment.substring(0, 10) + '...';
                    }
                    comment.textContent = shortComment || '';

                    ratingInfo.appendChild(author);
                    ratingInfo.appendChild(comment);

                    const ratingDateElement = document.createElement('div');
                    ratingDateElement.classList.add('rating-date');
                    const date = new Date(ratingData.data.seconds * 1000);
                    ratingDateElement.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    listItem.appendChild(ratingInfo);
                    listItem.appendChild(ratingDateElement);

                    if (ratingData.status === 'pending') {
                        listItem.classList.add('pending');
                    } else if (ratingData.status === 'approved') {
                        listItem.classList.add('approved');
                    }

                    ratingList.appendChild(listItem);
                });
                if (currentRatingId) {
                    const selectedRating = allRatings.find(rating => rating.id === currentRatingId);
                    if (selectedRating) {
                        showRatingDetails(selectedRating);
                    } else {
                        hideRatingDetails();
                    }
                } else {
                    hideRatingDetails();
                }
            })
            .catch(error => {
                console.error("Erro ao buscar avaliações:", error);
                ratingList.innerHTML = '<li class="list-group-item">Erro ao carregar as avaliações.</li>';
                hideRatingDetails();
            });
    }

    function showRatingDetails(rating) {
        currentRatingId = rating.id;
        ratingAuthor.textContent = rating.nome;
        ratingDate.textContent = new Date(rating.data.seconds * 1000).toLocaleString();
        ratingComment.textContent = rating.mensagem;
        ratingScore.textContent = rating.nota;
        approveRatingBtn.dataset.ratingId = rating.id;
        deleteRatingBtn.dataset.ratingId = rating.id;

        if (rating.status === 'pending') {
            approveRatingBtn.classList.remove('d-none');
            deleteRatingBtn.classList.remove('d-none');
        } else if (rating.status === 'approved') {
            approveRatingBtn.classList.add('d-none');
            deleteRatingBtn.classList.remove('d-none');
        } else {
            // Caso haja outros status, você pode definir a visibilidade dos botões aqui
            approveRatingBtn.classList.add('d-none');
            deleteRatingBtn.classList.remove('d-none');
        }

        ratingDetails.classList.remove('d-none');
        noRating.classList.add('d-none');
    }

    function hideRatingDetails() {
        currentRatingId = null;
        ratingDetails.classList.add('d-none');
        noRating.classList.remove('d-none');
    }

    approveRatingBtn.addEventListener('click', () => {
        const ratingId = approveRatingBtn.dataset.ratingId;
        if (ratingId) {
            firebase.firestore().collection('reviews').doc(ratingId)
                .update({ status: 'approved' })
                .then(() => {
                    console.log(`Avaliação com ID ${ratingId} aprovada.`);
                    const activeFilterButton = document.querySelector('.filter-button.active');
                    const currentFilter = activeFilterButton ? activeFilterButton.dataset.status : 'pending';
                    loadRatings(currentFilter);
                    const updatedRating = allRatings.find(rating => rating.id === ratingId);
                    if (updatedRating) {
                        showRatingDetails(updatedRating);
                    } else {
                        hideRatingDetails();
                    }
                })
                .catch(error => {
                    console.error("Erro ao aprovar avaliação:", error);
                    alert("Erro ao aprovar avaliação.");
                });
        }
    });

    deleteRatingBtn.addEventListener('click', () => {
        const ratingId = deleteRatingBtn.dataset.ratingId;
        if (ratingId) {
            if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
                firebase.firestore().collection('reviews').doc(ratingId)
                    .delete()
                    .then(() => {
                        console.log(`Avaliação com ID ${ratingId} excluída.`);
                        const activeFilterButton = document.querySelector('.filter-button.active');
                        const currentFilter = activeFilterButton ? activeFilterButton.dataset.status : 'pending';
                        loadRatings(currentFilter);
                        hideRatingDetails();
                    })
                    .catch(error => {
                        console.error("Erro ao excluir avaliação:", error);
                        alert("Erro ao excluir avaliação.");
                    });
            }
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const status = this.dataset.status;
            loadRatings(status);
        });
    });

    // Adiciona o event listener para o botão de logout
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logout-button') {
            e.preventDefault();
            logout();
        }
        // Também verifica se o clique foi em um elemento dentro do botão
        if (e.target && e.target.parentElement && e.target.parentElement.id === 'logout-button') {
            e.preventDefault();
            logout();
        }
    });
});