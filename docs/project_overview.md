# Project Overview: Guess The Word

A responsive, mobile-first, pass-and-play party game website featuring two spoken word social deduction games: **Insider** and **Chameleon**. Designed for groups of friends or family to play together in person using a single mobile phone.

---

## Mission Statement
To replace clunky, ad-heavy, and disjointed websites with a single, premium, ad-free web application that brings people together around a physical table. By streamlining setup and utilizing intuitive screen-reveal mechanics, the app serves as a seamless game moderator, allowing players to focus entirely on the fun of face-to-face social deduction and bluffing.

---

## Features & Implementation Requirements

### 1. Unified Game Portal
* A clean, immersive home screen with glassmorphic cards allowing immediate choice between *Chameleon* or *Insider*.
* High-quality typography, smooth transitions, and tactile vibration feedback.

### 2. Player and Category Configuration
* Add and remove players (min 3, max 10) with automatic placeholder labeling.
* Category grid selection featuring a "Random" picker and specific categories: Animals, Food, Pop Culture, Places, Professions, Objects.

### 3. "Pass & Play" Security Mechanics
* **Pass The Phone Screen:** Clear directions showing who the phone must be handed to next to prevent accidental peeking.
* **Secret Reveal Screen:** A tactile press-and-hold interaction that hides secrets by default and only displays them while the current player is actively pressing down on the screen.

### 4. Spoken Word Game Rulesets

#### Game A: Chameleon
* **Roles:** 1 Chameleon, others are common players.
* **Context:** A 4x4 grid of 16 words is generated.
* **Information:** Common players see the secret word. The Chameleon only sees the category and the grid.
* **Gameplay:** Players say one related word in a circle. Chameleon bluffs.
* **Endgame:** Vote for Chameleon. If caught, Chameleon gets one guess at the secret word from the grid to escape.

#### Game B: Insider
* **Roles:** 1 Insider, others are common players.
* **Context:** A single secret word is chosen.
* **Information:** Only the Insider sees the secret word. Everyone else only knows they are a common player.
* **Gameplay:** 3-minute timer starts. Players ask yes/no questions to guess the secret word. Insider secretly steers the group.
* **Endgame:** If guessed, players vote on who the Insider is. If Insider escapes detection, Insider wins!

---

## Project Roadmap

### Phase 1: Base Application & GitHub Setup (Complete)
* [x] Initialize Git repository locally.
* [x] Create project files (`index.html`, `style.css`, `app.js`, `words.js`, `.gitignore`).
* [x] Link local repository to GitHub (`gdamiano/guess-the-word`).
* [x] Enable GitHub Pages and verify live deployment.

### Phase 2: "Insider Mode" Refinement & Testing
* [x] Review and test the existing Insider setup, pass, and gameplay screens.
* [ ] Verify that the timer properly triggers lose states.
* [ ] Update the voting screen to handle the two-step Insider voting flow (Did we guess the word? -> Who is the Insider?).
* [ ] Conduct playthrough testing to identify bugs, edge cases, and layout alignment issues on mobile viewports.
* [ ] Polish text instructions, UI buttons, and styling for Insider.
* [ ] Add a game timer and turn timer button to the main screen

### Phase 3: "Chameleon Mode" Refinement & Error-Proofing
* [ ] Review and test the Chameleon role assignment, grid generation, and pass screen.
* [ ] Verify that the 16-word grid displays correctly without highlighting the secret word during the active round.
* [ ] Implement voting logic and ensure the Chameleon Escape screen functions correctly (selecting from the 16-word grid).
* [ ] Audit the code for potential errors, edge cases (e.g. player count transitions, timer resets, double button clicks).
* [ ] Polish visual elements and animations.
