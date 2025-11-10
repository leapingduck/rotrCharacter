console.log('Test');

const attack = { advantage: false, power: false, reckless: false };
const defense = {
  dodge: false,
  shield: false,
  cover: false,
  conc: false,
};

// Elements
const atkPreview = document.getElementById('atk-preview');
const defPreview = document.getElementById('def-preview');

// Utility: update computed previews
function renderAttack() {
  const adv = attack.advantage ? ' (adv)' : '';
  atkPreview.textContent = `To-hit bonus: +X${adv}`; // Replace with your math
}
function renderDefense() {
  const ac = defense.shield ? 'Base+Shield' : 'Base';
  defPreview.textContent = `AC: ${ac}`;
}

// Wire inputs
const bind = (id, obj, key, onChange) => {
  const el = document.getElementById(id);
  el.addEventListener('change', () => {
    obj[key] = el.checked;
    onChange();
  });
};

bind('atk-advantage', attack, 'advantage', renderAttack);
bind('atk-power', attack, 'power', renderAttack);
bind('atk-reckless', attack, 'reckless', renderAttack);

bind('def-dodge', defense, 'dodge', renderDefense);
bind('def-shield', defense, 'shield', renderDefense);
bind('def-cover', defense, 'cover', renderDefense);
bind('def-conc', defense, 'conc', renderDefense);

// Initial paint
renderAttack();
renderDefense();

// Theme toggle: prefers-color-scheme first, then manual override
const themeBtn = document.getElementById('themeBtn');
const isDark = () => document.documentElement.dataset.theme === 'dark';

const media = window.matchMedia('(prefers-color-scheme: dark)');
function applySystemTheme(e) {
  if (!localStorage.getItem('theme')) {
    document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    syncColors();
  }
}
media.addEventListener('change', applySystemTheme);

function syncColors() {
  // We implement theme by toggling a data attribute and mirroring it with class
  const theme =
    document.documentElement.dataset.theme ||
    (media.matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

// Seed from system on load if no saved preference
if (!localStorage.getItem('theme')) {
  document.documentElement.dataset.theme = media.matches ? 'dark' : 'light';
  syncColors();
} else {
  document.documentElement.dataset.theme = localStorage.getItem('theme');
  syncColors();
}

themeBtn.addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  syncColors();
  themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
});
