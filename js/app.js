const STORAGE_KEY = 'el-caso-mafe-state-v1';
const ACCESS_CODE = '240667';

const puzzleAnswers = {
  1: ['COMEDOR', 'EL COMEDOR'],
  2: ['BUSCA SOBRE NEGRO', 'BUSCA EL SOBRE NEGRO', 'SOBRE NEGRO'],
  3: ['MIRA DETRAS DEL ESPEJO', 'DETRAS DEL ESPEJO', 'MIRA DETRÁS DEL ESPEJO'],
  4: ['COJIN MORADO', 'COJÍN MORADO'],
  5: ['NEVERA', 'LA NEVERA'],
  6: ['2467'],
  7: ['MAFE', 'MARIA FERNANDA', 'MARÍA FERNANDA', 'MARIA FERNANDA LEAL PULIDO', 'MARÍA FERNANDA LEAL PULIDO', 'LA ESCRITORA']
};

const puzzleSuccess = {
  1: 'Correcto. La Profe tenía el sello. La siguiente pista está en el comedor.',
  2: 'Bien visto. El mensaje oculto lleva al sobre negro.',
  3: 'Descifrado. La clave LEAL abrió el camino hacia el espejo.',
  4: 'Los márgenes hablaron. Busca el cojín morado.',
  5: 'La coma dictó sentencia. La verdad fría está en la nevera.',
  6: 'Código validado. El expediente final está listo.',
  7: 'Veredicto correcto. Mafe debe escribir la última página.'
};

