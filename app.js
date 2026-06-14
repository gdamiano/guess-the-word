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
  passSequence: [], // Custom pass order starting Shepherd -> Sheepdog -> rest
  
  // Voting Round State
  triesLeft: 3,
  wordGuessedCorrectly: false,
  wolvesFoundInput: 0,
  wolvesSurvivedTurns: 0,
  keepRoles: false,
  wolvesGuessedWord: false
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
  scoreboard: document.getElementById('screen-scoreboard'),
  about: document.getElementById('screen-about'),
  voteWolvesGroup: document.getElementById('screen-vote-wolves-group'),
  wolfGuess: document.getElementById('screen-wolf-guess')
};

const appFrame = document.getElementById('app-frame');
const appHeaderTitle = document.getElementById('app-header-title');
const btnAppSettings = document.getElementById('btn-app-settings');
const settingsMenu = document.getElementById('settings-menu');

let currentScreen = 'home';

// --- ROUTING ---
function showScreen(screenKey) {
  Object.keys(screens).forEach(key => {
    if (key === screenKey) {
      screens[key].classList.remove('hidden');
    } else {
      screens[key].classList.add('hidden');
    }
  });

  // Always hide settings menu when navigating
  if (settingsMenu) {
    settingsMenu.classList.add('hidden');
  }

  // Record current non-about screen for returning later
  if (screenKey !== 'about') {
    currentScreen = screenKey;
  }

  // Manage header visibility
  if (screenKey === 'home') {
    appHeaderTitle.textContent = STRINGS.HEADER_CHOOSE_GAME;
  } else if (screenKey === 'about') {
    appHeaderTitle.textContent = STRINGS.ABOUT_TITLE || "About";
  } else {
    appHeaderTitle.textContent = STRINGS.MODES[state.selectedGame].title;
  }

  // Manage End Game menu item availability
  const btnEndGame = document.getElementById('btn-settings-end-game');
  if (btnEndGame) {
    if (screenKey === 'home' || screenKey === 'about') {
      btnEndGame.disabled = true;
      btnEndGame.style.opacity = '0.5';
      btnEndGame.style.cursor = 'not-allowed';
    } else {
      btnEndGame.disabled = false;
      btnEndGame.style.opacity = '1';
      btnEndGame.style.cursor = 'pointer';
    }
  }
}

// --- INITIALIZATION ---
function initApp() {
  appHeaderTitle.textContent = STRINGS.HEADER_CHOOSE_GAME;
  document.getElementById('btn-home-start').textContent = STRINGS.BTN_START_GAME;
  document.getElementById('btn-home-about').textContent = STRINGS.BTN_ABOUT || "About";
  
  selectMode('MODE_ONE_EXPERT');
  showScreen('home');
  
  // Setup drag-and-drop on the player inputs list
  makeListDraggable(document.getElementById('players-input-list'));
  
  // Initialize dynamic background clouds
  initCloudWallpaper();
}

function selectMode(modeId) {
  state.selectedGame = modeId;
  const modeData = STRINGS.MODES[modeId];
  
  const descEl = document.getElementById('mode-description');
  if (descEl) descEl.innerHTML = modeData.description;
  
  const triggerIcon = document.getElementById('dropdown-trigger-icon');
  const triggerText = document.getElementById('dropdown-trigger-text');
  if (triggerText) triggerText.textContent = modeData.title;
  if (triggerIcon) {
    triggerIcon.src = modeId === 'MODE_ONE_EXPERT' 
      ? 'assets/portrait_shepherd_neutral.png?v=2' 
      : 'assets/portrait_sheep_neutral.png?v=2';
  }
  
  const previewImg = document.getElementById('home-mode-preview');
  if (modeId === 'MODE_ONE_EXPERT') {
    if (previewImg) {
      previewImg.src = 'assets/mode_ask_the_expert.png?v=2';
      previewImg.style.display = 'block';
    }
  } else if (modeId === 'MODE_GROUP_GUESSERS') {
    if (previewImg) {
      previewImg.src = 'assets/mode_group_guessing.png?v=2';
      previewImg.style.display = 'block';
    }
  } else {
    if (previewImg) {
      previewImg.style.display = 'none';
    }
  }
  
  // Shift classes to body instead of appFrame
  document.body.className = modeData.themeClass;
  appFrame.className = 'app-frame';
}

