---
name: update-project-overview
description: "Revise, document, and update the project architecture, features, and functional specifications in docs/project_overview.md based on recent developments and implementation details. Trigger this skill when the user wants to document new features, updates, or architecture changes in the project overview."
---

# Update Project Overview Skill

Use this skill to update and synchronize `docs/project_overview.md` with the latest code state.

## Instructions

1. **Read Existing Overview**: Review the existing contents of [project_overview.md](file:///C:/Users/pogoo/Documents/Cursor/Guess%20The%20Word/docs/project_overview.md) to preserve the style, tone, and existing structure.
2. **Collect Code Changes**: Examine recent commits, edited files, and newly created components (especially UI screens, styling updates, state store slices, and backend endpoints).
3. **Synchronize Details**: Update the documentation to reflect:
   - New panels, sidebars, and components (e.g., Settings sidebar with glassmorphism, model controls).
   - File path mappings (e.g., frontend components under `src/`, sidecar/backend scripts, store configurations).
   - Component interactions and states (e.g., default visibility, custom SVG indicators).
4. **Format & Quality Check**: Ensure all file and symbol links use the `file:///` absolute URL format and that markdown formatting remains clean and readable.
