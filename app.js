import { wordCategories } from './words.js';

// --- GAME STATE ---
const state = {
  selectedGame: null, // 'chameleon' or 'insider'
  players: [],        // Array of player names
  category: null,     // Selected category name
  words: [],          // 16 words for the current grid
  secretWord: '',     // The chosen secret word
  roles: {},          // Map of { playerName: roleName }
  passIndex: 0,       // Current player index during pass-and-play setup
  timerSeconds: 180,  // Round timer remaining (3 mins)
  timerInterval: null,
  votedPlayer: null,  // Player selected during voting
  winner: null        // 'chameleon', 'players', 'insider', or 'none'
};

// --- DOM ELEMENTS ---
const screens = {
  home: document.getElementById('screen-home'),
  setup: document.getElementById('screen-setup'),
  pass: document.getElementById('screen-pass'),
  reveal: document.getElementById('screen-reveal'),
  game: document.getElementById('screen-game'),
  voting: document.getElementById('screen-voting'),
  escape: document.getElementById('screen-escape'),
  results: document.getElementById('screen-results')
};

// --- SCREEN NAVIGATION ROUTER ---
function showScreen(screenKey) {
  Object.keys(screens).forEach(key => {
    if (key === screenKey) {
      screens[key].classList.remove('hidden');
    } else {
      screens[key].classList.add('hidden');
    }
  });
  
  // Custom actions per screen
  if (screenKey === 'home') {
    resetState();
  }
}

function resetState() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  state.selectedGame = null;
  state.category = null;
  state.words = [];
  state.secretWord = '';
  state.roles = {};
  state.passIndex = 0;
  state.timerSeconds = 180;
  state.votedPlayer = null;
  state.winner = null;
}

// Tactile feedback helper for mobile devices
function triggerVibration(pattern) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.warn("Vibrate API not supported or blocked by permissions", e);
    }
  }
}

// --- HOME SCREEN EVENTS ---
document.getElementById('select-game-chameleon').addEventListener('click', () => {
  triggerVibration(50);
  state.selectedGame = 'chameleon';
  initSetupScreen();
});

document.getElementById('select-game-insider').addEventListener('click', () => {
  triggerVibration(50);
  state.selectedGame = 'insider';
  initSetupScreen();
});

// --- SETUP SCREEN LOGIC ---
const playersSetupList = document.getElementById('players-setup-list');
const btnAddPlayer = document.getElementById('btn-add-player');
const categoriesGrid = document.getElementById('categories-grid');

let defaultPlayers = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

function initSetupScreen() {
  document.getElementById('setup-title').textContent = `${state.selectedGame === 'chameleon' ? 'Chameleon' : 'Insider'} Setup`;
  
  // 1. Populate players
  playersSetupList.innerHTML = '';
  const currentPlayers = state.players.length > 0 ? state.players : defaultPlayers;
  currentPlayers.forEach((player, idx) => {
    addPlayerRow(player, idx + 1);
  });
  
  // 2. Populate categories
  categoriesGrid.innerHTML = '';
  
  // Random Category Pill
  const randomPill = document.createElement('div');
  randomPill.className = 'category-pill selected';
  randomPill.textContent = '🎲 Random';
  randomPill.dataset.category = 'Random';
  randomPill.addEventListener('click', selectCategoryPill);
  categoriesGrid.appendChild(randomPill);
  
  // Specific Categories
  Object.keys(wordCategories).forEach(cat => {
    const pill = document.createElement('div');
    pill.className = 'category-pill';
    pill.textContent = cat;
    pill.dataset.category = cat;
    pill.addEventListener('click', selectCategoryPill);
    categoriesGrid.appendChild(pill);
  });
  
  state.category = 'Random';
  
  showScreen('setup');
}

