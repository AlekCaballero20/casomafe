const DATA = window.MAFE_CASE_DATA;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = {
  access: false,
  completedKeys: [],
  quizDone: false,
  hintLevels: {}
};

const STORAGE_KEY = "mafe_case_state_v1";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object") {
      state.access = Boolean(saved.access);
      state.completedKeys = Array.isArray(saved.completedKeys) ? saved.completedKeys : [];
      state.quizDone = Boolean(saved.quizDone);
      state.hintLevels = saved.hintLevels && typeof saved.hintLevels === "object" ? saved.hintLevels : {};
    }
  } catch (error) {
    console.warn("No se pudo cargar el progreso", error);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

function normalizeCode(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function goTo(id) {
  const target = document.getElementById(id);
  if (!target) return;

  $$(".screen").forEach((screen) => screen.classList.remove("active"));
  target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  const nav = $("#mainNav");
  nav.classList.remove("open");
}

function wireNavigation() {
  $$("[data-go]").forEach((button) => {
    button.addEventListener("click", () => goTo(button.dataset.go));
  });

  $("#menuToggle").addEventListener("click", () => {
    $("#mainNav").classList.toggle("open");
  });
}

function unlockCase() {
  const input = $("#accessCode");
  const value = normalizeCode(input.value);
  const accepted = DATA.accessCodes.map(normalizeCode);

  if (accepted.includes(value)) {
    state.access = true;
    saveState();
    $("#accessFeedback").textContent = "Expediente abierto. La familia queda oficialmente bajo sospecha emocional.";
    $("#accessFeedback").className = "feedback success";
    renderAll();
    showToast("Expediente desbloqueado 🔍");
    setTimeout(() => goTo("salas"), 700);
  } else {
    $("#accessFeedback").textContent = "Código incorrecto. La pista está en la fecha de nacimiento de Mafe.";
    $("#accessFeedback").className = "feedback error";
  }
}

function isEscapeComplete() {
  return DATA.escapeRooms.every((room) => state.completedKeys.includes(room.id));
}

function progressPercentage() {
  const total = DATA.escapeRooms.length + 2;
  let done = 0;
  if (state.access) done += 1;
  if (state.quizDone) done += 1;
  done += state.completedKeys.length;
  return Math.round((done / total) * 100);
}

function renderRooms() {
  const grid = $("#roomGrid");
  grid.innerHTML = "";

  DATA.menuRooms.forEach((room) => {
    const locked = !state.access && room.id !== "final";
    const card = document.createElement("article");
    card.className = `room-card paper ${locked ? "locked" : ""}`;
    card.innerHTML = `
      <div class="room-icon">${room.icon}</div>
      <h3>${room.title}</h3>
      <p>${room.description}</p>
      <button class="${locked ? "ghost" : "secondary"}" ${locked ? "disabled" : ""} data-room="${room.id}">
        ${locked ? "Bloqueado" : "Entrar"}
      </button>
    `;
    grid.appendChild(card);
  });

  $$("[data-room]").forEach((button) => {
    button.addEventListener("click", () => goTo(button.dataset.room));
  });
}

function renderProgress() {
  const pct = progressPercentage();
  $("#progressText").textContent = `${pct}%`;
  $("#progressFill").style.width = `${pct}%`;
}

function renderEscape() {
  const container = $("#escapeSteps");
  container.innerHTML = "";

  DATA.escapeRooms.forEach((room, index) => {
    const previousCompleted = index === 0 || state.completedKeys.includes(DATA.escapeRooms[index - 1].id);
    const completed = state.completedKeys.includes(room.id);
    const available = state.access && previousCompleted;
    const hintLevel = state.hintLevels[room.id] || 0;

    const article = document.createElement("article");
    article.className = `escape-step paper ${completed ? "completed" : ""} ${!available ? "locked" : ""}`;

    article.innerHTML = `
      <div class="step-head">
        <span class="badge">Evidencia ${room.number}</span>
        <span class="status">${completed ? "Resuelta" : available ? "Disponible" : "Bloqueada"}</span>
      </div>
      <h3>${room.title}</h3>
      ${available || completed ? `
        <p class="location"><strong>Zona de búsqueda:</strong> ${room.location}</p>
        <div class="mission-clue"><span aria-hidden="true">⌕</span><p>${room.digitalClue}</p></div>
        <p><strong>Misión:</strong> ${room.task}</p>
        ${hintLevel ? `<div class="player-hint"><strong>Ayuda ${hintLevel}:</strong> ${room.hints[hintLevel - 1]}</div>` : ""}
        ${!completed && hintLevel < room.hints.length ? `<button class="ghost hint-button" data-hint="${room.id}">${hintLevel ? "Necesito otra ayuda" : "Pedir una ayuda"}</button>` : ""}
      ` : `<p class="locked-copy">Resuelvan la evidencia anterior para revelar esta misión.</p>`}
      <div class="code-row">
        <input type="text" ${available && !completed ? "" : "disabled"} placeholder="Escribir código encontrado" data-code-input="${room.id}" />
        <button class="primary" ${available && !completed ? "" : "disabled"} data-unlock-key="${room.id}">Validar llave</button>
      </div>
      <p class="reward">${completed ? `✅ ${room.reward}` : ""}</p>
    `;

    container.appendChild(article);
  });

  $$("[data-unlock-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.unlockKey;
      const room = DATA.escapeRooms.find((item) => item.id === id);
      const input = document.querySelector(`[data-code-input="${id}"]`);
      const value = normalizeCode(input.value);

      if (value === normalizeCode(room.code)) {
        if (!state.completedKeys.includes(id)) {
          state.completedKeys.push(id);
          saveState();
        }
        showToast(`Llave desbloqueada: ${room.title}`);
        renderAll();
      } else {
        showToast("Ese código no abre esta llave. Sospechoso, muy sospechoso.");
      }
    });
  });

  $$("[data-hint]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.hint;
      state.hintLevels[id] = (state.hintLevels[id] || 0) + 1;
      saveState();
      renderEscape();
    });
  });
}

