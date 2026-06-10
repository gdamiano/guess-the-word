// --- GLOBAL STATE ---
const globalScores = {}; // { "Player Name": 10 }

const state = {
  selectedGame: null, // 'MODE_ONE_EXPERT'
  players: [],
  playerCount: 4,
  rolesConfig: {
    SHEPHERD: 1, // Fixed
    WOLF: 1,
    SHEEPDOG: 1,
    SECRET_SHEEPDOG: 0
  },
  selectedTopics: [],
  words: [],
  secretWord: '',
  roles: {}, // { "Player Name": "WOLF" }
  passIndex: 0,
  
  // Voting Round State
  triesLeft: 3,
  wordGuessedCorrectly: false,
  wolvesFoundInput: 0
};

// --- DOM ELEMENTS ---
const screens = {
  home: document.getElementById('screen-home'),
  setupPlayers: document.getElementById('screen-setup-players'),
  setupRoles: document.getElementById('screen-setup-roles'),
  setupTopics: document.getElementById('screen-setup-topics'),
  howToPlay: document.getElementById('screen-how-to-play'),
  handTo: document.getElementById('screen-hand-to'),
  planning: document.getElementById('screen-planning'),
  mainPlay: document.getElementById('screen-main-play'),
  endRound: document.getElementById('screen-end-round'),
  scoreboard: document.getElementById('screen-scoreboard')
};

const appFrame = document.getElementById('app-frame');
const appHeaderTitle = document.getElementById('app-header-title');
const btnAppClose = document.getElementById('btn-app-close');

// --- ROUTING ---
function showScreen(screenKey) {
  Object.keys(screens).forEach(key => {
    if (key === screenKey) {
      screens[key].classList.remove('hidden');
    } else {
      screens[key].classList.add('hidden');
    }
  });

  // Manage header visibility
  if (screenKey === 'home') {
    appHeaderTitle.textContent = STRINGS.HEADER_CHOOSE_GAME;
    btnAppClose.style.display = 'none';
  } else {
    appHeaderTitle.textContent = STRINGS.MODES[state.selectedGame].title;
    btnAppClose.style.display = 'flex';
  }
}

// --- INITIALIZATION ---
function initApp() {
  appHeaderTitle.textContent = STRINGS.HEADER_CHOOSE_GAME;
  document.getElementById('label-mode-expert').textContent = STRINGS.MODES.MODE_ONE_EXPERT.title;
  document.getElementById('label-mode-group').textContent = STRINGS.MODES.MODE_GROUP_GUESSERS.title;
  document.getElementById('btn-home-start').textContent = STRINGS.BTN_START_GAME;
  
  selectMode('MODE_ONE_EXPERT');
  showScreen('home');
}

function selectMode(modeId) {
  state.selectedGame = modeId;
  const modeData = STRINGS.MODES[modeId];
  
  document.getElementById('mode-description').textContent = modeData.description;
  
  if (modeId === 'MODE_ONE_EXPERT') {
    document.getElementById('btn-mode-expert').classList.add('active');
    document.getElementById('btn-mode-group').classList.remove('active');
  } else {
    document.getElementById('btn-mode-group').classList.add('active');
    document.getElementById('btn-mode-expert').classList.remove('active');
  }
  
  appFrame.className = `app-frame ${modeData.themeClass}`;
}

document.getElementById('btn-mode-expert').addEventListener('click', () => selectMode('MODE_ONE_EXPERT'));
document.getElementById('btn-mode-group').addEventListener('click', () => selectMode('MODE_GROUP_GUESSERS'));

btnAppClose.addEventListener('click', () => {
  if (confirm("Are you sure you want to quit the current game?")) {
    selectMode('MODE_ONE_EXPERT');
    showScreen('home');
  }
});

// ==========================================
// 1. HOME & HOW TO PLAY
// ==========================================
document.getElementById('btn-home-start').addEventListener('click', () => {
  if (state.selectedGame !== 'MODE_ONE_EXPERT') {
    alert("Only Ask the Shepherd is implemented for now!");
    return;
  }
  // Show How to Play first
  document.getElementById('how-to-play-desc').textContent = STRINGS.MODES[state.selectedGame].how_to_play_desc;
  showScreen('howToPlay');
});

document.getElementById('btn-how-to-play-cancel').addEventListener('click', () => showScreen('home'));
document.getElementById('btn-how-to-play-play').addEventListener('click', () => {
  initSetupPlayers();
});

// ==========================================
// 2. SETUP PLAYERS
// ==========================================
function initSetupPlayers() {
  renderPlayerInputs();
  showScreen('setupPlayers');
}

