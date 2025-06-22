// Seleciona elementos da interface
const grid = document.querySelector(".grid");             // Grade onde as cartas serão exibidas
const spanPlayer = document.querySelector('.player');     // Elemento que mostra o nome do jogador
const timer = document.querySelector('.timer');           // Elemento que mostra o tempo decorrido
const cartas = document.getElementById('cartas');         // Efeito sonoro quando as cartas virarem
const vitoria = document.getElementById('vitoria');       // Efeito sonoro quando vencer o jogo
const gameover = document.getElementById('gameover');     // Efeito sonoro quando perder o jogo
const voltarButton = document.getElementById('voltarButton');  // Botão voltar quando acaba o jogo

// --- Configuração baseada na dificuldade selecionada ---
let dificuldade = localStorage.getItem('dificuldade') || 'facil';
let pares, tempoLimite;
let loop;

switch (dificuldade) { // Tempo dos níveis
    case 'facil':
        pares = 5;
        tempoLimite = 60; // 1 minuto
        break;
    case 'media':
        pares = 10;
        tempoLimite = 120; // 2 minutos
        break;
    case 'dificil':
        pares = 15;
        tempoLimite = 180; // 3 minutos
        grid.style.gridTemplateColumns = 'repeat(6, 1fr)'; // Força 6 colunas no difícil
        break;
    default:
        pares = 5;
        tempoLimite = 180;
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
}

let totalCartas = pares * 2;

// Objeto com os nomes dos personagens e suas respectivas extensões de imagem
const characters = {
    dente_podre: "png",
    dentista: "avif",
    enxaguante: "jpg",
    espelho: "png",
    pasta: "jpg",
    seringa: "avif",
    raiva: "jpg",
    cris: "jpeg",
    boca: "jpg",
    doutor: "png",
    doutora: "png",
    lol: "png",
    samurai: "webp",
    steve: "png",
    coraçao: "jpg"
};

// Array com os nomes dos personagens
const characterNames = Object.keys(characters);

// Função auxiliar para criar elementos HTML com classe
const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

let firstCard = '';    // Armazena a primeira carta selecionada
let secondCard = '';   // Armazena a segunda carta selecionada

// Verifica se o jogo terminou (todas as cartas foram reveladas)
const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');

    if (disabledCards.length == totalCartas) {
        clearInterval(loop); // Para o timer
        vitoria.currentTime = 0; 
        vitoria.play(); // Efeito sonoro de vencer
        alert(`Parabéns, ${spanPlayer.innerHTML}! Você venceu! Seu tempo foi: ${timer.innerHTML} segundos!`);

        voltarButton.classList.remove('hidden');
    }
};

// Verifica se as duas cartas selecionadas são iguais
const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');

    if (firstCharacter == secondCharacter) {
        // Se for par, adiciona classe para desativar as cartas
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');

        firstCard = '';
        secondCard = '';

        checkEndGame(); // Verifica se o jogo acabou
    } else {
        // Se não for par, esconde as cartas novamente após 500ms
        setTimeout(() => {
            firstCard.classList.remove("reveal-card");
            secondCard.classList.remove("reveal-card");

            firstCard = '';
            secondCard = '';
        }, 500);
    }
};

// Função para mostrar o verso da carta ao clicar
const revealCard = ({ target }) => {
    if (target.parentNode.className.includes('reveal-card')) {
        return; // Impede que a carta seja clicada duas vezes
    }

    cartas.currentTime = 0;  // Audio das cartas girando
    cartas.play();     

    if (firstCard == '') {
        target.parentNode.classList.add('reveal-card');
        firstCard = target.parentNode;
    } else if (secondCard == '') {
        target.parentNode.classList.add('reveal-card');
        secondCard = target.parentNode;

        checkCards(); // Verifica se as cartas combinam
    }
};

// Cria uma carta com frente e verso
const createCard = (character) => {
    const card = createElement("div", "card");
    const front = createElement("div", "face front");
    const back = createElement("div", "face back");

    // Define a imagem da frente da carta com base no nome e extensão
    const extension = characters[character];
    front.style.backgroundImage = `url('../imagens/${character}.${extension}')`;

    card.setAttribute("data-character", character);
    card.appendChild(front);
    card.appendChild(back);

    // Adiciona o evento de clique para revelar a carta
    card.addEventListener('click', revealCard);

    return card;
};

// Carrega o jogo embaralhando e exibindo as cartas no grid
const loadGame = () => {
    grid.innerHTML = ""; // Limpa as cartas antes de adicionar novas

    // Seleciona somente os pares necessários e duplica para criar os pares
    const selectedCharacters = characterNames.slice(0, pares);
    const duplicatedCharacters = [...selectedCharacters, ...selectedCharacters];
    const shuffledArray = duplicatedCharacters.sort(() => Math.random() - 0.5);

    // Cria e adiciona cada carta ao grid
    shuffledArray.forEach((character) => {
        const card = createCard(character);
        grid.appendChild(card);
    });
};

// Inicia o cronômetro com tempo limite
const startTimer = () => {
    let currentTime = 0;

    loop = setInterval(() => {
        currentTime++;
        timer.innerHTML = currentTime;

        if (currentTime >= tempoLimite) {
            clearInterval(loop);
            gameover.currentTime = 0;
            gameover.play(); // Efeito sonoro da derrota

            setTimeout(() => {
                alert(`Tempo esgotado, ${spanPlayer.innerHTML}!`);
                location.reload();
            }, 1000);
        }
    }, 1000);
};
// Inicializa o jogo ao carregar a página
window.onload = () => {
    spanPlayer.innerHTML = localStorage.getItem('player'); // Exibe o nome do jogador
    startTimer(); // Inicia o cronômetro
    loadGame();   // Carrega as cartas no tabuleiro

    const musicaFundo = document.getElementById('musicaFundo');
    const nomeMusica = localStorage.getItem('musicaFundo');
    if (nomeMusica) {
        musicaFundo.src = `/audios/${nomeMusica}`;
        musicaFundo.volume = 0.2;
        musicaFundo.play();
    }
};

// Aparece ao terminar o jogo e retorna para o começo

voltarButton.addEventListener('click', () => {
    window.location.href = '../html/difficulty.html';
});