const quizQuestions = [
  '¿Cuál crees que es el recuerdo de infancia que Mafe más atesora?',
  'Si Mafe pudiera repetir un solo día completo de su vida, ¿cuál crees que elegiría y por qué?',
  '¿Cuál es el plato o la receta que Mafe hace (o pide) que para ti nadie le gana?',
  '¿Qué canción crees que pondría Mafe para bailar sin pena un día feliz?',
  'En tu opinión, ¿cuál ha sido la decisión más valiente de la vida de Mafe?',
  '¿De qué se siente orgullosa de su familia, aunque casi nunca lo diga en voz alta?',
  'Si Mafe escribiera un libro sobre su vida, ¿qué título crees que le pondría?',
  '¿Qué lugar del mundo crees que Mafe sueña con conocer, o al que le encantaría volver?',
  '¿Cuál es la costumbre o manía más "muy Mafe" que todos en esta familia reconocemos?',
  '¿Qué consejo suyo crees que vas a recordar toda la vida?'
];

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved || { access: false, solved: [] };
  } catch {
    return { access: false, solved: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9Ñ ]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function isCorrect(puzzleId, value) {
  const cleanValue = normalize(value);
  return puzzleAnswers[puzzleId].some(answer => normalize(answer) === cleanValue);
}

function updateAccessView() {
  document.body.classList.toggle('access-granted', Boolean(state.access));
  const lockedSection = document.querySelector('[data-locked-section]');
  if (lockedSection) lockedSection.classList.toggle('locked', !state.access);
}

function checkAccess() {
  const input = document.querySelector('#access-code');
  const feedback = document.querySelector('#access-feedback');
  const value = String(input.value || '').replace(/\D/g, '');

  if (value === ACCESS_CODE) {
    state.access = true;
    saveState();
    updateAccessView();
    feedback.textContent = 'Expediente abierto. La investigación puede comenzar.';
    feedback.className = 'feedback good';
    document.querySelector('#escape-room')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    feedback.textContent = 'El expediente rechaza ese código. Muy dramático, pero útil.';
    feedback.className = 'feedback bad';
  }
}

function updatePuzzleView() {
  const solvedSet = new Set(state.solved);
  const solvedCount = solvedSet.size;
  const caseSolved = solvedSet.has(7);
  const progress = Math.round((solvedCount / 7) * 100);
  document.querySelector('[data-progress-bar]').style.width = `${progress}%`;
  document.querySelector('[data-progress-count]').textContent = solvedCount;
  document.querySelector('[data-final-section]')?.toggleAttribute('hidden', !caseSolved);
  document.querySelector('[data-final-link]')?.toggleAttribute('hidden', !caseSolved);

  document.querySelectorAll('[data-puzzle]').forEach(card => {
    const id = Number(card.dataset.puzzle);
    const isSolved = solvedSet.has(id);
    const isOpen = id === 1 || solvedSet.has(id - 1) || isSolved;
    card.classList.toggle('solved', isSolved);
    card.classList.toggle('open', isOpen && !isSolved);
  });
}

function submitPuzzle(card) {
  const puzzleId = Number(card.dataset.puzzle);
  const input = card.querySelector('[data-answer-input]');
  const feedback = card.querySelector('.feedback');

  if (!card.classList.contains('open')) return;

  if (isCorrect(puzzleId, input.value)) {
    if (!state.solved.includes(puzzleId)) state.solved.push(puzzleId);
    state.solved.sort((a, b) => a - b);
    saveState();
    feedback.textContent = puzzleSuccess[puzzleId];
    feedback.className = 'feedback good';
    updatePuzzleView();

    const next = document.querySelector(`[data-puzzle="${puzzleId + 1}"]`);
    if (next) setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
    if (puzzleId === 7) {
      setTimeout(() => {
        document.querySelector('#final')?.scrollIntoView({ behavior: 'smooth' });
      }, 700);
    }
  } else {
    feedback.textContent = 'Todavía no. Revisa el texto como detective, no como turista del misterio.';
    feedback.className = 'feedback bad';
  }
}

/* ----------------------------------------------------------
   Quiz multijugador: cada familiar responde con su nombre,
   las respuestas se guardan en localStorage y al final se
   comparan para que Mafe declare quién tuvo la razón.
---------------------------------------------------------- */
const QUIZ_STORAGE_KEY = 'el-caso-mafe-quiz-v1';
let quizPlayers = loadQuizPlayers();
let quizSession = null; // { name, index, answers: [] }

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadQuizPlayers() {
  try {
    const saved = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveQuizPlayers() {
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizPlayers));
}

function showQuizScreen(name) {
  document.querySelectorAll('[data-quiz-screen]').forEach(screen => {
    screen.hidden = screen.dataset.quizScreen !== name;
  });
}

function renderQuizRoster() {
  const roster = document.querySelector('[data-quiz-roster]');
  const compareButton = document.querySelector('[data-quiz-compare]');
  if (!roster) return;

  if (!quizPlayers.length) {
    roster.innerHTML = '<p class="quiz-roster-empty">Aún no hay jugadores. Sé el primero en responder.</p>';
  } else {
    roster.innerHTML = `<p class="quiz-roster-title">Ya respondieron (${quizPlayers.length}):</p>` +
      '<ul class="quiz-roster-list">' +
      quizPlayers.map((player, i) =>
        `<li><span>🕵️ ${escapeHtml(player.name)}</span><button type="button" class="quiz-remove" data-quiz-remove="${i}" aria-label="Quitar a ${escapeHtml(player.name)}">✕</button></li>`
      ).join('') +
      '</ul>';
  }

  if (compareButton) compareButton.hidden = quizPlayers.length < 1;

  roster.querySelectorAll('[data-quiz-remove]').forEach(button => {
    button.addEventListener('click', () => {
      quizPlayers.splice(Number(button.dataset.quizRemove), 1);
      saveQuizPlayers();
      renderQuizRoster();
    });
  });
}

function startQuizPlayer() {
  const input = document.querySelector('#quiz-player');
  const name = String(input.value || '').trim();
  if (!name) {
    input.focus();
    return;
  }
  quizSession = { name, index: 0, answers: [] };
  input.value = '';
  showQuizScreen('playing');
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const step = document.querySelector('[data-quiz-step]');
  const playerLabel = document.querySelector('[data-quiz-player-label]');
  const title = document.querySelector('[data-quiz-question]');
  const answerInput = document.querySelector('[data-quiz-answer]');
  const nextButton = document.querySelector('[data-quiz-next]');

  step.textContent = `Pregunta ${quizSession.index + 1} de ${quizQuestions.length}`;
  playerLabel.textContent = `Responde: ${quizSession.name}`;
  title.textContent = quizQuestions[quizSession.index];

  answerInput.value = quizSession.answers[quizSession.index] || '';
  nextButton.disabled = answerInput.value.trim() === '';
  nextButton.textContent = quizSession.index === quizQuestions.length - 1 ? 'Guardar respuestas' : 'Siguiente';
  answerInput.focus();
}

function nextQuizQuestion() {
  const answerInput = document.querySelector('[data-quiz-answer]');
  if (!quizSession) return;
  const value = String(answerInput.value || '').trim();
  if (value === '') return;
  quizSession.answers[quizSession.index] = value;
  quizSession.index += 1;

  if (quizSession.index >= quizQuestions.length) {
    quizPlayers.push({ name: quizSession.name, answers: quizSession.answers });
    saveQuizPlayers();
    quizSession = null;
    renderQuizRoster();
    showQuizScreen('setup');
    return;
  }
  renderQuizQuestion();
}

function renderQuizCompare() {
  const body = document.querySelector('[data-quiz-compare-body]');
  if (!body) return;

  if (!quizPlayers.length) {
    body.innerHTML = '<p>No hay respuestas guardadas todavía.</p>';
    return;
  }

  body.innerHTML = quizQuestions.map((question, qi) => {
    const rows = quizPlayers.map(player => {
      const text = player.answers[qi] ? escapeHtml(player.answers[qi]) : '<em>—</em>';
      return `<li><strong>${escapeHtml(player.name)}:</strong> ${text}</li>`;
    }).join('');
    return `
      <article class="quiz-compare-card">
        <h4>${qi + 1}. ${question}</h4>
        <ul>${rows}</ul>
      </article>`;
  }).join('');
}

function initQuiz() {
  const startButton = document.querySelector('[data-quiz-start]');
  const nextButton = document.querySelector('[data-quiz-next]');
  const compareButton = document.querySelector('[data-quiz-compare]');
  const backButton = document.querySelector('[data-quiz-back]');
  const resetButton = document.querySelector('[data-quiz-reset-all]');
  const input = document.querySelector('#quiz-player');
  const answerInput = document.querySelector('[data-quiz-answer]');
  if (!startButton) return;

  startButton.addEventListener('click', startQuizPlayer);
  input?.addEventListener('keydown', event => {
    if (event.key === 'Enter') startQuizPlayer();
  });
  answerInput?.addEventListener('input', () => {
    nextButton.disabled = answerInput.value.trim() === '';
  });
  answerInput?.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      nextQuizQuestion();
    }
  });
  nextButton?.addEventListener('click', nextQuizQuestion);
  compareButton?.addEventListener('click', () => {
    renderQuizCompare();
    showQuizScreen('compare');
  });
  backButton?.addEventListener('click', () => {
    renderQuizRoster();
    showQuizScreen('setup');
  });
  resetButton?.addEventListener('click', () => {
    quizPlayers = [];
    saveQuizPlayers();
    renderQuizRoster();
    showQuizScreen('setup');
  });

  renderQuizRoster();
  showQuizScreen('setup');
}

