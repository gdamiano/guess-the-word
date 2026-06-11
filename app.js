// --- GLOBAL STATE ---
const globalScores = {}; // { "Player Name": 10 }

const state = {
  selectedGame: null, // 'MODE_ONE_EXPERT'
  players: [],
  playerCount: 4,
  shepherdIndex: 0, // Track active Shepherd in the circle
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
  handBackShepherd: document.getElementById('screen-hand-back-shepherd'),
  mainPlay: document.getElementById('screen-main-play'),
  voteWord: document.getElementById('screen-vote-word'),
  voteWolves: document.getElementById('screen-vote-wolves'),
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
  
  // Setup drag-and-drop on the player inputs list
  makeListDraggable(document.getElementById('players-input-list'));
}

function selectMode(modeId) {
  state.selectedGame = modeId;
  const modeData = STRINGS.MODES[modeId];
  
  document.getElementById('mode-description').textContent = modeData.description;
  
  const previewImg = document.getElementById('home-mode-preview');
  if (modeId === 'MODE_ONE_EXPERT') {
    document.getElementById('btn-mode-expert').classList.add('active');
    document.getElementById('btn-mode-group').classList.remove('active');
    if (previewImg) {
      previewImg.src = 'assets/mode_ask_the_expert.png?v=2';
      previewImg.style.display = 'block';
    }
  } else {
    document.getElementById('btn-mode-group').classList.add('active');
    document.getElementById('btn-mode-expert').classList.remove('active');
    if (previewImg) {
      previewImg.style.display = 'none';
    }
  }
  
  // Shift classes to body instead of appFrame
  document.body.className = modeData.themeClass;
  appFrame.className = 'app-frame';
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
  // Immediately show players setup
  initSetupPlayers();
});