// Dropdown toggle and selection event listeners
const dropdownContainer = document.querySelector('.custom-dropdown-container');
const dropdownTrigger = document.getElementById('dropdown-trigger');
const dropdownOptionsList = document.getElementById('dropdown-options-list');

if (dropdownTrigger && dropdownOptionsList) {
  dropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownContainer.classList.toggle('open');
    dropdownOptionsList.classList.toggle('hidden');
  });

  // Handle option selection
  const optionItems = document.querySelectorAll('.dropdown-option-item');
  optionItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectedMode = item.dataset.mode;
      selectMode(selectedMode);
      dropdownContainer.classList.remove('open');
      dropdownOptionsList.classList.add('hidden');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (dropdownContainer && !dropdownContainer.contains(e.target)) {
      dropdownContainer.classList.remove('open');
      dropdownOptionsList.classList.add('hidden');
    }
  });
}

// Settings menu toggle
btnAppSettings.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsMenu.classList.toggle('hidden');
});

// Close menu when clicking anywhere else
document.addEventListener('click', (e) => {
  if (!settingsMenu.classList.contains('hidden') && !settingsMenu.contains(e.target) && e.target !== btnAppSettings) {
    settingsMenu.classList.add('hidden');
  }
});

// About option
document.getElementById('btn-settings-about').addEventListener('click', () => {
  settingsMenu.classList.add('hidden');
  document.getElementById('about-screen-title').textContent = STRINGS.ABOUT_TITLE || "About";
  document.getElementById('about-content').innerHTML = STRINGS.ABOUT_TEXT || "";
  showScreen('about');
});

// End Game option
document.getElementById('btn-settings-end-game').addEventListener('click', () => {
  if (confirm("Are you sure you want to quit the current game?")) {
    settingsMenu.classList.add('hidden');
    selectMode('MODE_ONE_EXPERT');
    showScreen('home');
  }
});

// Reload Page option
document.getElementById('btn-settings-reload').addEventListener('click', () => {
  window.location.reload();
});

// Break Cache option
document.getElementById('btn-settings-break-cache').addEventListener('click', () => {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('cb', Date.now());
  window.location.href = currentUrl.toString();
});

// Close Menu option
document.getElementById('btn-settings-close-menu').addEventListener('click', () => {
  settingsMenu.classList.add('hidden');
});

document.getElementById('btn-home-about').addEventListener('click', () => {
  document.getElementById('about-screen-title').textContent = STRINGS.ABOUT_TITLE || "About";
  document.getElementById('about-content').innerHTML = STRINGS.ABOUT_TEXT || "";
  showScreen('about');
});

document.getElementById('btn-about-close').addEventListener('click', () => {
  showScreen(currentScreen);
});