function addPlayerRow(name = '', index) {
  const row = document.createElement('div');
  row.className = 'player-input-row';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'input-control';
  input.placeholder = `Player ${index}`;
  input.value = name;
  input.setAttribute('aria-label', `Player ${index} name`);
  
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove-player';
  removeBtn.innerHTML = '✕';
  removeBtn.setAttribute('aria-label', 'Remove player');
  removeBtn.addEventListener('click', () => {
    triggerVibration(30);
    row.remove();
    updatePlayerInputPlaceholders();
  });
  
  row.appendChild(input);
  row.appendChild(removeBtn);
  playersSetupList.appendChild(row);
}

function updatePlayerInputPlaceholders() {
  const rows = playersSetupList.querySelectorAll('.player-input-row');
  rows.forEach((row, idx) => {
    const input = row.querySelector('.input-control');
    input.placeholder = `Player ${idx + 1}`;
    input.setAttribute('aria-label', `Player ${idx + 1} name`);
  });
}

function selectCategoryPill(e) {
  triggerVibration(30);
  const pills = categoriesGrid.querySelectorAll('.category-pill');
  pills.forEach(p => p.classList.remove('selected'));
  e.currentTarget.classList.add('selected');
  state.category = e.currentTarget.dataset.category;
}

// Add player event
btnAddPlayer.addEventListener('click', () => {
  triggerVibration(40);
  const currentCount = playersSetupList.querySelectorAll('.player-input-row').length;
  if (currentCount < 10) {
    addPlayerRow('', currentCount + 1);
    // Scroll to bottom
    playersSetupList.scrollTop = playersSetupList.scrollHeight;
  } else {
    alert("Maximum 10 players supported.");
  }
});

// Back from Setup
document.getElementById('btn-setup-back').addEventListener('click', () => {
  triggerVibration(40);
  showScreen('home');
});

// Start Setup (Initialize game data, prepare roles, start pass & play loop)
document.getElementById('btn-setup-start').addEventListener('click', () => {
  triggerVibration(50);
  
  // Collect player names
  const playerInputs = playersSetupList.querySelectorAll('.player-input-row input');
  const tempPlayers = Array.from(playerInputs).map((input, idx) => {
    return input.value.trim() !== '' ? input.value.trim() : `Player ${idx + 1}`;
  });
  
  const minPlayers = 3;
  if (tempPlayers.length < minPlayers) {
    alert(`Please add at least ${minPlayers} players to play.`);
    return;
  }
  
  state.players = tempPlayers;
  
  // Choose Category
  let activeCategory = state.category;
  if (activeCategory === 'Random') {
    const categoriesKeys = Object.keys(wordCategories);
    activeCategory = categoriesKeys[Math.floor(Math.random() * categoriesKeys.length)];
  }
  
  // Set up words
  const fullWordList = wordCategories[activeCategory];
  state.words = [...fullWordList]; // Copy the 16 words
  
  // Pick secret word
  state.secretWord = state.words[Math.floor(Math.random() * state.words.length)];
  
  // Assign Roles
  state.roles = {};
  const randIdx = Math.floor(Math.random() * state.players.length);
  
  if (state.selectedGame === 'chameleon') {
    state.players.forEach((player, idx) => {
      state.roles[player] = (idx === randIdx) ? 'chameleon' : 'player';
    });
  } else if (state.selectedGame === 'insider') {
    state.players.forEach((player, idx) => {
      state.roles[player] = (idx === randIdx) ? 'insider' : 'player';
    });
  }
  
  // Store category for display
  state.actualCategory = activeCategory;
  
  // Start Pass & Play Loop
  state.passIndex = 0;
  startPassPlayerTurn();
});

// --- PASS & PLAY LOOP ---
const passPlayerTarget = document.getElementById('pass-player-target');
const btnPassReady = document.getElementById('btn-pass-ready');

function startPassPlayerTurn() {
  const activePlayer = state.players[state.passIndex];
  passPlayerTarget.textContent = activePlayer;
  showScreen('pass');
}

btnPassReady.addEventListener('click', () => {
  triggerVibration(50);
  initRevealScreen();
});

