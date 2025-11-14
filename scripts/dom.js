import { handleStateChange } from './stateEngine.js';
import { buffs, weapons } from './config.js';

// References -----------------------------------------------------
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
    const li = document.createElement('li');
    li.className = 'weapon--item';

    const label = document.createElement('label');
    label.className = 'checklist-label';
    label.htmlFor = weapon.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'state-checkbox';
    checkbox.id = weapon.id;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(weapon.name));

    // doesn't run if empty array. Probably what I want?
    weapon.effectIDs.forEach((effect) => generateWeaponEffects(weapon.id));

    li.appendChild(label);
    weaponContainer.appendChild(li);
  });
}

function generateBuffList() {
  const effectContainer = document.querySelector('#attackBuffs');
  const actionContainer = document.querySelector('#attackActions');
  const weaponEffectsContainer = document.querySelector('#weaponEffectsList');

  buffs.forEach((buff) => {
    const li = document.createElement('li');
    li.className = 'buffItem';

    const label = document.createElement('label');
    label.className = 'checklist-label';
    label.htmlFor = buff.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'state-checkbox';
    checkbox.id = buff.id;
    checkbox.addEventListener('change', handleStateChange);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(buff.name));

    li.appendChild(label);
    if (buff.type == 'attack') {
      effectContainer.appendChild(li);
    } else if (buff.type == 'action') {
      actionContainer.appendChild(li);
    } else if (buff.type == 'weapon') {
      weaponEffectsContainer.appendChild(li);
    }
  });
}

function generateWeaponEffects(selectedWeapon) {
  const activeWeapon = weapons.find((weapon) => weapon.id == selectedWeapon);
  console.log(
    `seaching for weapon ${activeWeapon.name} and making effects available`
  );
}
