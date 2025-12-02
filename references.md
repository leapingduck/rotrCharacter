# Broken references

- scripts/dom.js:7-10 – `domRef` still points to `#output1`, `#output1-label`, and `#output1-button`, but those elements no longer exist in `index.html`, so the references are always `null`.
- scripts/dom.js:26 – preview IDs are generated with the typo `${id}-ouput`, which leaves nothing named `${id}-output` to target after the rename.
- scripts/stateEngine.js:129-132 – the mutual-exclusion check uses `weapon1`/`weapon2`, but weapon checkboxes are now keyed `GS01`/`GS02`/`WH01`/`WH02`, so the validation never triggers.
- index.html:13 – the `glass-card` class is still on the attack article, but `style.css` no longer defines a `.glass-card` rule, so the intended styling reference is effectively dead.