// ==========================================
// 1. HOME & HOW TO PLAY
// ==========================================
document.getElementById('btn-home-start').addEventListener('click', () => {
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
  state.keepRoles = false;
  state.wolvesSurvivedTurns = 0;
  state.wolvesGuessedWord = false;
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
  const sheepCount = state.playerCount - (state.rolesConfig.SHEPHERD || 0) - (state.rolesConfig.WOLF || 0) - (state.rolesConfig.SHEEPDOG || 0) - (state.rolesConfig.SECRET_SHEEPDOG || 0);
  const sheepDisplay = document.getElementById('sheep-count-display');
  if (sheepDisplay) sheepDisplay.textContent = Math.max(0, sheepCount);

  document.getElementById('wolf-count-display').textContent = state.rolesConfig.WOLF;
  document.getElementById('sheepdog-count-display').textContent = state.rolesConfig.SHEEPDOG;
  document.getElementById('secretsheepdog-count-display').textContent = state.rolesConfig.SECRET_SHEEPDOG;
}

function initSetupRoles() {
  const modeData = STRINGS.MODES[state.selectedGame];
  
  // Decouple role descriptions dynamically from the current game mode config strings
  const sheepDesc = document.querySelector('#setup-row-sheep .role-desc');
  const shepherdDesc = document.querySelector('#setup-row-shepherd .role-desc');
  const wolfDesc = document.querySelector('#setup-row-wolf .role-desc');
  const sheepdogDesc = document.querySelector('#setup-row-sheepdog .role-desc');
  const secretSheepdogDesc = document.querySelector('#setup-row-secret-sheepdog .role-desc');

  if (sheepDesc) sheepDesc.textContent = modeData.roles.FLOCK ? (modeData.roles.FLOCK.setupDesc || "") : "";
  if (shepherdDesc) shepherdDesc.textContent = modeData.roles.SHEPHERD ? (modeData.roles.SHEPHERD.setupDesc || "") : "";
  if (wolfDesc) wolfDesc.textContent = modeData.roles.WOLF ? (modeData.roles.WOLF.setupDesc || "") : "";
  if (sheepdogDesc) sheepdogDesc.textContent = modeData.roles.SHEEPDOG ? (modeData.roles.SHEEPDOG.setupDesc || "") : "";
  if (secretSheepdogDesc) secretSheepdogDesc.textContent = modeData.roles.SECRET_SHEEPDOG ? (modeData.roles.SECRET_SHEEPDOG.setupDesc || "") : "";

  if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
    document.getElementById('setup-row-shepherd').style.display = 'none';
    document.getElementById('setup-row-secret-sheepdog').style.display = 'flex';
    document.getElementById('btn-sheepdog-minus').style.visibility = 'hidden';
    document.getElementById('btn-sheepdog-plus').style.visibility = 'hidden';
    
    state.rolesConfig.SHEPHERD = 0;
    state.rolesConfig.SHEEPDOG = 1;

    let w = 1;
    for (let testW = Math.max(1, state.playerCount - 1); testW >= 1; testW--) {
      const h = state.playerCount - testW;
      if (testW <= Math.floor(h / 5)) {
        w = testW;
        break;
      }
    }
    state.rolesConfig.WOLF = w;
  } else {
    document.getElementById('setup-row-shepherd').style.display = 'flex';
    document.getElementById('setup-row-secret-sheepdog').style.display = 'flex';
    document.getElementById('btn-sheepdog-minus').style.visibility = 'visible';
    document.getElementById('btn-sheepdog-plus').style.visibility = 'visible';

    // Set default role amounts
    state.rolesConfig.SHEPHERD = 1;
    state.rolesConfig.SHEEPDOG = 1;
    state.rolesConfig.SECRET_SHEEPDOG = 0;

    // Calculate default wolf count: 1 Wolf for every 5 Sheep and/or Sheepdog
    let w = 1;
    for (let testW = Math.max(1, state.playerCount - 2); testW >= 1; testW--) {
      const h = state.playerCount - 1 - testW;
      if (testW <= Math.floor(h / 5)) {
        w = testW;
        break;
      }
    }
    state.rolesConfig.WOLF = w;
  }

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

  // 2. Assign Roles (Fully Randomized from non-Shepherds)
  const shepherdPlayer = state.players[state.shepherdIndex];
  if (!state.keepRoles) {
    state.roles = {};
    
    if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
      state.roles[shepherdPlayer] = 'SHEEPDOG';
    } else {
      state.roles[shepherdPlayer] = 'SHEPHERD';
    }
    
    // Shuffled pool of all players who are not the Shepherd
    const pool = state.players.filter(p => p !== shepherdPlayer);
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }


    let pIdx = 0;
    // Sequentially allocate from the shuffled pool
    const numPoolSheepdogs = state.selectedGame === 'MODE_GROUP_GUESSERS' ? 0 : state.rolesConfig.SHEEPDOG;
    for (let i = 0; i < numPoolSheepdogs; i++) {
      if (pIdx < pool.length) state.roles[pool[pIdx++]] = 'SHEEPDOG';
    }
    for (let i = 0; i < state.rolesConfig.WOLF; i++) {
      if (pIdx < pool.length) state.roles[pool[pIdx++]] = 'WOLF';
    }
    for (let i = 0; i < state.rolesConfig.SECRET_SHEEPDOG; i++) {
      if (pIdx < pool.length) state.roles[pool[pIdx++]] = 'SECRET_SHEEPDOG';
    }
    while (pIdx < pool.length) {
      state.roles[pool[pIdx++]] = 'FLOCK';
    }
  }

  // 3. Create Pass and Play Handoff Sequence
  state.passSequence = [];
  state.passSequence.push(shepherdPlayer);
  

  // Add all other players in circle order starting from Shepherd index
  for (let i = 0; i < state.players.length; i++) {
    const p = state.players[(state.shepherdIndex + i) % state.players.length];
    if (!state.passSequence.includes(p)) {
      state.passSequence.push(p);
    }
  }

  // 4. Reset Round State
  state.triesLeft = 3;
  state.wordGuessedCorrectly = false;
  state.wolvesFoundInput = 0;
  state.wolvesGuessedWord = false;
  
  state.passIndex = 0;
  showHandToScreen();
}

