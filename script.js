const elementList = [
    { id: 1, symbol: 'H', name: 'Hidrógeno', color: '#e74c3c' },
    { id: 2, symbol: 'O', name: 'Oxígeno', color: '#3498db' },
    { id: 3, symbol: 'C', name: 'Carbono', color: '#2ecc71' },
    { id: 4, symbol: 'N', name: 'Nitrógeno', color: '#f1c40f' },
    { id: 5, symbol: 'Au', name: 'Oro', color: '#9b59b6' },
    { id: 6, symbol: 'Fe', name: 'Hierro', color: '#e67e22' },
    { id: 7, symbol: 'Na', name: 'Sodio', color: '#1abc9c' },
    { id: 8, symbol: 'He', name: 'Helio', color: '#ff6b81' }
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0; // Contador de parejas encontradas

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const createBoard = () => {
    const board = document.getElementById('board');
    board.innerHTML = '';

    const cardsData = [];

    elementList.forEach(item => {
        cardsData.push({
            id: item.id,
            text: item.symbol,
            type: 'Símbolo',
            color: item.color
        });

        cardsData.push({
            id: item.id,
            text: item.name,
            type: 'Nombre',
            color: item.color
        });
    });

    shuffle(cardsData);

    cardsData.forEach(data => {
        const card = document.createElement('div');

        card.classList.add('card');
        card.dataset.id = data.id;
        card.dataset.type = data.type;

        card.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front" style="background:${data.color}">
                <div class="${data.type === 'Símbolo' ? 'symbol-text' : 'name-text'}">
                    ${data.text}
                </div>
                <div class="type-indicator">${data.type}</div>
            </div>
        `;

        // 'touchend' puede añadirse si buscas optimización extrema en móvil, 
        // pero 'click' funciona perfectamente en navegadores móviles modernos.
        card.addEventListener('click', flipCard);

        board.appendChild(card);
    });
};

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}

const checkMatch = () => {
    const isMatch =
        firstCard.dataset.id === secondCard.dataset.id &&
        firstCard.dataset.type !== secondCard.dataset.type;

    isMatch ? disableCards() : unflipCards();
};

const disableCards = () => {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    
    // Si encontramos las 8 parejas, mostramos el modal
    if (matchedPairs === elementList.length) {
        setTimeout(() => {
            showWinModal();
        }, 500);
    }

    resetTurn();
};

const unflipCards = () => {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetTurn();
    }, 1000);
};

const resetTurn = () => {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
};

// Funciones para controlar el Modal
const showWinModal = () => {
    const modal = document.getElementById('winModal');
    modal.classList.add('show');
};

const hideWinModal = () => {
    const modal = document.getElementById('winModal');
    modal.classList.remove('show');
};

const resetGame = () => {
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    hideWinModal();
    createBoard();
};

// Eventos de botones
document.getElementById('resetButton').addEventListener('click', resetGame);
document.getElementById('modalResetButton').addEventListener('click', resetGame);

createBoard();
