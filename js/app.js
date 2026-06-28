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
  {
    question: 'Mafe entra a una reunión familiar donde algo claramente pasó. ¿Cuánto tarda en darse cuenta?',
    options: [
      'Necesita que alguien se lo cuente con detalles',
      'Ya lo sabía desde antes de entrar',
      'Lo nota a los tres días',
      'Jamás se entera, vive en su mundo'
    ],
    answer: 1
  },
  {
    question: 'Si Mafe descubre que le ocultaron algo "para no preocuparla", ¿qué dolería más?',
    options: [
      'El asunto en sí',
      'Que gastaran su plata',
      'Que no le avisaran a tiempo',
      'Nada, lo olvida enseguida'
    ],
    answer: 2
  },
  {
    question: 'Llega un regalo de cumpleaños. ¿Cuál la conmueve de verdad?',
    options: [
      'El más caro de la mesa',
      'Una carta o un detalle pensado',
      'Un electrodoméstico "porque servía"',
      'Un mensaje reenviado de buenos días'
    ],
    answer: 1
  },
  {
    question: 'Su apellido Leal esconde una virtud. ¿Cuál de estas la describe mejor a ELLA?',
    options: [
      'Puntualidad alemana',
      'Indiferencia elegante',
      'Lealtad a los suyos',
      'Suerte en la lotería'
    ],
    answer: 2
  },
  {
    question: 'Alguien dice una mentira piadosa en la mesa. ¿Qué hace Mafe?',
    options: [
      'No se da cuenta de nada',
      'La aplaude por creativa',
      'Se calla, pero su cara ya dictó sentencia',
      'Llama a un abogado de verdad'
    ],
    answer: 2
  },
  {
    question: 'En una sola palabra, ¿qué es Mafe para esta familia?',
    options: [
      'Un trámite',
      'Hogar',
      'El comité de quejas',
      'La WiFi de la casa'
    ],
    answer: 1
  },
  {
    question: '¿Cuál sería el lema perfecto de la agencia detectivesca de Mafe?',
    options: [
      'Eso se veía venir',
      'Yo no observo nada',
      'Después lo investigamos',
      'Asumamos y ya'
    ],
    answer: 0
  },
  {
    question: 'Final del caso: ¿qué merece recibir Mafe hoy?',
    options: [
      'Un formulario más para llenar',
      'Amor, abrazos y una nueva página por escribir',
      'Una reunión con acta y firma',
      'Silencio incómodo'
    ],
    answer: 1
  }
];

let state = loadState();
let currentQuiz = 0;
let quizScore = 0;
let quizLocked = false;

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

function renderQuiz() {
  const question = quizQuestions[currentQuiz];
  const step = document.querySelector('[data-quiz-step]');
  const score = document.querySelector('[data-quiz-score]');
  const title = document.querySelector('[data-quiz-question]');
  const options = document.querySelector('[data-quiz-options]');
  const feedback = document.querySelector('[data-quiz-feedback]');
  const nextButton = document.querySelector('[data-quiz-next]');

  step.textContent = `Pregunta ${currentQuiz + 1} de ${quizQuestions.length}`;
  score.textContent = quizScore;
  title.textContent = question.question;
  feedback.textContent = '';
  feedback.className = 'feedback';
  options.innerHTML = '';
  nextButton.disabled = true;
  quizLocked = false;

  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => chooseQuizOption(button, index));
    options.appendChild(button);
  });
}

function chooseQuizOption(button, index) {
  if (quizLocked) return;
  quizLocked = true;

  const question = quizQuestions[currentQuiz];
  const feedback = document.querySelector('[data-quiz-feedback]');
  const score = document.querySelector('[data-quiz-score]');
  const nextButton = document.querySelector('[data-quiz-next]');

  document.querySelectorAll('[data-quiz-options] button').forEach((optionButton, optionIndex) => {
    if (optionIndex === question.answer) optionButton.classList.add('correct');
  });

  if (index === question.answer) {
    quizScore += 1;
    score.textContent = quizScore;
    feedback.textContent = 'Correcto. La familia conserva algo de esperanza.';
    feedback.className = 'feedback good';
  } else {
    button.classList.add('wrong');
    feedback.textContent = 'Respuesta sospechosa. El tribunal familiar toma nota.';
    feedback.className = 'feedback bad';
  }

  nextButton.disabled = false;
}

function nextQuizQuestion() {
  currentQuiz += 1;
  if (currentQuiz >= quizQuestions.length) {
    const title = document.querySelector('[data-quiz-question]');
    const options = document.querySelector('[data-quiz-options]');
    const feedback = document.querySelector('[data-quiz-feedback]');
    const nextButton = document.querySelector('[data-quiz-next]');
    document.querySelector('[data-quiz-step]').textContent = 'Resultado final';
    title.textContent = `Puntaje final: ${quizScore} de ${quizQuestions.length}`;
    options.innerHTML = '';
    feedback.textContent = quizScore >= 5 ? 'El equipo conoce bien a Mafe. Caso digno.' : 'El equipo necesita entrevistar más a la protagonista, qué cosa tan humana.';
    feedback.className = 'feedback good';
    nextButton.textContent = 'Reiniciar quiz';
    nextButton.disabled = false;
    nextButton.onclick = resetQuiz;
    return;
  }
  renderQuiz();
}

function resetQuiz() {
  currentQuiz = 0;
  quizScore = 0;
  const nextButton = document.querySelector('[data-quiz-next]');
  nextButton.textContent = 'Siguiente pregunta';
  nextButton.onclick = nextQuizQuestion;
  renderQuiz();
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

  document.querySelector('[data-quiz-next]').onclick = nextQuizQuestion;
  updateAccessView();
  updatePuzzleView();
  renderQuiz();
  initMinijuegos();
}

document.addEventListener('DOMContentLoaded', init);