function renderQuiz() {
  const form = $("#quizForm");
  form.innerHTML = "";

  DATA.quiz.forEach((item, index) => {
    const block = document.createElement("fieldset");
    block.className = "paper question-block";
    block.innerHTML = `
      <legend>Evidencia ${String(index + 1).padStart(3, "0")}</legend>
      <h3>${item.question}</h3>
      <div class="answers">
        ${item.options
          .map((option, optionIndex) => `
            <label>
              <input type="radio" name="q${index}" value="${optionIndex}" />
              <span>${option}</span>
            </label>
          `)
          .join("")}
      </div>
    `;
    form.appendChild(block);
  });
}

function finishQuiz() {
  let score = 0;
  DATA.quiz.forEach((item, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && Number(selected.value) === item.answer) {
      score++;
    }
  });

  const label = DATA.scoreLabels.find((item) => score >= item.min && score <= item.max) || DATA.scoreLabels[0];

  state.quizDone = true;
  saveState();

  const result = $("#quizResult");
  result.classList.remove("hidden");
  result.innerHTML = `
    <p class="eyebrow">Resultado</p>
    <h3>${label.title}</h3>
    <p>Obtuviste <strong>${score}</strong> de <strong>${DATA.quiz.length}</strong> aciertos.</p>
    <p>${label.text}</p>
  `;

  renderProgress();
  showToast("Resultado calculado. El expediente toma nota.");
}

function resetQuiz() {
  $("#quizForm").reset();
  $("#quizResult").classList.add("hidden");
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function renderRoulette() {
  $("#spinBtn").addEventListener("click", () => {
    const wheel = $("#rouletteWheel");
    wheel.classList.remove("spin");
    void wheel.offsetWidth;
    wheel.classList.add("spin");

    setTimeout(() => {
      const question = randomFrom(DATA.roulette);
      $("#rouletteCard").innerHTML = `
        <p class="eyebrow">Pregunta actual</p>
        <h3>${question}</h3>
      `;
    }, 650);
  });
}

function renderOracle() {
  $("#oracleBtn").addEventListener("click", () => {
    const phrase = randomFrom(DATA.oracle);
    $("#oracleCard").innerHTML = `<p>“${phrase}”</p>`;
  });
}

function renderMafeQuestions() {
  $("#mafeQuestionBtn").addEventListener("click", () => {
    const question = randomFrom(DATA.mafeQuestions);
    $("#mafeQuestionCard").innerHTML = `
      <p class="eyebrow">Pregunta para Mafe</p>
      <h3>${question}</h3>
    `;
  });
}

let detectaCurrent = null;

function renderDetectaScene() {
  detectaCurrent = randomFrom(DATA.detectaScenes);
  $("#detectaTitle").textContent = detectaCurrent.title;
  $("#detectaList").innerHTML = detectaCurrent.original.map((item) => `<li>${item}</li>`).join("");
  $("#detectaQuestion").classList.add("hidden");
  $("#detectaFeedback").textContent = "";
}

function showChangedScene() {
  if (!detectaCurrent) renderDetectaScene();

  $("#detectaList").innerHTML = detectaCurrent.changed.map((item) => `<li>${item}</li>`).join("");
  const options = [...new Set([...detectaCurrent.original])].sort(() => Math.random() - 0.5);
  $("#detectaOptions").innerHTML = options
    .map((option) => `<button class="secondary detecta-option" data-answer="${option}">${option}</button>`)
    .join("");

  $("#detectaQuestion").classList.remove("hidden");

  $$(".detecta-option").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.answer;
      const ok = selected === detectaCurrent.answer;
      $("#detectaFeedback").textContent = ok
        ? "Correcto. Mafe aprobaría esta investigación."
        : "No era ese. La escena te engañó, clásico comportamiento de escena.";
      $("#detectaFeedback").className = `feedback ${ok ? "success" : "error"}`;
    });
  });
}