// --- REVEAL SCREEN LOGIC ---
const btnHoldReveal = document.getElementById('btn-hold-reveal');
const revealSecretContent = document.getElementById('reveal-secret-content');
const revealTapHoldContainer = document.getElementById('reveal-tap-hold-container');
const revealRoleDisplay = document.getElementById('reveal-role-display');
const revealSecretWord = document.getElementById('reveal-secret-word');
const revealCategoryName = document.getElementById('reveal-category-name');
const btnRevealDone = document.getElementById('btn-reveal-done');

const revealSecretWordSection = document.getElementById('reveal-secret-word-section');
const revealCategorySection = document.getElementById('reveal-category-section');
const revealGridSection = document.getElementById('reveal-grid-section');
const revealWordGrid = document.getElementById('reveal-word-grid');

function initRevealScreen() {
  const activePlayer = state.players[state.passIndex];
  const role = state.roles[activePlayer];
  
  document.getElementById('reveal-player-name').textContent = activePlayer;
  document.getElementById('reveal-player-name-active').textContent = activePlayer;
  
  // Reset visibility
  revealSecretContent.classList.add('hidden');
  revealTapHoldContainer.classList.remove('hidden');
  
  // Setup role descriptions
  revealRoleDisplay.className = 'reveal-role';
  
  if (state.selectedGame === 'chameleon') {
    revealCategorySection.classList.remove('hidden');
    revealCategoryName.textContent = state.actualCategory;
    revealGridSection.classList.remove('hidden');
    
    // Render the grid for reference
    renderGrid(revealWordGrid, state.words, state.secretWord, role === 'chameleon');
    
    if (role === 'chameleon') {
      revealRoleDisplay.textContent = 'THE CHAMELEON';
      revealRoleDisplay.classList.add('role-chameleon');
      revealSecretWordSection.classList.add('hidden'); // Chameleon doesn't know the word!
    } else {
      revealRoleDisplay.textContent = 'PLAYER';
      revealRoleDisplay.classList.add('role-player');
      revealSecretWordSection.classList.remove('hidden');
      revealSecretWord.textContent = state.secretWord;
    }
  } else if (state.selectedGame === 'insider') {
    revealCategorySection.classList.add('hidden');
    revealGridSection.classList.add('hidden');
    
    if (role === 'insider') {
      revealRoleDisplay.textContent = 'THE INSIDER';
      revealRoleDisplay.classList.add('role-insider');
      revealSecretWordSection.classList.remove('hidden');
      revealSecretWord.textContent = state.secretWord;
    } else {
      revealRoleDisplay.textContent = 'PLAYER';
      revealRoleDisplay.classList.add('role-player');
      revealSecretWordSection.classList.add('hidden'); // Players don't know the word!
    }
  }
  
  showScreen('reveal');
}

// Function to render the 4x4 grid of words
function renderGrid(gridElement, wordsArray, secretWordText, hideHighlight = false) {
  gridElement.innerHTML = '';
  wordsArray.forEach(word => {
    const cell = document.createElement('div');
    cell.className = 'grid-word';
    cell.textContent = word;
    if (!hideHighlight && word === secretWordText) {
      cell.classList.add('highlighted-secret');
    }
    gridElement.appendChild(cell);
  });
}

// Hold interaction handlers (Supports touch and mouse)
function handleRevealStart(e) {
  e.preventDefault(); // Prevent text selection/zooming on mobile
  triggerVibration(30);
  revealTapHoldContainer.classList.add('hidden');
  revealSecretContent.classList.remove('hidden');
}

function handleRevealEnd(e) {
  // If they let go, we let them read it but keep the "Got It" button to progress
  // This avoids frustration on sticky touch devices where hold breaks easily.
}

btnHoldReveal.addEventListener('mousedown', handleRevealStart);
btnHoldReveal.addEventListener('touchstart', handleRevealStart);

btnHoldReveal.addEventListener('mouseup', handleRevealEnd);
btnHoldReveal.addEventListener('touchend', handleRevealEnd);
btnHoldReveal.addEventListener('mouseleave', handleRevealEnd);