document.getElementById('btn-how-to-play-cancel').addEventListener('click', () => showScreen('setupTopics'));
document.getElementById('btn-how-to-play-play').addEventListener('click', () => {
  startGame();
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
  const currentValues = Array.from(container.querySelectorAll('.player-input')).map(inp => inp.value);
  container.innerHTML = '';
  
  for (let i = 0; i < state.playerCount; i++) {
    const val = currentValues[i] || `Player ${i + 1}`;
    
    const row = document.createElement('div');
    row.className = 'player-input-row';
    row.draggable = true;
    row.dataset.index = i;
    
    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.textContent = '☰';
    
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'player-input';
    inp.placeholder = `Player ${i + 1}`;
    inp.value = val;
    
    const upBtn = document.createElement('button');
    upBtn.className = 'btn-up-shift';
    upBtn.textContent = '↑';
    upBtn.type = 'button';
    upBtn.title = "Make Player 1";
    upBtn.addEventListener('click', (e) => {
      const rowEl = e.target.closest('.player-input-row');
      const parentEl = rowEl.parentNode;
      const index = Array.from(parentEl.children).indexOf(rowEl);
      makePlayerFirst(index);
    });
    
    row.appendChild(handle);
    row.appendChild(inp);
    row.appendChild(upBtn);
    container.appendChild(row);
  }
}

function makePlayerFirst(idx) {
  const container = document.getElementById('players-input-list');
  const inputs = Array.from(container.querySelectorAll('.player-input')).map(inp => inp.value);
  const rotated = inputs.slice(idx).concat(inputs.slice(0, idx));
  
  const rows = container.querySelectorAll('.player-input-row');
  rows.forEach((row, i) => {
    const inp = row.querySelector('.player-input');
    inp.value = rotated[i];
    inp.placeholder = `Player ${i + 1}`;
  });
}

function makeListDraggable(container) {
  let dragEl = null;

  // Mouse Drag
  container.addEventListener('dragstart', (e) => {
    const row = e.target.closest('.player-input-row');
    if (row) {
      dragEl = row;
      row.classList.add('dragging');
    }
  });

  container.addEventListener('dragend', (e) => {
    const row = e.target.closest('.player-input-row');
    if (row) {
      row.classList.remove('dragging');
    }
    dragEl = null;
    renumberPlaceholders();
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!dragEl) return;
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(dragEl);
    } else {
      container.insertBefore(dragEl, afterElement);
    }
  });

  // Touch Drag (Mobile)
  let touchStartEl = null;
  container.addEventListener('touchstart', (e) => {
    if (e.target.classList.contains('drag-handle')) {
      const row = e.target.closest('.player-input-row');
      if (row) {
        touchStartEl = row;
        row.classList.add('dragging');
        e.preventDefault();
      }
    }
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    if (!touchStartEl) return;
    e.preventDefault();
    const touch = e.touches[0];
    const afterElement = getDragAfterElement(container, touch.clientY);
    if (afterElement == null) {
      container.appendChild(touchStartEl);
    } else {
      container.insertBefore(touchStartEl, afterElement);
    }
  }, { passive: false });

  container.addEventListener('touchend', (e) => {
    if (touchStartEl) {
      touchStartEl.classList.remove('dragging');
      touchStartEl = null;
      renumberPlaceholders();
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.player-input-row:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renumberPlaceholders() {
  const rows = document.getElementById('players-input-list').querySelectorAll('.player-input-row');
  rows.forEach((row, i) => {
    row.dataset.index = i;
    const input = row.querySelector('.player-input');
    input.placeholder = `Player ${i + 1}`;
  });
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
      opt.className = 'topic-option'; // Start unselected
      opt.textContent = cat;
      opt.dataset.topic = cat;
      opt.addEventListener('click', () => {
        opt.classList.toggle('selected');
      });
      container.appendChild(opt);
    });
  } else {
    // Reset selections on subsequent rounds
    Array.from(container.children).forEach(opt => opt.classList.remove('selected'));
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
  
  // Show How to Play screen now (Feedback 1)
  const modeId = state.selectedGame;
  const container = document.getElementById('how-to-play-list');
  container.innerHTML = '';
  
  const config = HOW_TO_PLAY_CONFIG[modeId];
  if (config && config.length > 0) {
    config.forEach(item => {
      const row = document.createElement('div');
      row.className = 'how-to-play-row';
      
      const img = document.createElement('img');
      img.className = 'how-to-play-row-img';
      img.src = `assets/${item.image}?v=2`;
      img.alt = "";
      img.onerror = () => {
        img.src = `assets/${item.fallback || 'portrait_sheep_neutral.png'}?v=2`;
        img.onerror = null;
      };
      
      const text = document.createElement('p');
      text.className = 'how-to-play-row-text';
      text.textContent = item.text;
      
      row.appendChild(img);
      row.appendChild(text);
      container.appendChild(row);
    });
  } else {
    // Fallback to plain text if config doesn't exist
    const p = document.createElement('p');
    p.className = 'mode-description';
    p.style.fontSize = '1.1rem';
    p.style.lineHeight = '1.6';
    p.textContent = STRINGS.MODES[modeId].how_to_play_desc || "";
    container.appendChild(p);
  }
  showScreen('howToPlay');
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
  state.roles = {};
  
  // Set Shepherd (active shepherd index in the circle)
  const shepherdPlayer = state.players[state.shepherdIndex];
  state.roles[shepherdPlayer] = 'SHEPHERD';
  
  // Set Sheepdog (index next to Shepherd in circle order, if configured) (Feedback 14)
  let sheepdogPlayer = null;
  if (state.rolesConfig.SHEEPDOG > 0) {
    const sheepdogIdx = (state.shepherdIndex + 1) % state.players.length;
    sheepdogPlayer = state.players[sheepdogIdx];
    state.roles[sheepdogPlayer] = 'SHEEPDOG';
  }
  
  // Shuffled pool for remaining roles
  const pool = state.players.filter(p => p !== shepherdPlayer && p !== sheepdogPlayer);
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  let pIdx = 0;
  for (let i = 0; i < state.rolesConfig.WOLF; i++) {
    if (pIdx < pool.length) state.roles[pool[pIdx++]] = 'WOLF';
  }
  for (let i = 0; i < state.rolesConfig.SECRET_SHEEPDOG; i++) {
    if (pIdx < pool.length) state.roles[pool[pIdx++]] = 'SECRET_SHEEPDOG';
  }
  while (pIdx < pool.length) {
    state.roles[pool[pIdx++]] = 'FLOCK';
  }

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
  // Offset by shepherdIndex so phone starts with Shepherd and goes in circle order (Feedback 14/21)
  const activePlayer = state.players[(state.shepherdIndex + state.passIndex) % state.players.length];
  document.getElementById('hand-to-player-name').textContent = activePlayer;
  
  // Button says "I'm [Player Name]" instead of a role name (Feedback 9)
  document.getElementById('btn-hand-to-ready').textContent = `I'm ${activePlayer}`;
  
  showScreen('handTo');
}

document.getElementById('btn-hand-to-ready').addEventListener('click', () => {
  initPlanningScreen();
});

function initPlanningScreen() {
  const activePlayer = state.players[(state.shepherdIndex + state.passIndex) % state.players.length];
  const roleKey = state.roles[activePlayer];
  const roleConfig = STRINGS.MODES[state.selectedGame].roles[roleKey];
  
  // Planning Title is generic "YOU ARE PLAYING" in index.html now (Feedback 15)
  // Construct the role description + secret word string to show inside the box (Feedback 11/13)
  const knowsWord = (roleKey === 'SHEPHERD' || roleKey === 'WOLF');
  let revealText = `${roleConfig.name}: ${roleConfig.desc}`;
  if (knowsWord) {
    revealText += ` Word: ${state.secretWord}`;
  }
  
  document.getElementById('secret-word-display').textContent = revealText;
  
  // All planning screens show the box now (Feedback 13)
  document.getElementById('secret-word-box').style.display = 'flex';
  
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
    showHandBackShepherdScreen();
  }
});