function wireDetecta() {
  $("#showChangedSceneBtn").addEventListener("click", showChangedScene);
  $("#newDetectaBtn").addEventListener("click", renderDetectaScene);
  renderDetectaScene();
}

function renderProfile() {
  const p = DATA.profile;
  $("#profileCard").innerHTML = `
    <div class="profile-main">
      <div class="profile-avatar">MF</div>
      <div>
        <p class="eyebrow">Ficha oficial</p>
        <h3>${p.nombreCompleto}</h3>
        <p><strong>Alias:</strong> ${p.alias}</p>
        <p><strong>Nacimiento:</strong> ${p.nacimiento}</p>
        <p><strong>Expediente:</strong> ${p.expediente}</p>
        <p><strong>Edad en 2026:</strong> ${p.edad2026}</p>
      </div>
    </div>
    <div class="profile-facts">
      <p><strong>Rol:</strong> ${p.rol}</p>
      <p><strong>Especialidad:</strong> ${p.especialidad}</p>
      <p><strong>Superpoder:</strong> ${p.superpoder}</p>
      <blockquote>${p.fraseExpediente}</blockquote>
    </div>
  `;

  $("#evidenceGrid").innerHTML = DATA.evidence
    .map((item) => `
      <article class="paper evidence-card">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `)
    .join("");
}

function renderAwards() {
  $("#awardsGrid").innerHTML = DATA.awards
    .map((award) => `
      <article class="paper award-card">
        <div class="award-icon">🏆</div>
        <h3>${award.title}</h3>
        <p>${award.text}</p>
      </article>
    `)
    .join("");
}

function renderFinal() {
  const unlocked = isEscapeComplete();

  $("#finalLocked").classList.toggle("hidden", unlocked);
  $("#finalUnlocked").classList.toggle("hidden", !unlocked);
}

function confetti() {
  const pieces = 80;
  for (let i = 0; i < pieces; i++) {
    const conf = document.createElement("span");
    conf.className = "confetti";
    conf.style.left = `${Math.random() * 100}%`;
    conf.style.animationDelay = `${Math.random() * 0.6}s`;
    conf.style.transform = `rotate(${Math.random() * 180}deg)`;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 2200);
  }
  showToast("Expediente cerrado con abrazo obligatorio 💜");
}

function renderAll() {
  renderRooms();
  renderProgress();
  renderEscape();
  renderProfile();
  renderAwards();
  renderFinal();
}

function init() {
  loadState();
  wireNavigation();

  $("#unlockCaseBtn").addEventListener("click", unlockCase);
  $("#accessCode").addEventListener("keydown", (event) => {
    if (event.key === "Enter") unlockCase();
  });

  $("#finishQuizBtn").addEventListener("click", finishQuiz);
  $("#resetQuizBtn").addEventListener("click", resetQuiz);
  $("#confettiBtn").addEventListener("click", confetti);

  renderQuiz();
  renderRoulette();
  renderOracle();
  renderMafeQuestions();
  wireDetecta();
  renderAll();

  if (state.access) {
    $("#accessFeedback").textContent = "Expediente abierto previamente.";
    $("#accessFeedback").className = "feedback success";
  }
}

document.addEventListener("DOMContentLoaded", init);