// Finished viewing secret
btnRevealDone.addEventListener('click', () => {
  triggerVibration(50);
  
  state.passIndex++;
  if (state.passIndex < state.players.length) {
    startPassPlayerTurn();
  } else {
    // All players have viewed secrets, go to actual gameplay screen!
    startActiveGame();
  }
});

// --- ACTIVE GAMEPLAY SCREEN ---
const gameActiveTitle = document.getElementById('game-active-title');
const gameTimerText = document.getElementById('game-timer-text');
const gameTimerCircle = document.getElementById('game-timer-circle');
const gameChameleonView = document.getElementById('game-chameleon-view');
const gameInsiderView = document.getElementById('game-insider-view');
const gameWordGrid = document.getElementById('game-word-grid');
const gameCategoryDisplay = document.getElementById('game-category-display');

const btnInsiderRevealWord = document.getElementById('btn-insider-reveal-word');
const insiderPeekOverlay = document.getElementById('insider-peek-overlay');
const gameInsiderSecretWord = document.getElementById('game-insider-secret-word');
const gameInsiderCategory = document.getElementById('game-insider-category');

function startActiveGame() {
  gameActiveTitle.textContent = `${state.selectedGame === 'chameleon' ? 'Chameleon' : 'Insider'} Round`;
  
  // Timer Setup (3 mins = 180s)
  state.timerSeconds = 180;
  updateTimerUI();
  
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    updateTimerUI();
    
    if (state.timerSeconds <= 0) {
      clearInterval(state.timerInterval);
      triggerVibration([300, 100, 300]);
      handleTimerTimeout();
    }
  }, 1000);
  
  // View specific setups
  if (state.selectedGame === 'chameleon') {
    gameChameleonView.classList.remove('hidden');
    gameInsiderView.classList.add('hidden');
    
    gameCategoryDisplay.textContent = state.actualCategory;
    // Hide highlights on the main game board so no one can peek at the answer!
    renderGrid(gameWordGrid, state.words, state.secretWord, true);
    
  } else if (state.selectedGame === 'insider') {
    gameChameleonView.classList.add('hidden');
    gameInsiderView.classList.remove('hidden');
    insiderPeekOverlay.classList.add('hidden');
    
    // Inject texts for the peek window
    gameInsiderSecretWord.textContent = state.secretWord;
    gameInsiderCategory.textContent = state.actualCategory;
  }
  
  showScreen('game');
}

function updateTimerUI() {
  const mins = Math.floor(state.timerSeconds / 60);
  const secs = state.timerSeconds % 60;
  gameTimerText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  
  // Warning at 30 seconds
  if (state.timerSeconds <= 30) {
    gameTimerCircle.className = 'timer-circle warning';
  } else {
    gameTimerCircle.className = 'timer-circle active';
  }
}

// Timeout handler
function handleTimerTimeout() {
  if (state.selectedGame === 'chameleon') {
    alert("Time's up! Transitioning to voting phase.");
    startVotingPhase();
  } else if (state.selectedGame === 'insider') {
    // In Insider, running out of time is an automatic defeat
    state.winner = 'none';
    showResultsScreen();
  }
}

// Insider Peek hold handlers
function showInsiderPeek(e) {
  e.preventDefault();
  triggerVibration(30);
  insiderPeekOverlay.classList.remove('hidden');
}
function hideInsiderPeek() {
  insiderPeekOverlay.classList.add('hidden');
}

btnInsiderRevealWord.addEventListener('mousedown', showInsiderPeek);
btnInsiderRevealWord.addEventListener('touchstart', showInsiderPeek);

btnInsiderRevealWord.addEventListener('mouseup', hideInsiderPeek);
btnInsiderRevealWord.addEventListener('touchend', hideInsiderPeek);
btnInsiderRevealWord.addEventListener('mouseleave', hideInsiderPeek);

// Move to Voting Screen manually
document.getElementById('btn-game-to-voting').addEventListener('click', () => {
  triggerVibration(50);
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
  }
  startVotingPhase();
});

