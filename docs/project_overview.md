# Project Overview: Words & Wolves

A responsive, mobile-first, pass-and-play party game website featuring two spoken word social deduction games: **Fool the Flock** (Chameleon) and **Ask the Shepherd** (Insider). Designed for groups of friends or family to play together in person using a single mobile phone, tablet, or laptop.

---

## Mission Statement
To replace clunky, ad-heavy, and disjointed websites with a single, premium, ad-free web application that brings people together around a physical table. By streamlining setup and utilizing intuitive screen-reveal mechanics, the app serves as a seamless game moderator, allowing players to focus entirely on the fun of face-to-face social deduction and bluffing.

---

## Project Architecture & File Mappings
The application is structured as a single-page web app built on standard web technologies without external framework build steps, ensuring it can run directly from the local file system (`file://` protocol compatible) or via static hosting.

* **Main Layout & HTML Structure:** [index.html](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/index.html) contains all 12 screens of the game structured inside a unified `.app-frame` viewport wrapper, along with the background `#cloud-wallpaper` container. Screens are hidden and shown dynamically using class toggles.
* **Game Logic & State Machine:** [app.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/app.js) handles global state management, player sorting, touch/drag events, scoring algorithms, custom handoff sequences, routing, settings menu events, and dynamic background cloud animation/tracking.
* **Theme Styling & Layout:** [style.css](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/style.css) implements the visual identity using CSS custom properties for color transitions, flexbox layouts for vertical scroll containment, custom buttons, settings dropdown menu overlay, screen-specific layouts, and hardware-accelerated sky/cloud scrolling animations.
* **Game Strings & Configuration:** [config_strings.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/config_strings.js) centralizes all UI text strings, role descriptions, headers, scoring weights, configurable portrait mappings (`PORTRAIT_CONFIG`, `HOW_TO_PLAY_CONFIG`), and cloud speed/spawn parameters (`CLOUD_CONFIG`).
* **Word Database:** [words.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/words.js) exports the categorized vocabulary words for topics.

---

## Features & Implementation Requirements

### 1. Unified Game Portal
* A clean, immersive home screen with an edgeless, colorful vector-art style, featuring a custom **game selector dropdown/combobox UI** (`.custom-dropdown-container`) that displays the active mode's icon, title, and player limits.
* Flipped game ordering and startup default selection:
  * **Fool the Flock** is listed first (`4+` players limit, starts selected by default, uses `theme-blue` background).
  * **Ask the Shepherd** is listed second (`5+` players limit, uses `theme-pink` background).
* High-quality typography, smooth transitions, and dynamic body background color changes (blue/pink theme states) that adjust automatically to match the selected mode.
* In-game toggle-preview mode artwork displaying a visual card depending on the active game mode choice.
* Player counts inside dropdown limits are displayed with a clean inline vector user silhouette SVG.

### 2. Player and Category Configuration
* **Setup Players screen (1/3):** Add and remove players (min 3, max 10) with support for a custom desktop-like drag-and-drop reordering mechanism using grab handles (`☰`) and rotation shifts. The active row follows the cursor/finger smoothly in real-time, while sibling rows slide dynamically out of the way using hardware-accelerated CSS transforms and transitions, preventing layout popping and settling seamlessly when released. Displays a helpful banner below the title containing a happy sheep portrait and the text: `"PROTIP: Sit around the room in this order!"`. Includes individual `"✖"` remove buttons on each player row (hidden at the minimum player count of 3) to allow removing players from anywhere in the list. Auto-focuses the first field on screen load, auto-selects default names on click/focus for easy overwrite, and supports mobile virtual keyboard Next/Done hints for smooth field-to-field text entry navigation.
* **Setup Roles screen (2/3):** Includes an extra, static "Sheep" row at the top of the list displaying a happy sheep portrait. The Sheep count is dynamically calculated as:
  $$\text{Sheep} = \text{Players} - \text{Shepherds} - \text{Wolves} - \text{Sheepdogs} - \text{Secret Sheepdogs}$$
  The row does not have adjustment controls; it dynamically increases or decreases as special roles are added or subtracted.
* **Setup Topics screen (3/3):** Grid category selector loaded dynamically from [words.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/words.js), starting unselected by default, featuring 2 columns of centered buttons. Selection configurations are preserved on subsequent rounds and scoreboard replays, allowing players to keep their category selections.

