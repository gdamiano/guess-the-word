const STRINGS = {
  APP_TITLE: "Choose a Game",
  HEADER_CHOOSE_GAME: "Choose a Game",
  HEADER_ASK_SHEPHERD: "Ask the Shepherd",
  HEADER_FOLLOW_FLOCK: "Follow the Flock",
  
  BTN_LOG_PLAYERS: "Log Players",
  BTN_START_GAME: "Start Game",
  BTN_CANCEL: "Cancel",
  BTN_NEXT: "Next",
  BTN_PLAY: "Play",
  BTN_SET_UP: "Set Up",
  BTN_CONTINUE: "Continue",
  BTN_PLAY_AGAIN: "Play Again",
  BTN_LETS_VOTE: "Let's Vote",
  BTN_THEY_GOT_IT: "They got the word",
  BTN_TRY_AGAIN: "Try Again",

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
      how_to_play_title: "HOW TO PLAY",
      how_to_play_desc: "The Shepherd knows the secret word. Go around the room - each player asks the Shepherd one yes/no question. Try to guess the word, but watch out for Wolves who will try to mislead the flock!",
      roles: {
        SHEPHERD: {
          id: "SHEPHERD",
          name: "Shepherd",
          desc: "knows the secret word and answers questions.",
          instruction: "You know the answer!\nAnswer: "
        },
        FLOCK: {
          id: "FLOCK",
          name: "Flock",
          desc: "asks questions to guess the word.",
          instruction: "You're on the team.\nAnswer: Unknown"
        },
        WOLF: {
          id: "WOLF",
          name: "Wolf",
          desc: "knows the secret word and wants to mislead.",
          instruction: "You're a wolf.\nAnswer: "
        },
        SHEEPDOG: {
          id: "SHEEPDOG",
          name: "Sheepdog",
          desc: "confirms the Flock's final votes.",
          instruction: "You're the main Sheepdog! Ask a question to help learn the secret answer, and help vote for the answer and the wolf at the end of the round.\nAnswer: Unknown"
        },
        SECRET_SHEEPDOG: {
          id: "SECRET_SHEEPDOG",
          name: "Secret Sheepdog",
          desc: "votes on wolves but is unknown.",
          instruction: "You're on the team.\nAnswer: Unknown"
        }
      },
      SCORING: {
        MODE_ONE_EXPERT_WORD_CORRECT: 10,
        MODE_ONE_EXPERT_WORD_FAILED: 45,
        MODE_ONE_EXPERT_WOLF_FOUND: 15
      }
    },
    MODE_GROUP_GUESSERS: {
      id: "MODE_GROUP_GUESSERS",
      title: "Follow the Flock",
      description: "One player doesn't know the secret word. Everyone else knows it. Go around the room saying one related word. Don't get caught!",
      themeClass: "theme-pink",
      roles: {}
    }
  }
};
