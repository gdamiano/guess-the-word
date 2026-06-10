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

  TXT_HOLD_TO_VIEW: "HOLD TO VIEW\nthe secret word",
  TXT_PRESS_PASS: "PRESS & PASS THE PHONE",
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
          desc: "The Shepherd knows the secret word and answers the Flock's questions."
        },
        FLOCK: {
          id: "FLOCK",
          name: "Flock",
          desc: "You're in the flock! Ask the Shepherd a question on your turn. Try to guess the right word, and don't be fooled by wolves!"
        },
        WOLF: {
          id: "WOLF",
          name: "Wolves",
          desc: "The Wolves know the secret word and want to make the Flock guess the wrong word."
        },
        SHEEPDOG: {
          id: "SHEEPDOG",
          name: "Sheepdog",
          desc: "The Sheepdog confirms the Flock's final votes for the secret word and the wolves."
        },
        SECRET_SHEEPDOG: {
          id: "SECRET_SHEEPDOG",
          name: "Secret Sheepdog",
          desc: "The Secret Sheepdog votes on who is a wolf, but it isn't known he's a Sheepdog."
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