### 3. "Pass & Play" Security Mechanics
* **Pass The Phone Screen:** Clear directions displaying "I'm [Player Name]" on buttons to ensure only the intended player views their secret.
* **Dynamic Handoff Sequences:** Hand-to-player sequence generated in a custom array (`state.passSequence`) that guarantees the active Shepherd/Sheepdog leader receives the phone first, followed by remaining players in circle order.
* **Planning Screen reveal layout:** Displays the player name greeting at the top, with the role and secret instructions placed outside the hold box. Sensitive role labels (except for public roles Shepherd & Head Sheepdog) and the secret word/status are covered by solid inline-block redaction blocks.
  * Redaction spans inherit font weights and families of their parent sentences and align inline naturally when revealed.
  * The "HOLD THIS BOX" container remains static in text and gets a shaded grey pressed state and slight scaling down when held.
* **Hold-to-Reveal Lock & Animation:** Next/continue buttons remain disabled and display the text `"Read your text to continue"` until the box has been held continuously for a specified duration:
  * **1 second** on the Planning screen.
  * **2 seconds** on the Main Play screen.
  * The button fills with the active theme color from left to right using a background-position transition while being held, instantly resetting to 0% if released early.
* **Transition Handoff:** A hand-back transition screen at the end of the reveal phase instructs the last player to hand the phone back to the Shepherd/Sheepdog before the active round starts.

### 4. Player Portraits & Headshots
* Configurable role-based portrait headshots displayed across key interfaces:
  * **Setup Roles Screen**: Displays "happy" character icons for Sheep, Shepherd, Wolves, Sheepdog, and Secret Sheepdog next to role configurations, with automatic fallback to neutral base assets.
  * **How to Play Screen**: Lists structured rules as individual card items, each accompanied by its matching illustration. The rules and buttons share a single scrolling frame (`.scroll-y`), requiring players to scroll to the end of all instructions to reach the Play and Cancel/Back buttons.
  * **Results / Scoreboard Screen**: Displays a win or lose portrait next to each player's row depending on their role and round outcome (win/lose).
  * **Graceful Asset Fallbacks**: Employs robust `onerror` fallbacks to neutral assets (e.g. `portrait_wolf_neutral.png`, `portrait_secret_sheepdog.png`) if specialized outcome/emotional portrait files are missing.

### 5. Settings Menu & About Screen
* The old header Close button (`✖`) is replaced by a Settings Gear icon button (`assets/settings_button.png?v=3`).
* Tapping the Settings gear displays a dropdown menu overlay with glassmorphism styling (`backdrop-filter: blur(8px)`), dynamic overlays (`z-index: 20` on header), and options for:
  * **About:** Opens the About details screen. Closing the About screen returns to the previously active game screen, maintaining persistent state.
  * **End game:** Resets active game and returns to home screen (disabled/faded on starting page).
  * **Reload page:** Reloads the browser viewport.
  * **Break cache:** Appends a timestamp cache-buster parameter (`?cb=...`) to force browser cache clears.
  * **Close menu:** Dismisses the overlay.
* Clicking anywhere outside the dropdown menu automatically closes it.

### 6. Dynamic Cloud Wallpaper Background
* A premium, slow-scrolling sky background rendered fullscreen (on `body`) behind the centered `#root-app` mobile frame.
* Dynamically manages and tracks active clouds, guaranteeing that exactly 2 sheep-shaped clouds (derpy, neutral, or happy sheep) are scrolling across the screen at any given time.
* Restricts vertical cloud boundaries to the top 2/3rds of the viewport.
* Utilizes negative `animation-delay` offsets at startup to pre-populate clouds evenly across the screen.
* Customizable configuration values (`CLOUD_CONFIG` in [config_strings.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/config_strings.js)) control speed, sizing, boundaries, spawn rates, and sheep limits.

---

## Imagery & Touch Architecture
A standardized workflow governs how media assets and touch gestures are managed:
* **Centralized Mappings**: All portrait-to-role mappings (`PORTRAIT_CONFIG`) and rule-to-image steps (`HOW_TO_PLAY_CONFIG`) reside in [config_strings.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/config_strings.js).
* **Cache Busting**: Every image/script asset is loaded with a version string parameter appended to the filename (e.g., `?v=3`) to force mobile browsers to fetch fresh files on deployments.
* **Image Fallbacks**: Handled via inline `onerror` logic (in HTML) and dynamic error event listeners (in JS) that intercept load failures and immediately fall back to local neutral representations.
* **Sizing Modifiers**: Standard portraits are styled to `44px` square blocks with `8px` rounded borders. Special page-level modifiers (`.large`) are used to scale preview and handoff artwork.
* **Mobile Zoom Prevention:** Added `touch-action: manipulation;` to the universal selector (`*`) in [style.css](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/style.css) to disable double-tap zoom gestures on mobile viewports while speeding up button tap responsiveness.