function renderPlayerInputs() {
  document.getElementById('players-count-display').textContent = state.playerCount;
  const container = document.getElementById('players-input-list');
  
  // Retain existing values if possible
  const currentValues = Array.from(container.querySelectorAll('input')).map(inp => inp.value);
  container.innerHTML = '';
  
  for (let i = 0; i < state.playerCount; i++) {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'player-input';
    inp.placeholder = `Player ${i + 1}`;
    inp.value = currentValues[i] || `Player ${i + 1}`;
    container.appendChild(inp);
  }
}

document.getElementById('btn-players-plus').addEventListener('click', () => {
  if (state.playerCount < 10) { state.playerCount++; renderPlayerInputs(); }
});
document.getElementById('btn-players-minus').addEventListener('click', () => {
  if (state.playerCount > 3) { state.playerCount--; renderPlayerInputs(); }
});

document.getElementById('btn-setup-players-cancel').addEventListener('click', () => showScreen('home'));
document.getElementById('btn-setup-players-next').addEventListener('click', () => {
  // Save players
  const inputs = document.getElementById('players-input-list').querySelectorAll('input');
  state.players = Array.from(inputs).map((inp, idx) => inp.value.trim() || `Player ${idx + 1}`);
  
  // Ensure all players are in globalScores
  state.players.forEach(p => { if (globalScores[p] === undefined) globalScores[p] = 0; });
  
  initSetupRoles();
});

// ==========================================
// 3. SETUP ROLES
// ==========================================
function updateRoleDisplays() {
  document.getElementById('wolf-count-display').textContent = state.rolesConfig.WOLF;
  document.getElementById('sheepdog-count-display').textContent = state.rolesConfig.SHEEPDOG;
  document.getElementById('secretsheepdog-count-display').textContent = state.rolesConfig.SECRET_SHEEPDOG;
}

function initSetupRoles() {
  updateRoleDisplays();
  showScreen('setupRoles');
}

function handleRoleChange(roleKey, delta) {
  const currentSum = state.rolesConfig.SHEPHERD + state.rolesConfig.WOLF + state.rolesConfig.SHEEPDOG + state.rolesConfig.SECRET_SHEEPDOG;
  const newVal = state.rolesConfig[roleKey] + delta;
  
  if (newVal < 0) return;
  if (delta > 0 && currentSum >= state.playerCount) {
    alert("Cannot add more roles than players!");
    return;
  }
  
  state.rolesConfig[roleKey] = newVal;
  updateRoleDisplays();
}

document.getElementById('btn-wolf-plus').addEventListener('click', () => handleRoleChange('WOLF', 1));
document.getElementById('btn-wolf-minus').addEventListener('click', () => handleRoleChange('WOLF', -1));
document.getElementById('btn-sheepdog-plus').addEventListener('click', () => handleRoleChange('SHEEPDOG', 1));
document.getElementById('btn-sheepdog-minus').addEventListener('click', () => handleRoleChange('SHEEPDOG', -1));
document.getElementById('btn-secretsheepdog-plus').addEventListener('click', () => handleRoleChange('SECRET_SHEEPDOG', 1));
document.getElementById('btn-secretsheepdog-minus').addEventListener('click', () => handleRoleChange('SECRET_SHEEPDOG', -1));

document.getElementById('btn-setup-roles-cancel').addEventListener('click', () => showScreen('setupPlayers'));
document.getElementById('btn-setup-roles-next').addEventListener('click', () => {
  initSetupTopics();
});

// ==========================================
// 4. SETUP TOPICS
// ==========================================
function initSetupTopics() {
  const container = document.getElementById('topics-multiselect');
  if (container.children.length === 0) {
    Object.keys(wordCategories).forEach(cat => {
      const opt = document.createElement('div');
      opt.className = 'topic-option selected';
      opt.textContent = cat;
      opt.dataset.topic = cat;
      opt.addEventListener('click', () => {
        opt.classList.toggle('selected');
      });
      container.appendChild(opt);
    });
  }
  showScreen('setupTopics');
}

document.getElementById('btn-topics-select-all').addEventListener('click', () => {
  const opts = document.querySelectorAll('.topic-option');
  opts.forEach(opt => opt.classList.add('selected'));
});

document.getElementById('btn-setup-topics-cancel').addEventListener('click', () => showScreen('setupRoles'));
document.getElementById('btn-setup-topics-next').addEventListener('click', () => {
  const selectedOpts = Array.from(document.querySelectorAll('.topic-option.selected')).map(el => el.dataset.topic);
  if (selectedOpts.length === 0) {
    alert("Please select at least one topic.");
    return;
  }
  state.selectedTopics = selectedOpts;
  startGame();
});