// --- VOTING SCREEN ---
const votingTitle = document.getElementById('voting-title');
const votingDesc = document.getElementById('voting-desc');
const votingPlayersList = document.getElementById('voting-players-list');
const votingInsiderQuestion = document.getElementById('voting-insider-question');
const votingPlayersSection = document.getElementById('voting-players-section');

function startVotingPhase() {
  votingPlayersSection.classList.remove('hidden');
  votingInsiderQuestion.classList.add('hidden');
  
  if (state.selectedGame === 'chameleon') {
    votingTitle.textContent = "Vote on the Chameleon!";
    votingDesc.textContent = "Discuss who seemed suspicious during the round. Select the player you believe is the Chameleon.";
    renderVotingPlayersList();
  } else if (state.selectedGame === 'insider') {
    votingTitle.textContent = "Did we guess it?";
    votingDesc.textContent = "First, confirm if your group successfully guessed the secret word before the timer was stopped.";
    
    votingInsiderQuestion.classList.remove('hidden');
    votingPlayersSection.classList.add('hidden'); // Hide until yes is pressed
  }
  
  showScreen('voting');
}

// Insider voting path
document.getElementById('btn-voting-insider-failed').addEventListener('click', () => {
  triggerVibration([100, 50, 100]);
  // Failed to guess -> Everyone loses
  state.winner = 'none';
  showResultsScreen();
});

document.getElementById('btn-voting-insider-success').addEventListener('click', () => {
  triggerVibration(50);
  votingInsiderQuestion.classList.add('hidden');
  votingPlayersSection.classList.remove('hidden');
  
  votingTitle.textContent = "Vote on the Insider!";
  votingDesc.textContent = "The word was guessed! Now, discuss who the secret Insider might be and select them.";
  renderVotingPlayersList();
});

function renderVotingPlayersList() {
  votingPlayersList.innerHTML = '';
  state.players.forEach(player => {
    const btn = document.createElement('button');
    btn.className = 'voting-option-btn';
    btn.innerHTML = `<span>${player}</span> <span>➔</span>`;
    btn.addEventListener('click', () => {
      triggerVibration(50);
      handlePlayerVote(player);
    });
    votingPlayersList.appendChild(btn);
  });
}

function handlePlayerVote(votedName) {
  state.votedPlayer = votedName;
  const role = state.roles[votedName];
  
  if (state.selectedGame === 'chameleon') {
    if (role === 'chameleon') {
      // Chameleon was caught! They get to guess the secret word.
      startEscapePhase();
    } else {
      // Chameleon was NOT caught! Chameleon wins
      state.winner = 'chameleon';
      showResultsScreen();
    }
  } else if (state.selectedGame === 'insider') {
    if (role === 'insider') {
      // Insider was caught! Common players win
      state.winner = 'players';
    } else {
      // Insider escaped! Insider wins
      state.winner = 'insider';
    }
    showResultsScreen();
  }
}

// --- CHAMELEON ESCAPE SCREEN ---
const escapeChameleonName = document.getElementById('escape-chameleon-name');
const escapeWordGrid = document.getElementById('escape-word-grid');
const escapeCategoryDisplay = document.getElementById('escape-category-display');

function startEscapePhase() {
  const chameleonName = state.players.find(p => state.roles[p] === 'chameleon');
  escapeChameleonName.textContent = chameleonName;
  escapeCategoryDisplay.textContent = state.actualCategory;
  
  // Render clickable grid of words
  escapeWordGrid.innerHTML = '';
  state.words.forEach(word => {
    const btn = document.createElement('button');
    btn.className = 'voting-option-btn';
    btn.style.padding = '8px';
    btn.style.fontSize = '0.9rem';
    btn.style.textAlign = 'center';
    btn.style.justifyContent = 'center';
    btn.textContent = word;
    btn.addEventListener('click', () => {
      triggerVibration(50);
      handleEscapeGuess(word);
    });
    escapeWordGrid.appendChild(btn);
  });
  
  showScreen('escape');
}