// ==========================================
// 5. PASS & PLAY / PLANNING
// ==========================================
function showHandToScreen() {
  const activePlayer = state.passSequence[state.passIndex];
  const roleKey = state.roles[activePlayer];
  document.getElementById('hand-to-player-name').textContent = activePlayer;
  
  // Button says "I'm [Player Name]" instead of a role name (Feedback 9)
  document.getElementById('btn-hand-to-ready').textContent = `I'm ${activePlayer}`;
  
  const imgEl = screens.handTo.querySelector('.pass-phone-img');
  if (state.passIndex === 0 && roleKey === 'SHEEPDOG') {
    imgEl.src = 'assets/pass_to_sheepdog.png?v=2';
    imgEl.classList.add('sheepdog-img');
  } else {
    imgEl.src = 'assets/pass_the_phone.png?v=2';
    imgEl.classList.remove('sheepdog-img');
  }
  
  showScreen('handTo');
}

document.getElementById('btn-hand-to-ready').addEventListener('click', () => {
  initPlanningScreen();
});

function initPlanningScreen() {
  const activePlayer = state.passSequence[state.passIndex];
  const roleKey = state.roles[activePlayer];
  const roleConfig = STRINGS.MODES[state.selectedGame].roles[roleKey];
  
  // Planning Title is generic "YOU ARE PLAYING" in index.html now (Feedback 15)
  // Construct the role description + secret word string to show inside the box (Feedback 11/13)
  let knowsWord = false;
  if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
    knowsWord = (roleKey === 'FLOCK' || roleKey === 'SHEEPDOG' || roleKey === 'SECRET_SHEEPDOG');
  } else {
    knowsWord = (roleKey === 'SHEPHERD' || roleKey === 'WOLF');
  }
  
  let revealText = `${roleConfig.desc}`;
  if (knowsWord) {
    revealText += ` ${state.secretWord}`;
  }
  
  document.getElementById('secret-word-display').textContent = revealText;
  
  // All planning screens show the box now (Feedback 13)
  document.getElementById('secret-word-box').style.display = 'flex';
  
  const box = document.getElementById('secret-word-box');
  if (box && typeof box.resetLock === 'function') {
    box.resetLock();
  }
  
  showScreen('planning');
}

