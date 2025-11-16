import { handleStateChange } from './stateEngine.js';
import { buffs, weaponEffects, weapons } from './config.js';

// References -----------------------------------------------------
export const stateCheckboxes =
  document.getElementsByClassName('state-checkbox');

export const domRef = {
  output1: document.getElementById('output1'),
  outputLabel1: document.getElementById('output1-label'),
  outputButton1: document.querySelector('#output1-button'),
};

// DOM ____________________________________________________________

export function pageLoad() {
  generateWeaponList();
  generateBuffList();
}

export function createMacroOutput(macro, name) {
  const row = document.createElement('div');
  row.className = 'flex-row clear-item';

  const preview = document.createElement('preview');
  preview.id = `${name}-ouput`;
  preview.className = 'preview';
  preview.appendChild(document.createTextNode(macro));

  const macroOutput = document.querySelector('#macroOutput');
  row.appendChild(preview);

  const button = document.createElement('button');
  button.className = 'clipboard-button';
  button.appendChild(document.createTextNode('First Attack'));
  button.addEventListener('click', () => {
    navigator.clipboard.writeText(macro);
  });
  row.appendChild(button);

  macroOutput.appendChild(row);
}

export function clearUI() {
  const clearItems = document.querySelectorAll('.clear-item');
  clearItems.forEach((item) => {
    item.remove();
  });
}
// Check Lists ----------------------------------------------------

function generateWeaponList() {
  const weaponContainer = document.querySelector('#weaponList');

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
    //error handling
    const selectedEffect = weaponEffects.find((e) => e.id == effect);
    const li = generateButton(selectedEffect.id, selectedEffect.name);
    weaponEffectsContainer.appendChild(li);
  });
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
    } else {
      console.log('error');
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