function showHandBackShepherdScreen() {
  const shepherdPlayer = state.players[state.shepherdIndex];
  document.getElementById('hand-back-shepherd-name').textContent = shepherdPlayer;
  showScreen('handBackShepherd');
}

document.getElementById('btn-hand-back-shepherd-ready').addEventListener('click', () => {
  initMainPlay();
});

// ==========================================
// 6. MAIN PLAY
// ==========================================
function initMainPlay() {
  const shepherdPlayer = state.players[state.shepherdIndex];
  document.getElementById('main-play-shepherd-name').textContent = shepherdPlayer;
  document.getElementById('main-secret-word-display').textContent = state.secretWord;

  // Set dynamic title and description from config strings
  const modeData = STRINGS.MODES[state.selectedGame];
  document.getElementById('main-play-title').textContent = modeData.main_screen_title || "Time to Vote!";
  document.getElementById('main-play-desc').textContent = modeData.main_screen_desc || "";

  showScreen('mainPlay');
}

document.getElementById('btn-main-play-vote').addEventListener('click', () => {
  initVoteWord();
});

// ==========================================
// 7. VOTING & RESOLUTION (SCREENS 10A & 10B)
// ==========================================
function initVoteWord() {
  const modeData = STRINGS.MODES[state.selectedGame];
  document.getElementById('vote-word-title').textContent = modeData.vote_word_title || "GUESS THE WORD";
  document.getElementById('vote-word-desc').textContent = modeData.vote_word_desc || "";
  
  // Update tries left text on wrong button
  document.getElementById('vote-word-tries-left').textContent = state.triesLeft;
  
  showScreen('voteWord');
}

document.getElementById('btn-vote-word-correct').addEventListener('click', () => {
  state.wordGuessedCorrectly = true;
  initVoteWolves();
});

document.getElementById('btn-vote-word-wrong').addEventListener('click', () => {
  state.wordGuessedCorrectly = false;
  if (state.triesLeft > 0) {
    state.triesLeft--;
    if (state.triesLeft > 0) {
      showScreen('mainPlay');
    } else {
      // 0 tries left, force transition to finding wolves
      initVoteWolves();
    }
  }
});

document.getElementById('btn-vote-word-cancel').addEventListener('click', () => {
  showScreen('mainPlay');
});

function initVoteWolves() {
  const modeData = STRINGS.MODES[state.selectedGame];
  document.getElementById('vote-wolves-title').textContent = modeData.vote_wolves_title || "FIND THE WOLVES";
  document.getElementById('vote-wolves-desc').textContent = modeData.vote_wolves_desc || "";
  
  state.wolvesFoundInput = 0; // Reset to 0, centered
  updateVoteWolvesUI();
  showScreen('voteWolves');
}

function updateVoteWolvesUI() {
  document.getElementById('vote-wolves-display').textContent = state.wolvesFoundInput;
}

document.getElementById('btn-vote-wolves-plus').addEventListener('click', () => {
  if (state.wolvesFoundInput < state.rolesConfig.WOLF) {
    state.wolvesFoundInput++;
    updateVoteWolvesUI();
  }
});

document.getElementById('btn-vote-wolves-minus').addEventListener('click', () => {
  if (state.wolvesFoundInput > 0) {
    state.wolvesFoundInput--;
    updateVoteWolvesUI();
  }
});

document.getElementById('btn-vote-wolves-back').addEventListener('click', () => {
  initVoteWord();
});

document.getElementById('btn-vote-wolves-continue').addEventListener('click', () => {
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
      if (role === 'FLOCK' || role === 'SHEEPDOG' || role === 'SECRET_SHEEPDOG') {
        globalScores[p] += scoresConfig.MODE_ONE_EXPERT_WORD_CORRECT;
      }
    } else {
      if (role === 'WOLF') {
        globalScores[p] += scoresConfig.MODE_ONE_EXPERT_WORD_FAILED;
      }
    }
    
    if (role === 'SHEEPDOG' || role === 'SECRET_SHEEPDOG') {
      globalScores[p] += (scoresConfig.MODE_ONE_EXPERT_WOLF_FOUND * state.wolvesFoundInput);
    }
  });
}

