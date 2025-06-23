function irParaQuiz() {
  document.getElementById('quiz-section').classList.remove('hidden');
  document.getElementById('jogo-section').classList.add('hidden');
  window.scrollTo({ 
    top: document.getElementById('quiz-section').offsetTop, 
    behavior: 'smooth' 
  });
}

function irParaJogo() {
  window.location.href = '/html/play.html';
}

