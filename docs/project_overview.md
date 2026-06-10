# Project Overview: Guess The Word

A responsive, mobile-first, pass-and-play party game website featuring two spoken word social deduction games: **Follow the Flock** (Chameleon) and **Ask the Shepherd** (Insider). Designed for groups of friends or family to play together in person using a single mobile phone.

---

## Mission Statement
To replace clunky, ad-heavy, and disjointed websites with a single, premium, ad-free web application that brings people together around a physical table. By streamlining setup and utilizing intuitive screen-reveal mechanics, the app serves as a seamless game moderator, allowing players to focus entirely on the fun of face-to-face social deduction and bluffing.

---

## Project Architecture & File Mappings
The application is structured as a single-page web app built on standard web technologies without external framework build steps, ensuring it can run directly from the local file system (`file://` protocol compatible) or via static hosting.

* **Main Layout & HTML Structure:** [index.html](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/index.html) contains all 11 screens of the game structured inside a unified `.app-frame` viewport wrapper. Screens are hidden and shown dynamically using class toggles.
* **Game Logic & State Machine:** [app.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/app.js) handles global state management, player sorting, touch/drag events, scoring algorithms, and routing.
* **Theme Styling & Layout:** [style.css](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/style.css) implements the visual identity using CSS custom properties for color transitions, flexbox layouts for vertical scroll containment, and custom buttons.
* **Game Strings & Configuration:** [config_strings.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/config_strings.js) centralizes all UI text strings, role descriptions, headers, and scoring weights, allowing easy adjustment of descriptions and rules.
* **Word Database:** [words.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/words.js) exports the categorized vocabulary words for topics.

---

## Features & Implementation Requirements

### 1. Unified Game Portal
* A clean, immersive home screen with an edgeless, colorful vector-art style, allowing immediate choice between *Ask the Shepherd* or *Follow the Flock*.
* High-quality typography, smooth transitions, and dynamic body background color changes (blue/pink theme states) that adjust automatically to match the selected mode.

### 2. Player and Category Configuration
* Add and remove players (min 3, max 10) with support for drag-and-drop grab handles (`☰`) and rotation shifts (`↑` to make a player Player 1).
* Grid category selector loaded dynamically from [words.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/words.js), starting unselected by default, featuring 2 columns of centered buttons.

### 3. "Pass & Play" Security Mechanics
* **Pass The Phone Screen:** Clear directions displaying "I'm [Player Name]" on buttons to ensure only the intended player views their secret.
* **Planning Screen reveal box:** A secure hold-to-reveal area under a generic "YOU ARE PLAYING" title (preventing peeking) showing role descriptions and the secret word (for Shepherd & Wolves) in uniform size and color.
* **Transition Handoff:** A hand-back transition screen at the end of the reveal phase instructs the last player to hand the phone back to the Shepherd before the active round starts.

---

## Spoken Word Game Rulesets

### Game A: Follow the Flock (Chameleon)
* **Roles:** 1 Chameleon, others are common players.
* **Context:** A 4x4 grid of 16 words is generated.
* **Information:** Common players see the secret word. The Chameleon only sees the category and the grid.
* **Gameplay:** Players say one related word in a circle. Chameleon bluffs.
* **Endgame:** Vote for Chameleon. If caught, Chameleon gets one guess at the secret word from the grid to escape.

### Game B: Ask the Shepherd (Insider Mode / `MODE_ONE_EXPERT`)
* **Roles:** 1 Shepherd (fixed), Wolves (mislead), Sheepdog (confirms guesses, goes first after Shepherd), Secret Sheepdog (hidden voter), and Flock (common guessers).
* **Context:** A single secret word is chosen.
* **Information:** Shepherd and Wolves know the secret word. Others know only their role description.
* **Gameplay:** Untimed round. Players ask the Shepherd yes/no questions in circle order.
* **Endgame (Two-Step Voting):**
  * **Guess the Word (10A):** The team gets 3 tries to guess the word. Incorrect attempts decrement remaining tries and route back to discussion.
  * **Find the Wolves (10B):** The team votes on who the wolves were.
* **Scoreboard:** Dynamically displays **"THE FLOCK WINS!"** in blue or **"THE WOLVES WIN!"** in red, showing point breakdown reasons under player names. Clicking "Play Again" shifts the Shepherd and Sheepdog roles down by 1 person.

---

## Project Roadmap

### Phase 1: Base Application & GitHub Setup (Complete)
* [x] Initialize Git repository locally.
* [x] Create project files ([index.html](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/index.html), [style.css](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/style.css), [app.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/app.js), [words.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/words.js), `.gitignore`).
* [x] Link local repository to GitHub (`gdamiano/guess-the-word`).
* [x] Enable GitHub Pages and verify live deployment.

### Phase 2: "Ask the Shepherd" Mode Implementation (Complete)
* [x] Scaffold 11-screen vector art mobile page structure.
* [x] Implement Setup screens with dynamic vertical lists, reordering, role spacers, and unselected default categories.
* [x] Build circle order reveal handoffs starting with Shepherd, prioritizing Sheepdogs, and ending with a Hand-Back screen.
* [x] Implement untimed round flow with dynamic Main Play configurations.
* [x] Implement divided voting sequence: Guess the Word (10A) and Find the Wolves (10B).
* [x] Implement point distribution algorithms, detailed scoreboard reason text, and play again role rotations.
* [x] Fix container overflow bugs to enable vertical scroll containment inside the viewport.

### Phase 3: "Follow the Flock" Mode Refinement & Error-Proofing
* [ ] Review and test the Chameleon role assignment, grid generation, and pass screen.
* [ ] Verify that the 16-word grid displays correctly without highlighting the secret word during the active round.
* [ ] Implement voting logic and ensure the Chameleon Escape screen functions correctly (selecting from the 16-word grid).
* [ ] Audit the code for potential errors, edge cases (e.g. player count transitions, timer resets, double button clicks).
* [ ] Polish visual elements and animations.
