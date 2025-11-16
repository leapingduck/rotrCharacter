## to do!

### General

- [x] Make a POC macro using logic from old ones
- [x] Calculate using ability scores instead of static numbers.
- [x] Dynamic pieces for roll20 macros
- [x] Checklists by DOM
- [ ] Macro breaks down calculations for spot checks
- [ ] Route validation errors through a defined DOM element instead of `output`
- [ ] Align flaming/bane/impact checkbox IDs with state keys
- [ ] Replace `weapon1`/`weapon2` references with real weapon IDs during validation
- [x] Preserve weapon effect checkbox state when the list re-renders
- [ ] Reset Vital Strike damage when the toggle is cleared
- [x] scripts/stateEngine.js (lines 6-23) – Stop manually enumerating checkbox IDs in the state object and derive the entries from the DOM-generated checklists, keeping state in sync whenever new DOM-driven toggles are introduced.
- [ ] index.html (lines 49-53) – Replace the placeholder loadout paragraph with a DOM-driven checklist: define loadout presets in config and have dom.js render each preset plus its associated buff toggles dynamically.
- [ ] index.html (lines 58-63) – Create a Defense configuration array and populate #defenseEffectList via DOM so armor, shield, and situational bonuses can be toggled the same way attack buffs are.
- [ ] index.html (lines 75-83) – Build a data model for allied spell effects and render those entries dynamically in the Misc card instead of the duplicated placeholder <div> blocks.
- [ ] Update layout to three grid columns and flex inside.

### Attacks

- [ ] Description modal that comes up with a information icon or something
- [x] Challenged Foe
- [x] Banner
- [x] Power Attack
- [x] Furious Focus
- [x] Flaming Sword
- [x] Second Attack
- [x] Third Attack
- [x] Haste
- [x] Heroism
- [x] Enlarged
- [x] Vital Strike
- [ ] Add blink and include miss chance in roll.

### Output

- [x] Create preview through JS instead of hard coded
- [ ] Clicking preview expands modal to view full macro
- [ ] Can I create my own syntax highlighting?

### Weapons

- [x] +2 Greatsword (Giant Bane)
- [x] +1 Adamantine Warhammer
  - [ ] 1H
  - [ ] 2H (Currently 2h
- [x] +1 Impact Greatsword
- [x] Dynamic Effect Toggles
      After DOM Task
- [ ] Weapon Specific Alterations
  - [ ]Impact
  - [ ]Weapon Focus
  - [x]Weapon Item
  - [x] Flaming (current in effects not tied to weapon)
  - [ ] Bane
        How to make stack? Add dice to array and concat?

### Some Days

- [ ] Button to create new effect/weapon/etc..
- [ ] Chrome extension to pull copy macro while in roll20
- [ ] Add Billy
- [ ] Abilities and spell cards (For Billy)
- [ ] Make cards collapsible when clicked. One active per row, inactive shows a summary of what's active

## Updates

Inconvenient to toggle between attacks. Need to add a button to copy first second and third attacks, or work on outputting it all as a single macro.
Also add a hasted macro that adds a second full bab attack

### Variables

- Rename `base` to `baseStats` for clearer intent.
- Rename `attack`/`damage` objects to `attackBonuses`/`damageBonuses`.
- Rename `macro` to `macroState` (or similar) to distinguish it from the macro string.
- Rename `stateCheckboxes` to something like `stateInputs`/`buffCheckboxes`.
- Rename `generateButton` to `createChecklistItem`.
- Rename the `rules` array in `stateEngine.js` to something like `attackRules` for clarity.