---

## Spoken Word Game Rulesets

### Game A: Fool the Flock (Chameleon)
* **Roles:** 1 Sheepdog (fixed/rotating active player), Wolves (who bluff without knowing the word), and Flock (common players).
* **Information:** Sheepdog and Flock see the secret word. Wolves do not know the word.
* **Gameplay:** Go around the room saying a single related word.
* **Endgame:** The group votes on who is a wolf.
  - **FOUND A WOLF!**: Ends the round. Flock wins. Non-wolves get points, and the Sheepdog gets extra points.
  - **WRONG (keep wolves)**: Wolves win the round and get points. Keeps current roles, increments the "Wolves survived X turns" counter, and loops back to Setup Topics to choose a new topic.
  - **WRONG (new wolves)**: Wolves win the round and get points. Resets the turn counter, reshuffles roles on the next round, and displays the scoreboard.
* **Secret Rule**: The player directly after the rotating Sheepdog in circle order is never assigned to be a wolf.

### Game B: Ask the Shepherd (Insider Mode / `MODE_ONE_EXPERT`)
* **Roles:** 1 Shepherd (fixed), Wolves (mislead), Sheepdog (confirms guesses, goes first after Shepherd), Secret Sheepdog (hidden voter), and Flock (common guessers).
* **Context:** A single secret word is chosen.
* **Information:** Shepherd and Wolves know the secret word. Others know only their role description.
* **Gameplay:** Untimed round. Players ask the Shepherd yes/no questions in circle order.
* **Endgame (Two-Step Voting):**
  * **Guess the Word (10A):** The team gets 3 tries to guess the word. Tries remaining are dynamically displayed, and the wrong button adjusts label state based on tries remaining.
  * **Find the Wolves (10B):** The team votes on who the wolves were. Accusations replace the count dynamically and adjust for Secret Sheepdog counts if active.
* **Scoreboard:** Dynamically displays **"THE FLOCK WINS!"** in blue or **"THE WOLVES WIN!"** in red, showing point breakdown reasons under player names. Clicking "Play Again" resets the game.

---

## Project Roadmap

### Phase 1: Base Application & GitHub Setup (Complete)
* [x] Initialize Git repository locally.
* [x] Create project files ([index.html](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/index.html), [style.css](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/style.css), [app.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/app.js), [words.js](file:///c:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/words.js), `.gitignore`).
* [x] Link local repository to GitHub (`gdamiano/guess-the-word`).
* [x] Enable GitHub Pages and verify live deployment.

### Phase 2: Game Modes & Flow implementation (Complete)
* [x] Scaffold 12-screen vector art mobile page structure (including About screen).
* [x] Implement Setup screens with dynamic vertical lists, reordering, role spacers, and unselected default categories.
* [x] Build circle order reveal handoffs starting with Shepherd, prioritizing Sheepdogs, and ending with a Hand-Back screen.
* [x] Implement untimed round flow with dynamic Main Play configurations.
* [x] Implement divided voting sequence: Guess the Word (10A) and Find the Wolves (10B).
* [x] Implement point distribution algorithms, detailed scoreboard reason text, and play again role rotations.
* [x] Fix container overflow bugs to enable vertical scroll containment inside the viewport.
* [x] Implement configurable player portraits on setup, how to play, and scoreboard screens with automatic resource fallbacks.

### Phase 3: Mobile & UX Refinements (Complete)
* [x] Implement settings gear button replacing Close button.
* [x] Create dropdown glassmorphism menu inside header.
* [x] Add dynamic transition color fill animations on hold-to-reveal buttons.
* [x] Build dynamically calculated Sheep count row on Setup Roles screen.
* [x] Restructure How to Play layout to scroll rules and buttons together.
* [x] Implement custom dropdown selector for game choice on start page.
* [x] Prevent double-tap viewport zooming on mobile.

### Phase 4: Polish fixes
* [x] Review and clean up user-facing text after play tests
* [ ] Add a dark horizon floor to the background