// ==========================================
// GAME INITIALIZATION LOGIC
// ==========================================
function startGame() {
  // 1. Pick Secret Word
  state.words = [];
  state.selectedTopics.forEach(t => {
    state.words = state.words.concat(wordCategories[t]);
  });
  state.secretWord = state.words[Math.floor(Math.random() * state.words.length)];

  // 2. Assign Roles
  // Player 1 is Shepherd
  state.roles = {};
  const shepherdPlayer = state.players[0];
  state.roles[shepherdPlayer] = 'SHEPHERD';
  
  const pool = state.players.slice(1);
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  let pIdx = 0;
  for (let i = 0; i < state.rolesConfig.WOLF; i++) { state.roles[pool[pIdx++]] = 'WOLF'; }
  for (let i = 0; i < state.rolesConfig.SHEEPDOG; i++) { state.roles[pool[pIdx++]] = 'SHEEPDOG'; }
  for (let i = 0; i < state.rolesConfig.SECRET_SHEEPDOG; i++) { state.roles[pool[pIdx++]] = 'SECRET_SHEEPDOG'; }
  while (pIdx < pool.length) { state.roles[pool[pIdx++]] = 'FLOCK'; }

  // 3. Reset Round State
  state.triesLeft = 3;
  state.wordGuessedCorrectly = false;
  state.wolvesFoundInput = 0;
  
  state.passIndex = 0;
  showHandToScreen();
}

// ==========================================
// 5. PASS & PLAY / PLANNING
// ==========================================
function showHandToScreen() {
  const activePlayer = state.players[state.passIndex];
  document.getElementById('hand-to-player-name').textContent = activePlayer;
  
  // The first player is the Shepherd
  if (state.passIndex === 0) {
    document.getElementById('btn-hand-to-ready').textContent = STRINGS.TXT_IM_SHEPHERD;
  } else {
    document.getElementById('btn-hand-to-ready').textContent = "I'm Ready!";
  }
  
  showScreen('handTo');
}

document.getElementById('btn-hand-to-ready').addEventListener('click', () => {
  initPlanningScreen();
});

function initPlanningScreen() {
  const activePlayer = state.players[state.passIndex];
  const roleKey = state.roles[activePlayer];
  const roleConfig = STRINGS.MODES[state.selectedGame].roles[roleKey];
  
  document.getElementById('planning-role-name').textContent = `THE ${roleConfig.name.toUpperCase()}`;
  document.getElementById('planning-role-desc').textContent = roleConfig.desc;
  
  // Handle secret word box contents based on role
  // Wolves, Shepherd, Sheepdog(?) know the word.
  // Wait, does Sheepdog know the word?
  // Setup Role text: "Sheepdog confirms the Flock's final votes."
  // Typically Insider roles: Insider knows, players don't.
  // If Sheepdog is trying to find wolves, does he know the word? 
  // Let's assume ONLY Shepherd and Wolves know the word for sure. The prompt didn't specify.
  // Actually, standard social deduction rules: helper doesn't know. 
  // Let's only show the word to Shepherd and Wolves.
  
  const knowsWord = (roleKey === 'SHEPHERD' || roleKey === 'WOLF');
  const swBox = document.getElementById('secret-word-box');
  
  if (knowsWord) {
    swBox.style.display = 'flex';
    document.getElementById('secret-word-display').textContent = state.secretWord;
  } else {
    swBox.style.display = 'none'; // Hide the box completely for Flock / Sheepdog
  }
  
  showScreen('planning');
}

// Hold to reveal logic
function setupSecretWordBox(boxId, revealId, holdId) {
  const box = document.getElementById(boxId);
  const reveal = document.getElementById(revealId);
  const hold = document.getElementById(holdId);
  
  const show = (e) => { e.preventDefault(); hold.classList.add('hidden'); reveal.classList.remove('hidden'); };
  const hide = (e) => { e.preventDefault(); hold.classList.remove('hidden'); reveal.classList.add('hidden'); };
  
  box.addEventListener('mousedown', show);
  box.addEventListener('touchstart', show);
  box.addEventListener('mouseup', hide);
  box.addEventListener('touchend', hide);
  box.addEventListener('mouseleave', hide);
}

setupSecretWordBox('secret-word-box', 'secret-word-reveal-content', 'secret-word-hold-content');
setupSecretWordBox('main-secret-word-box', 'main-secret-word-reveal-content', 'main-secret-word-hold-content');

document.getElementById('btn-planning-next').addEventListener('click', () => {
  state.passIndex++;
  if (state.passIndex < state.players.length) {
    showHandToScreen();
  } else {
    initMainPlay();
  }
});

// ==========================================
// 6. MAIN PLAY
// ==========================================
function initMainPlay() {
  document.getElementById('main-play-shepherd-name').textContent = state.players[0];
  document.getElementById('main-secret-word-display').textContent = state.secretWord;
  showScreen('mainPlay');
}

