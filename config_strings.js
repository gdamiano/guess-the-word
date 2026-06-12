const STRINGS = {
  APP_TITLE: "Fool the Flock!",
  HEADER_CHOOSE_GAME: "Fool the Flock!",
  HEADER_ASK_SHEPHERD: "Ask the Shepherd",
  HEADER_FOLLOW_FLOCK: "Fool the Flock",
  
  BTN_LOG_PLAYERS: "Log Players",
  BTN_ABOUT: "About",
  BTN_START_GAME: "Start Game",
  BTN_CANCEL: "Back",
  BTN_NEXT: "Next",
  BTN_PLAY: "Play",
  BTN_SET_UP: "Set Up",
  BTN_CONTINUE: "Continue",
  BTN_PLAY_AGAIN: "Play Again",
  BTN_LETS_VOTE: "Let's Vote",
  BTN_THEY_GOT_IT: "They got the word",
  BTN_TRY_AGAIN: "Try Again",
  ABOUT_TITLE: "About the Game",
  ABOUT_TEXT: `<h3>Guess The Word</h3>
<p>Welcome to <strong>Fool the Flock!</strong>, a premium pass-and-play social deduction game designed for groups of 4 or more players using a single laptop, tablet or mobile device!</p>

<h4>Ask the Shepherd</h4>
<p>In this mode, one player is the Shepherd who knows the secret word. Others ask yes/no questions in circle order. Watch out for the Wolves who also know the secret word and are trying to subtly mislead the team into choosing the wrong word. The Sheepdogs must organize the final votes for guessing the correct word and rooting out the hidden wolves.</p>

<h4>Fool the Flock</h4>
<p>All players except the Wolves know the secret word. Players take turns saying a single word related to the secret word. The Wolves must bluff and fit in without knowing the word, then guess the word if they are voted out.</p>

<h4>AI Disclosures</h4>
<p>No AI-generated art or layouts were used in this app. Generative AI was used to write the code and perform developer documentation and operations. Steps were taken to avoid the theft of human artistic works.</p>

<p style="margin-top: 16px; font-size: 0.85rem; color: var(--color-text-muted);">Developed with premium aesthetics and dynamic visual themes.</p>`,

  TXT_HOLD_TO_VIEW: "HOLD TO VIEW\nyour secret",
  TXT_PRESS_PASS: "I'M READY!",
  TXT_IM_SHEPHERD: "I'm the Shepherd!",

  MODES: {
    MODE_ONE_EXPERT: {
      id: "MODE_ONE_EXPERT",
      title: "Ask the Shepherd",
      description: "The Shepherd knows the secret words. The players can ask questions. Some players are Secret Wolves, trying to make the team decide on the wrong word.",
      themeClass: "theme-blue",
      setup_players_title: "SET UP 1/3: PLAYERS",
      setup_roles_title: "SET UP 2/3: ROLES",
      setup_topics_title: "SET UP 3/3: TOPICS",
      how_to_play_desc: "The Shepherd knows the secret word.\nEach player asks the Shepherd one yes/no question.\nWhen everyone has a turn, vote on what the word could be!\nWolves secretly try to mislead the flock. After the round, guess who played the wolves!",
      main_screen_title: "Let's Play!",
      main_screen_desc: "You know the secret word. Each player may ask one question.\n\nWhen everyone had a turn, you can start the voting step.",
      vote_word_title: "GUESS THE WORD",
      vote_word_desc: "Tell the players they can discuss and choose one word for their guess. The Sheepdog has final say on the word.\n\nIf their guess is WRONG, they'll ask more questions.",
      vote_word_tries_left: "The team has # tries left.",
      vote_word_last_try: "This is the last try! If they choose wrong, the Wolves win.",
      vote_wolves_title: "FIND THE WOLVES",
      vote_wolves_desc: "Accuse # players of being wolves. The Sheepdog should help them finalize their guess.",
      roles: {
        SHEPHERD: {
          id: "SHEPHERD",
          name: "Shepherd",
          desc: "Tell everyone: you're The Shepherd!\n\nYou can answer YES OR NO questions about the secret word.\n\nThe secret word is: ",
          instruction: "You know the answer!\nAnswer: "
        },
        FLOCK: {
          id: "FLOCK",
          name: "Sheep",
          desc: "Don't tell: you're a sheep.\n\nYou may ask the Shepherd one yes/no question ABOUT the secret word.\n\nDon't guess yet ('is the word ___?') You'll do that when everyone has a turn.",
          instruction: "You're on the team.\nAnswer: Unknown"
        },
        WOLF: {
          id: "WOLF",
          name: "Wolf",
          desc: "Don't tell: you're a wolf.\n\nYou may ask the Shepherd one yes/no question ABOUT the secret word.\n\nTrick the sheep team so they don't guess this word: ",
          instruction: "You're a wolf.\nAnswer: "
        },
        SHEEPDOG: {
          id: "SHEEPDOG",
          name: "Sheepdog",
          desc: "Tell everyone: you're the main Sheepdog!\n\nYou may ask the Shepherd one yes/no question ABOUT the secret word.\n\nDon't guess yet ('is the word ___?') You'll lead the guesses later in the round.",
          instruction: "Helps the team and runs votes."
        },
        SECRET_SHEEPDOG: {
          id: "SECRET_SHEEPDOG",
          name: "Secret Sheepdog",
          desc: "Don't tell anyone: you're a secret sheepdog!\n\nYou may ask the Shepherd one yes/no question ABOUT the secret word.\n\nDon't guess yet or ask 'is the word ___?'",
          instruction: "Gets one extra guess as to who's a wolf."
        }
      },
      SCORING: {
        MODE_ONE_EXPERT_WORD_CORRECT: 10,
        MODE_ONE_EXPERT_WORD_FAILED: 15,
        MODE_ONE_EXPERT_WOLF_FOUND: 15
      }
    },
    MODE_GROUP_GUESSERS: {
      id: "MODE_GROUP_GUESSERS",
      title: "Fool the Flock",
      description: "One player doesn't know the secret word. Everyone else knows it. Go around the room saying one related word. Don't get caught!",
      themeClass: "theme-pink",
      setup_players_title: "SET UP 1/3: PLAYERS",
      setup_roles_title: "SET UP 2/3: ROLES",
      setup_topics_title: "SET UP 3/3: TOPICS",
      how_to_play_desc: "Sheep and Sheepdogs know the secret word.\nOn the wolves' turn, they try to blend in.\nThe Sheepdog helps the team vote.",
      main_screen_title: "Time to Vote!",
      main_screen_desc: "Everyone has said a word!\n\nDiscuss and decide who the Wolf is.",
      vote_wolves_title: "FIND THE WOLVES",
      vote_wolves_desc: "Decide as a group on 1 player who is a wolf. The Sheepdog calls for the final vote.",
      roles: {
        SHEEPDOG: {
          id: "SHEEPDOG",
          name: "Sheepdog",
          desc: "Tell everyone: you're the main Sheepdog!\nSay one word RELATED TO the secret word.\n\nThe secret word is: ",
          instruction: "You know the answer! Start the round by saying a word related to:\nAnswer: "
        },
        FLOCK: {
          id: "FLOCK",
          name: "Flock",
          desc: "Don't tell: you're a sheep.\n\Say one word RELATED TO the secret word.\n\nThe secret word is: ",
          instruction: "You know the answer! When it's your turn, say a word related to:\nAnswer: "
        },
        WOLF: {
          id: "WOLF",
          name: "Wolf",
          desc: "Don't tell: you're a wolf.\n\Say one word that SOUNDS LIKE the other players' words.\n\nTry to blend in: fake it!",
          instruction: "You're the wolf. You DON'T know the word! Listen to others and say a word that fits in.\nAnswer: Unknown"
        },
        SECRET_SHEEPDOG: {
          id: "SECRET_SHEEPDOG",
          name: "Secret Sheepdog",
          desc: "Don't tell: you're a secret sheepdog!\nSay one word RELATED TO the secret word.\n\nThe secret word is: '",
          instruction: "Gets one extra guess as to who's a wolf."
        }
      },
      SCORING: {
        MODE_GROUP_GUESSERS_WOLF_WRONG: 15,
        MODE_GROUP_GUESSERS_WOLF_FOUND: 10,
        MODE_GROUP_GUESSERS_SHEEPDOG_EXTRA: 5
      }
    }
  }
};