// Hold to reveal logic
function setupSecretWordBox(boxId, revealId, holdId, buttonId, originalText, holdTimeMs) {
  const box = document.getElementById(boxId);
  const reveal = document.getElementById(revealId);
  const hold = document.getElementById(holdId);
  const btn = document.getElementById(buttonId);
  
  let holdTimer = null;
  let hasUnlocked = false;

  box.resetLock = () => {
    hasUnlocked = false;
    if (holdTimer) clearTimeout(holdTimer);
    btn.disabled = true;
    btn.classList.add('btn-filling');
    btn.classList.remove('active-fill');
    btn.style.removeProperty('transition');
    btn.textContent = "view your secret above";
  };

  const show = (e) => {
    e.preventDefault();
    hold.classList.add('hidden');
    reveal.classList.remove('hidden');
    
    if (!hasUnlocked) {
      // Set transition duration dynamically in inline styles with !important to match holdTimeMs
      btn.style.setProperty('transition', `background-position ${holdTimeMs / 1000}s linear`, 'important');
      btn.classList.add('active-fill');
      if (holdTimer) clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        hasUnlocked = true;
        btn.classList.remove('btn-filling', 'active-fill');
        btn.style.removeProperty('transition');
        btn.disabled = false;
        btn.textContent = originalText;
      }, holdTimeMs);
    }
  };
  
  const hide = (e) => {
    e.preventDefault();
    hold.classList.remove('hidden');
    reveal.classList.add('hidden');
    
    if (!hasUnlocked) {
      // Reset transition instantly to 0% fill
      btn.style.setProperty('transition', 'none', 'important');
      btn.classList.remove('active-fill');
      if (holdTimer) clearTimeout(holdTimer);
    }
  };
  
  box.addEventListener('mousedown', show);
  box.addEventListener('touchstart', show);
  box.addEventListener('mouseup', hide);
  box.addEventListener('touchend', hide);
  box.addEventListener('mouseleave', hide);
}

setupSecretWordBox('secret-word-box', 'secret-word-reveal-content', 'secret-word-hold-content', 'btn-planning-next', 'PRESS & PASS THE PHONE', 1000);
setupSecretWordBox('main-secret-word-box', 'main-secret-word-reveal-content', 'main-secret-word-hold-content', 'btn-main-play-vote', "Let's Vote", 2000);

document.getElementById('btn-planning-next').addEventListener('click', () => {
  state.passIndex++;
  if (state.passIndex < state.passSequence.length) {
    showHandToScreen();
  } else {
    showHandBackShepherdScreen();
  }
});

function showHandBackShepherdScreen() {
  const shepherdPlayer = state.players[state.shepherdIndex];
  document.getElementById('hand-back-shepherd-name').textContent = shepherdPlayer;

  const imgEl = screens.handBackShepherd.querySelector('.pass-phone-img');
  const btnEl = document.getElementById('btn-hand-back-shepherd-ready');
  const titleEl = screens.handBackShepherd.querySelector('.screen-title');

  if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
    titleEl.textContent = "ROUND READY!";
    imgEl.src = 'assets/pass_to_sheepdog.png?v=2';
    imgEl.classList.add('sheepdog-img');
    btnEl.textContent = "I'M THE SHEEPDOG";
  } else {
    titleEl.textContent = "ROUND READY!";
    imgEl.src = 'assets/pass_to_shepherd.png?v=2';
    imgEl.classList.remove('sheepdog-img');
    btnEl.textContent = "I'M THE SHEPHERD";
  }

  showScreen('handBackShepherd');
}

document.getElementById('btn-hand-back-shepherd-ready').addEventListener('click', () => {
  if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
    initVoteWolvesGroup();
  } else {
    initVoteWord();
  }
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

  const mainIllustrationImg = screens.mainPlay.querySelector('.mode-illustration-img');
  if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
    mainIllustrationImg.src = 'assets/pass_to_sheepdog.png?v=2';
  } else {
    mainIllustrationImg.src = 'assets/mode_ask_the_expert.png?v=2';
  }

  const mainBox = document.getElementById('main-secret-word-box');
  if (mainBox && typeof mainBox.resetLock === 'function') {
    mainBox.resetLock();
  }

  showScreen('mainPlay');
}

document.getElementById('btn-main-play-vote').addEventListener('click', () => {
  if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
    initVoteWolvesGroup();
  } else {
    initVoteWord();
  }
});