document.getElementById('btn-main-play-vote').addEventListener('click', () => {
  initEndRound();
});

// ==========================================
// 7. END OF ROUND
// ==========================================
function updateEndRoundUI() {
  document.getElementById('end-tries-left').textContent = state.triesLeft;
  document.getElementById('end-wolves-display').textContent = state.wolvesFoundInput;
  
  const btnTryAgain = document.getElementById('btn-end-try-again');
  if (state.triesLeft <= 0) {
    btnTryAgain.disabled = true;
    btnTryAgain.textContent = "Out of Tries!";
  } else {
    btnTryAgain.disabled = false;
    btnTryAgain.innerHTML = `Try Again (<span id="end-tries-left">${state.triesLeft}</span> tries left)`;
  }
  
  // Highlight selection
  if (state.wordGuessedCorrectly) {
    document.getElementById('btn-end-got-it').style.opacity = '1';
    document.getElementById('btn-end-try-again').style.opacity = '0.5';
  } else {
    document.getElementById('btn-end-got-it').style.opacity = '0.5';
    document.getElementById('btn-end-try-again').style.opacity = '1';
  }
}

function initEndRound() {
  state.wordGuessedCorrectly = false; // reset
  updateEndRoundUI();
  showScreen('endRound');
}

document.getElementById('btn-end-got-it').addEventListener('click', () => {
  state.wordGuessedCorrectly = true;
  updateEndRoundUI();
});

document.getElementById('btn-end-try-again').addEventListener('click', () => {
  if (state.triesLeft > 0) {
    state.triesLeft--;
    state.wordGuessedCorrectly = false;
    
    // Actually, if they try again, do they go back to the main play screen?
    // The prompt implies 3 attempts around the circle. 
    // Yes, we just decrement tries and go back to Main Play so they can talk more.
    if (state.triesLeft > 0) {
      showScreen('mainPlay');
    } else {
      updateEndRoundUI(); // out of tries, forces them to hit Continue
    }
  }
});

document.getElementById('btn-end-wolves-plus').addEventListener('click', () => {
  if (state.wolvesFoundInput < state.rolesConfig.WOLF) {
    state.wolvesFoundInput++;
    updateEndRoundUI();
  }
});
document.getElementById('btn-end-wolves-minus').addEventListener('click', () => {
  if (state.wolvesFoundInput > 0) {
    state.wolvesFoundInput--;
    updateEndRoundUI();
  }
});

document.getElementById('btn-end-continue').addEventListener('click', () => {
  calculateScores();
  initScoreboard();
});

// ==========================================
// 8. SCORING & SCOREBOARD
// ==========================================
function calculateScores() {
  const scoresConfig = STRINGS.MODES.MODE_ONE_EXPERT.SCORING;
  
  state.players.forEach(p => {
    const role = state.roles[p];
    
    if (state.wordGuessedCorrectly) {
      // +10 to Flock, Sheepdog, Secret Sheepdog
      if (role === 'FLOCK' || role === 'SHEEPDOG' || role === 'SECRET_SHEEPDOG') {
        globalScores[p] += scoresConfig.MODE_ONE_EXPERT_WORD_CORRECT;
      }
    } else {
      // +45 to Wolf if team failed (hit 0 tries, or continue without selecting guessed)
      if (role === 'WOLF') {
        globalScores[p] += scoresConfig.MODE_ONE_EXPERT_WORD_FAILED;
      }
    }
    
    // +15 to Sheepdog per wolf guessed
    if (role === 'SHEEPDOG' || role === 'SECRET_SHEEPDOG') {
      globalScores[p] += (scoresConfig.MODE_ONE_EXPERT_WOLF_FOUND * state.wolvesFoundInput);
    }
  });
}

function initScoreboard() {
  const container = document.getElementById('scoreboard-list');
  container.innerHTML = '';
  
  // Sort players by score
  const sortedPlayers = [...state.players].sort((a, b) => globalScores[b] - globalScores[a]);
  
  sortedPlayers.forEach(p => {
    const row = document.createElement('div');
    row.className = 'score-row';
    
    const nameEl = document.createElement('span');
    nameEl.className = 'score-row-name';
    nameEl.textContent = p;
    
    const ptsEl = document.createElement('span');
    ptsEl.className = 'score-row-pts';
    ptsEl.textContent = globalScores[p];
    
    row.appendChild(nameEl);
    row.appendChild(ptsEl);
    container.appendChild(row);
  });
  
  showScreen('scoreboard');
}

document.getElementById('btn-scoreboard-play-again').addEventListener('click', () => {
  // Retain global scores, but restart the setup loop
  initSetupRoles(); // Usually skip player names, go straight to roles/topics for faster play again
});

// Run Init
initApp();
