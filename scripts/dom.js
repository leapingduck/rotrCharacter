import { handleStateChange } from './stateEngine.js';
import { actionTypes, buffs, weaponEffects, weapons } from './config.js';

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
  generateActionList();
}

export function createMacroElement(macro, name, id) {
  const row = document.createElement('div');
  row.className = 'flex-row clear-item';

  const preview = document.createElement('preview');
  preview.id = `${id}-ouput`;
  preview.className = 'preview';
  preview.appendChild(document.createTextNode(macro));

  const macroOutput = document.querySelector('#macroOutput');
  row.appendChild(preview);

  const button = document.createElement('button');
  button.className = 'clipboard-button';
  button.appendChild(document.createTextNode(name));
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
// Check Lists ----------------------------------------------------

function generateWeaponList() {
  //
  const weaponContainer = document.querySelector('#weaponList');

  weapons.forEach((weapon) => {
    const li = generateButton(weapon.id, weapon.name);
    weaponContainer.appendChild(li);
  });
}

function generateActionList() {
  const actionContainer = document.querySelector('#attackActions');

  actionTypes.forEach((action) => {
    const li = generateButton(action.id, action.name);
    actionContainer.appendChild(li);
  });
}

function generateBuffList() {
  const effectContainer = document.querySelector('#attackBuffs');

  buffs.forEach((buff) => {
    const li = generateButton(buff.id, buff.name);
    effectContainer.appendChild(li);
  });
}

export function generateWeaponEffects(selectedWeapon) {
  const container = document.querySelector('#weaponEffectContainer');
  if (!container) return;

  container.innerHTML = '';

  const heading = document.createElement('h3');
  heading.appendChild(document.createTextNode('Weapon Effects'));
  container.appendChild(heading);

  const ul = document.createElement('ul');
  ul.id = 'weaponEffectsList';
  container.appendChild(ul);

  const activeWeapon = weapons.find((weapon) => weapon.id == selectedWeapon);
  if (!activeWeapon || !Array.isArray(activeWeapon.effectIDs)) {
    return;
  }

  activeWeapon.effectIDs.forEach((effect) => {
    const selectedEffect = weaponEffects.find((e) => e.id == effect);
    if (!selectedEffect) return;

    const li = generateButton(selectedEffect.id, selectedEffect.name);
    ul.appendChild(li);
  });
}