// ==========================================
// 7. VOTING & RESOLUTION (SCREENS 10A & 10B)
// ==========================================
function initVoteWord() {
  const modeData = STRINGS.MODES[state.selectedGame];
  document.getElementById('vote-word-title').textContent = modeData.vote_word_title || "GUESS THE WORD";
  document.getElementById('vote-word-desc').textContent = modeData.vote_word_desc || "";
  
  // Update tries left text subtitle based on tries left config
  const subtitleEl = document.getElementById('vote-word-tries-subtitle');
  if (state.triesLeft >= 2) {
    let text = modeData.vote_word_tries_left || "The team has # tries left.";
    text = text.replace('#', state.triesLeft);
    subtitleEl.textContent = text;
  } else if (state.triesLeft === 1) {
    subtitleEl.textContent = modeData.vote_word_last_try || "This is the last try!";
  } else {
    subtitleEl.textContent = "";
  }
  
  // Update wrong button text based on remaining tries
  const wrongBtn = document.getElementById('btn-vote-word-wrong');
  if (state.triesLeft > 1) {
    wrongBtn.textContent = "WRONG (try again)";
  } else {
    wrongBtn.textContent = "WRONG (team loses)";
  }
  
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
      // Start another round of Pass the Phone starting with the player right after the Shepherd
      state.passIndex = 1;
      showHandToScreen();
    } else {
      // 0 tries left, force transition to finding wolves
      initVoteWolves();
    }
  }
});

document.getElementById('btn-vote-word-cancel').addEventListener('click', () => {
  if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
    showScreen('mainPlay');
  } else {
    showHandBackShepherdScreen();
  }
});