/* ----------------------------------------------------------
   Minijuegos familiares (ruleta, oráculo, Mafe responde,
   y Awards). Reutilizan el contenido de data.js.
---------------------------------------------------------- */
const MINI = window.MAFE_CASE_DATA || {};

function pickRandom(list, last) {
  if (!Array.isArray(list) || !list.length) return '';
  if (list.length === 1) return list[0];
  let choice;
  do {
    choice = list[Math.floor(Math.random() * list.length)];
  } while (choice === last);
  return choice;
}

function setupRoulette() {
  const button = document.querySelector('[data-ruleta-spin]');
  const card = document.querySelector('[data-ruleta-card]');
  if (!button || !card || !MINI.roulette) return;
  let last = null;
  button.addEventListener('click', () => {
    card.classList.add('spinning');
    button.disabled = true;
    setTimeout(() => {
      last = pickRandom(MINI.roulette, last);
      card.innerHTML = `<span class="mini-eyebrow">Le toca a quien gire</span><h4>${last}</h4>`;
      card.classList.remove('spinning');
      button.disabled = false;
    }, 650);
  });
}

function setupMafeResponde() {
  const button = document.querySelector('[data-mafe-btn]');
  const card = document.querySelector('[data-mafe-card]');
  if (!button || !card || !MINI.mafeQuestions) return;
  let last = null;
  button.addEventListener('click', () => {
    last = pickRandom(MINI.mafeQuestions, last);
    card.innerHTML = `<span class="mini-eyebrow">Pregunta para Mafe</span><h4>${last}</h4>`;
  });
}

function setupAwards() {
  const grid = document.querySelector('[data-awards-grid]');
  if (!grid || !MINI.awards) return;
  grid.innerHTML = MINI.awards
    .map(award => `<article class="award-card"><span class="award-medal" aria-hidden="true">🏅</span><h4>${award.title}</h4><p>${award.text}</p></article>`)
    .join('');
}

function initMinijuegos() {
  setupRoulette();
  setupMafeResponde();
  setupAwards();
}

function init() {
  document.querySelector('[data-check-access]')?.addEventListener('click', checkAccess);
  document.querySelector('#access-code')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') checkAccess();
  });

  document.querySelectorAll('[data-submit-answer]').forEach(button => {
    button.addEventListener('click', () => submitPuzzle(button.closest('[data-puzzle]')));
  });

  document.querySelectorAll('[data-answer-input]').forEach(input => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') submitPuzzle(input.closest('[data-puzzle]'));
    });
  });

  document.querySelectorAll('[data-print]').forEach(button => {
    button.addEventListener('click', () => window.print());
  });

  updateAccessView();
  updatePuzzleView();
  initQuiz();
  initMinijuegos();
}

document.addEventListener('DOMContentLoaded', init);