function getPointsReason(p) {
  const role = state.roles[p];
  const reasons = [];
  
  if (state.wordGuessedCorrectly) {
    if (role === 'FLOCK' || role === 'SHEEPDOG' || role === 'SECRET_SHEEPDOG') {
      reasons.push("Got the word!");
    }
  } else {
    if (role === 'WOLF') {
      reasons.push("Fooled the flock!");
    }
  }
  
  if ((role === 'SHEEPDOG' || role === 'SECRET_SHEEPDOG') && state.wolvesFoundInput > 0) {
    const count = state.wolvesFoundInput;
    reasons.push(`Found ${count} ${count === 1 ? 'wolf' : 'wolves'}!`);
  }
  
  return reasons.join(' ');
}

function initScoreboard() {
  const container = document.getElementById('scoreboard-list');
  container.innerHTML = '';
  
  // Set dynamic winner title and color on the scoreboard screen
  const titleEl = document.getElementById('scoreboard-title');
  if (state.wordGuessedCorrectly) {
    titleEl.textContent = "THE FLOCK WINS!";
    titleEl.style.color = "#0284c7"; // Blue
  } else {
    titleEl.textContent = "THE WOLVES WIN!";
    titleEl.style.color = "#ef4444"; // Red
  }
  
  const sortedPlayers = [...state.players].sort((a, b) => globalScores[b] - globalScores[a]);
  
  const roleToConfigTerm = {
    'FLOCK': 'team',
    'WOLF': 'spy',
    'SHEEPDOG': 'hunter',
    'SECRET_SHEEPDOG': 'secret_hunter',
    'SHEPHERD': 'expert'
  };

  const fallbackImages = {
    'FLOCK': 'portrait_sheep_neutral.png',
    'WOLF': 'portrait_wolf_neutral.png',
    'SHEEPDOG': 'portrait_sheepdog_happy.png',
    'SECRET_SHEEPDOG': 'portrait_secret_sheepdog.png',
    'SHEPHERD': 'portrait_shepherd_neutral.png'
  };

  sortedPlayers.forEach(p => {
    const row = document.createElement('div');
    row.className = 'score-row';
    
    // Create portrait image
    const role = state.roles[p];
    const isFlockRole = (role !== 'WOLF');
    const isWin = (isFlockRole === state.wordGuessedCorrectly);
    const outcome = isWin ? 'win' : 'lose';
    const configKey = `ask_the_expert_${roleToConfigTerm[role] || 'team'}_${outcome}`;
    const filename = PORTRAIT_CONFIG[configKey] || fallbackImages[role] || 'portrait_sheep_neutral.png';

    const imgEl = document.createElement('img');
    imgEl.className = 'score-row-img';
    imgEl.src = `assets/${filename}?v=2`;
    imgEl.alt = `${p}'s portrait`;
    imgEl.onerror = () => {
      imgEl.src = `assets/${fallbackImages[role] || 'portrait_sheep_neutral.png'}?v=2`;
      imgEl.onerror = null; // Prevent infinite loop in case fallback is also missing
    };
    row.appendChild(imgEl);

    const nameCol = document.createElement('div');
    nameCol.className = 'score-row-info';
    
    const nameEl = document.createElement('span');
    nameEl.className = 'score-row-name';
    nameEl.textContent = p;
    nameCol.appendChild(nameEl);
    
    // Add point reasons (Feedback 20)
    const reasonText = getPointsReason(p);
    if (reasonText) {
      const reasonEl = document.createElement('span');
      reasonEl.className = 'score-row-reason';
      reasonEl.textContent = reasonText;
      nameCol.appendChild(reasonEl);
    }
    
    const ptsEl = document.createElement('span');
    ptsEl.className = 'score-row-pts';
    ptsEl.textContent = globalScores[p];
    
    row.appendChild(nameCol);
    row.appendChild(ptsEl);
    container.appendChild(row);
  });
  
  showScreen('scoreboard');
}

document.getElementById('btn-scoreboard-play-again').addEventListener('click', () => {
  // Move Shepherd and Sheepdog down the line by 1 (Feedback 21)
  state.shepherdIndex = (state.shepherdIndex + 1) % state.players.length;
  initSetupRoles();
});

// Run Init
initApp();
