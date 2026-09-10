# Changelog

## [0.2.0] - 2026-09-09

Single-file knowledge-base format support; drops the frozen `@tnotesjs/core`.

### Breaking

- Reads the new KB layout only: `tnotes.json` + `TOC.md` + `notes/NNNN. 标题.md`. Old-format repos (per-note directories + `.tnotes.json`) are detected but show a migration hint instead of a tree.

### Changed

- Workspace backend switched from `@tnotesjs/core` to `@tnotesjs/kb` (`createWorkspace`): TOC read, note/group create / rename / move / delete, done toggles
- Note paths open `notes/NNNN. 标题.md` directly (no more `README.md` inside per-note directories)
- Git change marks key off the note file stem, so M / U / A / D / R badges keep working on the new layout
- KB titles come from each repo's own `tnotes.json` (root repo `root_items` remains a legacy fallback)
- Single-KB detection requires `TOC.md` + `tnotes.json` (legacy: `.tnotes.json`)

## [0.1.0] - 2026-08-08

Initial Marketplace release.

### Features

- Multi / single / unrecognized workspace modes for local TNotes knowledge bases
- Activity Bar webview: KB list + read-only TOC (draggable split in multi mode)
- Address bar for scan root (`tnotesNav.rootPath`); refresh loads the path
- KB pin, TOC pin shortcuts, collapse persistence
- Changes section with git letter marks (M / U / A / D / R) and KB dirty / ahead / behind badges
- Context menu: copy path; multi-mode open terminal at KB root
- Open notes and repo README in the editor