function initVoteWolves() {
  const modeData = STRINGS.MODES[state.selectedGame];
  document.getElementById('vote-wolves-title').textContent = modeData.vote_wolves_title || "FIND THE WOLVES";
  
  // Accuse # players of being wolves description
  let desc = modeData.vote_wolves_desc || "Accuse # players of being wolves. The Sheepdog should help them finalize their guess.";
  desc = desc.replace('#', state.rolesConfig.WOLF);
  document.getElementById('vote-wolves-desc').textContent = desc;

  // Add Secret Sheepdogs warning string dynamically if present
  const secSheepdogs = state.rolesConfig.SECRET_SHEEPDOG || 0;
  const wolvesInfoEl = document.getElementById('vote-wolves-secret-sheepdogs-info');
  if (secSheepdogs >= 1) {
    const totalAccuse = state.rolesConfig.WOLF + secSheepdogs;
    wolvesInfoEl.textContent = `There are ${secSheepdogs} Secret Sheepdog${secSheepdogs === 1 ? '' : 's'} in the team! You may accuse and test a total of ${totalAccuse} players of being wolves.`;
    wolvesInfoEl.style.display = 'block';
  } else {
    wolvesInfoEl.style.display = 'none';
  }
  
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
// 7B. VOTING FOR FOLLOW THE FLOCK
// ==========================================
function initVoteWolvesGroup() {
  const wolfCount = state.rolesConfig.WOLF;
  document.getElementById('vote-wolves-group-desc').textContent = `Decide as a group on ${wolfCount} ${wolfCount === 1 ? 'player who is a wolf' : 'players who are wolves'}. The Sheepdog calls for the final vote.`;

  // Add Secret Sheepdogs warning string dynamically if present for Follow the Flock
  const secSheepdogs = state.rolesConfig.SECRET_SHEEPDOG || 0;
  const wolvesInfoEl = document.getElementById('vote-wolves-group-secret-sheepdogs-info');
  if (secSheepdogs >= 1) {
    const totalAccuse = state.rolesConfig.WOLF + secSheepdogs;
    wolvesInfoEl.textContent = `There are ${secSheepdogs} Secret Sheepdog${secSheepdogs === 1 ? '' : 's'} in the team! You may accuse and test a total of ${totalAccuse} players of being wolves.`;
    wolvesInfoEl.style.display = 'block';
  } else {
    wolvesInfoEl.style.display = 'none';
  }

  state.wolvesFoundInput = 0; // Reset to 0, centered
  updateVoteWolvesGroupUI();
  showScreen('voteWolvesGroup');
}

function updateVoteWolvesGroupUI() {
  document.getElementById('vote-wolves-group-display').textContent = state.wolvesFoundInput;
}

document.getElementById('btn-vote-wolves-group-plus').addEventListener('click', () => {
  if (state.wolvesFoundInput < state.rolesConfig.WOLF) {
    state.wolvesFoundInput++;
    updateVoteWolvesGroupUI();
  }
});

document.getElementById('btn-vote-wolves-group-minus').addEventListener('click', () => {
  if (state.wolvesFoundInput > 0) {
    state.wolvesFoundInput--;
    updateVoteWolvesGroupUI();
  }
});

document.getElementById('btn-vote-wolves-group-continue').addEventListener('click', () => {
  state.wordGuessedCorrectly = (state.wolvesFoundInput === state.rolesConfig.WOLF);
  initWolfGuess();
});

document.getElementById('btn-vote-wolves-group-back').addEventListener('click', () => {
  showHandBackShepherdScreen();
});

// ==========================================
// 7C. WOLVES GUESS THE WORD
// ==========================================
function initWolfGuess() {
  document.getElementById('checkbox-wolves-guessed').checked = false;
  showScreen('wolfGuess');
}

document.getElementById('btn-wolf-guess-back').addEventListener('click', () => {
  initVoteWolvesGroup();
});

document.getElementById('btn-wolf-guess-continue').addEventListener('click', () => {
  state.wolvesGuessedWord = document.getElementById('checkbox-wolves-guessed').checked;
  state.wolvesSurvivedTurns = 0;
  state.keepRoles = false;
  calculateScores();
  initScoreboard();
});

// ==========================================
// 8. SCORING & SCOREBOARD
// ==========================================
function calculateScores() {
  if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
    const scoresConfig = STRINGS.MODES.MODE_GROUP_GUESSERS.SCORING;
    state.players.forEach(p => {
      const role = state.roles[p];
      // Flock gets points if they found the wolves
      if (state.wordGuessedCorrectly) {
        if (role !== 'WOLF') {
          globalScores[p] += scoresConfig.MODE_GROUP_GUESSERS_WOLF_FOUND;
        }
        if (role === 'SHEEPDOG') {
          globalScores[p] += scoresConfig.MODE_GROUP_GUESSERS_SHEEPDOG_EXTRA;
        }
      }
      // Wolves get points if flock failed to find them, OR if wolves guessed the word
      if (!state.wordGuessedCorrectly || state.wolvesGuessedWord) {
        if (role === 'WOLF') {
          globalScores[p] += scoresConfig.MODE_GROUP_GUESSERS_WOLF_WRONG;
        }
      }
    });
    return;
  }

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

  if (state.selectedGame === 'MODE_GROUP_GUESSERS') {
    if (state.wordGuessedCorrectly) {
      if (role !== 'WOLF') reasons.push("Found the wolf!");
      if (role === 'SHEEPDOG') reasons.push("Led the vote!");
    }
    if (!state.wordGuessedCorrectly) {
      if (role === 'WOLF') reasons.push("Fooled the flock!");
    } else if (state.wolvesGuessedWord) {
      if (role === 'WOLF') reasons.push("Guessed the word!");
    }
    return reasons.join(' ');
  }
  
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
  const flockWonRound = state.selectedGame === 'MODE_GROUP_GUESSERS' ? (state.wordGuessedCorrectly && !state.wolvesGuessedWord) : state.wordGuessedCorrectly;
  if (flockWonRound) {
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
    const flockWonRound = state.selectedGame === 'MODE_GROUP_GUESSERS' ? (state.wordGuessedCorrectly && !state.wolvesGuessedWord) : state.wordGuessedCorrectly;
    const isWin = (isFlockRole === flockWonRound);
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
  state.keepRoles = false;
  state.wolvesSurvivedTurns = 0;
  state.wolvesGuessedWord = false;
  state.shepherdIndex = (state.shepherdIndex + 1) % state.players.length;
  initSetupPlayers();
});