const PORTRAIT_CONFIG = {
  ask_the_expert_team_win: "portrait_sheep_happy.png",
  ask_the_expert_team_lose: "portrait_sheep_angry.png",
  ask_the_expert_spy_win: "portrait_wolf_happy.png",
  ask_the_expert_spy_lose: "portrait_wolf_angry.png",
  ask_the_expert_hunter_win: "portrait_sheepdog_happy.png",
  ask_the_expert_hunter_lose: "portrait_sheepdog_happy.png",
  ask_the_expert_secret_hunter_win: "portrait_secret_sheepdog_neutral.png",
  ask_the_expert_secret_hunter_lose: "portrait_secret_sheepdog_neutral.png",
  ask_the_expert_expert_win: "portrait_shepherd_neutral.png",
  ask_the_expert_expert_lose: "portrait_shepherd_neutral.png",
  group_guessers_team_win: "portrait_sheep_happy.png",
  group_guessers_team_lose: "portrait_sheep_angry.png",
  group_guessers_spy_win: "portrait_wolf_happy.png",
  group_guessers_spy_lose: "portrait_wolf_angry.png",
  group_guessers_hunter_win: "portrait_sheepdog_happy.png",
  group_guessers_hunter_lose: "portrait_sheepdog_happy.png"
};

const HOW_TO_PLAY_CONFIG = {
  MODE_ONE_EXPERT: [
    { text: "The Sheep team wants to guess the secret word.", image: "portrait_sheep_neutral.png", fallback: "portrait_sheep_neutral.png" },
    { text: "The Shepherd knows the secret word, and will answer yes/no quesitions.", image: "portrait_shepherd_neutral.png", fallback: "portrait_shepherd_neutral.png" },
    { text: "Pass the phone around to give each player their instructions.", image: "pass_the_phone_small.png", fallback: "pass_phone_small.png" },
    { text: "Wolves know the word and secretly MISLEAD the flock.", image: "portrait_wolf_happy.png", fallback: "portrait_wolf_neutral.png" },
    { text: "After everyone asks a question, the team guesses the word, and the identity of the wolves!", image: "portrait_sheepdog_happy.png", fallback: "portrait_sheep_neutral.png" }
  ],
  MODE_GROUP_GUESSERS: [
    { text: "Sheep and Sheepdogs know the secret word. On their turn player says one word related to the secret word.", image: "portrait_sheep_neutral.png", fallback: "portrait_sheep_neutral.png" },
    { text: "On the wolves' turn, they try to \"blend in\" saying a word that fits the words they hear.", image: "portrait_wolf_angry.png", fallback: "portrait_wolf_neutral.png" },
    { text: "When every player has gone, the Sheepdog helps the team vote on who may be a wolf.", image: "portrait_sheepdog_happy.png", fallback: "portrait_sheep_neutral.png" },
    { text: "The sheep team gets points every round they vote and eliminate a wolf.", image: "portrait_sheep_happy.png", fallback: "portrait_sheep_neutral.png" },
    { text: "The wolf team gets points every round the sheep team vote is wrong.", image: "portrait_wolf_neutral.png", fallback: "portrait_wolf_neutral.png" }
  ]
};

const CLOUD_CONFIG = {
  spawnIntervalMs: 6000,    // Time between cloud spawns
  minSpeedSec: 25,          // Minimum time to cross screen (seconds)
  maxSpeedSec: 45,          // Maximum time to cross screen (seconds)
  maxSheepClouds: 2,        // Target number of sheep clouds on screen
  initialCloudCount: 6,     // Number of clouds to pre-populate on startup
  minTopPercent: 5,         // Cloud boundary top
  maxTopPercent: 60,        // Cloud boundary bottom (top 2/3rds)
  minSizePx: 50,            // Minimum cloud width
  maxSizePx: 120            // Maximum cloud width
};



