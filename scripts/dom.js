import { handleStateChange } from './stateEngine.js';
import { buffs, weapon, weapons } from './config.js';

// References -----------------------------------------------------
// newly created checkboxes are not in here so
export const stateCheckboxes =
  document.getElementsByClassName('state-checkbox');

export const domRef = {
  output1: document.getElementById('output1'),
  outputLabel1: document.getElementById('output1-label'),
  outputButton1: document.querySelector('#output1-button'),
};

// DOM Management -------------------------------------------------

export function pageLoad() {
  generateWeaponList();
  generateBuffList();
}

function generateWeaponList() {
  const weaponContainer = document.querySelector('#weaponList');
  const weaponEffectsContainer = document.querySelector('#weaponEffects');

  weapons.forEach((weapon) => {
    const li = generateButton(weapon.id, weapon.name);
    weaponContainer.appendChild(li);
  });
}

export function generateWeaponEffects(selectedWeapon) {
  const weaponEffectsContainer = document.querySelector('#weaponEffectsList');
  // need to validate weapon is only one selection
  const activeWeapon = weapons.find((weapon) => weapon.id == selectedWeapon);
  activeWeapon.effectIDs.forEach((effect) => {
    const effectID = buffs.find((e) => e.id == effect).id;
    const effectName = buffs.find((e) => e.id == effect).name;
    const li = generateButton(effectID, effectName);
    weaponEffectsContainer.appendChild(li);
  });
  console.log(stateCheckboxes);
}

function generateBuffList() {
  const effectContainer = document.querySelector('#attackBuffs');
  const actionContainer = document.querySelector('#attackActions');

  buffs.forEach((buff) => {
    const li = generateButton(buff.id, buff.name);
    if (buff.type == 'attack') {
      effectContainer.appendChild(li);
    } else if (buff.type == 'action') {
      actionContainer.appendChild(li);
    }
  });
}

export function generateButton(id, name) {
  const li = document.createElement('li');
  li.className = 'buffItem';

  const label = document.createElement('label');
  label.className = 'checklist-label';
  label.htmlFor = id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'state-checkbox';
  checkbox.id = id;
  checkbox.addEventListener('change', handleStateChange);

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(name));

  li.appendChild(label);

  return li;
}