// ==========================================
// DYNAMIC CLOUD WALLPAPER EFFECT
// ==========================================
function initCloudWallpaper() {
  const container = document.getElementById('cloud-wallpaper');
  if (!container) return;

  container.innerHTML = '';

  const count = CLOUD_CONFIG.initialCloudCount || 6;
  const isSheepArray = new Array(count).fill(false);
  let sheepAssigned = 0;
  const maxSheep = CLOUD_CONFIG.maxSheepClouds || 2;
  
  // Randomly distribute sheep indices for initial clouds
  while (sheepAssigned < Math.min(maxSheep, count)) {
    const idx = Math.floor(Math.random() * count);
    if (!isSheepArray[idx]) {
      isSheepArray[idx] = true;
      sheepAssigned++;
    }
  }

  // Pre-populate initial clouds across the screen horizontally
  for (let i = 0; i < count; i++) {
    const initialPercentAcross = (i / count) * 100 + (Math.random() * (100 / count));
    spawnCloud(true, initialPercentAcross, isSheepArray[i]);
  }

  // Set up loop for continuous spawning
  setInterval(() => {
    spawnCloud(false);
  }, CLOUD_CONFIG.spawnIntervalMs);
}

function spawnCloud(isInitial = false, initialPercentAcross = 0, forceSheep = null) {
  const container = document.getElementById('cloud-wallpaper');
  if (!container) return;

  const activeClouds = container.querySelectorAll('.cloud');
  let activeSheepCount = 0;
  activeClouds.forEach(el => {
    if (el.dataset.isSheep === 'true') {
      activeSheepCount++;
    }
  });

  // Determine if this cloud should be a sheep
  let isSheep = false;
  const maxSheep = CLOUD_CONFIG.maxSheepClouds || 2;
  
  if (forceSheep !== null) {
    isSheep = forceSheep;
  } else {
    // If we have fewer than maxSheep active, force a sheep cloud to maintain the count
    if (activeSheepCount < maxSheep) {
      isSheep = true;
    }
  }

  let assetName = 'cloud_normal.png';
  if (isSheep) {
    const sheepAssets = ['cloud_sheep_neutral.png', 'cloud_sheep_happy.png', 'cloud_sheep_derpy.png'];
    assetName = sheepAssets[Math.floor(Math.random() * sheepAssets.length)];
  }

  const cloudEl = document.createElement('img');
  cloudEl.className = 'cloud';
  cloudEl.src = `assets/${assetName}?v=2`;
  cloudEl.dataset.isSheep = isSheep ? 'true' : 'false';

  // Size sizing
  const size = Math.floor(Math.random() * (CLOUD_CONFIG.maxSizePx - CLOUD_CONFIG.minSizePx + 1)) + CLOUD_CONFIG.minSizePx;
  cloudEl.style.width = `${size}px`;
  cloudEl.style.height = 'auto';

  // Vertical boundary positioning (top 2/3rds of viewport)
  const topVal = Math.floor(Math.random() * (CLOUD_CONFIG.maxTopPercent - CLOUD_CONFIG.minTopPercent + 1)) + CLOUD_CONFIG.minTopPercent;
  cloudEl.style.top = `${topVal}%`;

  // Speed configuration (duration of cross)
  const duration = Math.floor(Math.random() * (CLOUD_CONFIG.maxSpeedSec - CLOUD_CONFIG.minSpeedSec + 1)) + CLOUD_CONFIG.minSpeedSec;
  cloudEl.style.animationDuration = `${duration}s`;

  if (isInitial) {
    // Start mid-animation by applying a negative delay
    const delay = -(duration * (initialPercentAcross / 100));
    cloudEl.style.animationDelay = `${delay}s`;
  }

  cloudEl.onerror = () => {
    cloudEl.src = 'assets/cloud_normal.png?v=2';
    cloudEl.onerror = null;
  };

  cloudEl.addEventListener('animationend', () => {
    cloudEl.remove();
  });

  container.appendChild(cloudEl);
}

// Run Init
initApp();