function handleEscapeGuess(guessedWord) {
  if (guessedWord === state.secretWord) {
    // Chameleon guessed correctly! Chameleon wins
    state.winner = 'chameleon';
  } else {
    // Chameleon failed to guess! Players win
    state.winner = 'players';
  }
  showResultsScreen();
}

// --- RESULTS DISPLAY ---
const resultsOutcome = document.getElementById('results-outcome');
const resultsDetails = document.getElementById('results-details');
const resultsRolesList = document.getElementById('results-roles-list');

function showResultsScreen() {
  resultsRolesList.innerHTML = '';
  
  // Append roles breakdown
  state.players.forEach(p => {
    const li = document.createElement('li');
    const role = state.roles[p];
    let roleText = 'Common Player';
    let roleClass = 'role-player';
    
    if (role === 'chameleon') {
      roleText = 'Chameleon';
      roleClass = 'role-chameleon';
    } else if (role === 'insider') {
      roleText = 'Insider';
      roleClass = 'role-insider';
    }
    
    li.innerHTML = `${p}: <span class="${roleClass}" style="font-weight:600;">${roleText}</span>`;
    resultsRolesList.appendChild(li);
  });
  
  const secretWordStyled = `<strong style="color:var(--secondary); font-size:1.1rem;">${state.secretWord}</strong>`;
  
  if (state.selectedGame === 'chameleon') {
    const chameleonName = state.players.find(p => state.roles[p] === 'chameleon');
    
    if (state.winner === 'chameleon') {
      resultsOutcome.textContent = "CHAMELEON WINS!";
      resultsOutcome.className = "outcome-text outcome-win";
      triggerVibration([200, 100, 200]);
      
      if (state.votedPlayer === chameleonName) {
        resultsDetails.innerHTML = `The group voted out the Chameleon (<strong>${chameleonName}</strong>), but they successfully guessed the secret word: ${secretWordStyled}!`;
      } else {
        resultsDetails.innerHTML = `The group failed to identify the Chameleon. <strong>${chameleonName}</strong> blended in perfectly! The word was ${secretWordStyled}.`;
      }
    } else {
      resultsOutcome.textContent = "PLAYERS WIN!";
      resultsOutcome.className = "outcome-text outcome-win";
      triggerVibration([100, 50, 100, 50, 300]);
      
      resultsDetails.innerHTML = `The group caught the Chameleon (<strong>${chameleonName}</strong>) and they failed to guess the secret word: ${secretWordStyled}!`;
    }
    
  } else if (state.selectedGame === 'insider') {
    const insiderName = state.players.find(p => state.roles[p] === 'insider');
    
    if (state.winner === 'insider') {
      resultsOutcome.textContent = "INSIDER WINS!";
      resultsOutcome.className = "outcome-text outcome-win";
      triggerVibration([200, 100, 200]);
      
      resultsDetails.innerHTML = `The group guessed the secret word ${secretWordStyled}, but failed to identify the Insider (<strong>${insiderName}</strong>) who guided them!`;
    } else if (state.winner === 'players') {
      resultsOutcome.textContent = "PLAYERS WIN!";
      resultsOutcome.className = "outcome-text outcome-win";
      triggerVibration([100, 50, 100, 50, 300]);
      
      resultsDetails.innerHTML = `The group guessed the secret word ${secretWordStyled} and successfully identified <strong>${insiderName}</strong> as the Insider!`;
    } else {
      resultsOutcome.textContent = "DEFEAT";
      resultsOutcome.className = "outcome-text outcome-loss";
      triggerVibration([500]);
      
      resultsDetails.innerHTML = `The timer ran out before the group could guess the secret word: ${secretWordStyled}. Everyone loses!`;
    }
  }
  
  showScreen('results');
}

// Restart button
document.getElementById('btn-results-restart').addEventListener('click', () => {
  triggerVibration(50);
  showScreen('home');
});

// Initialize home screen on load
showScreen('home');
