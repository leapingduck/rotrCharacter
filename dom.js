import { handleStateChange } from './stateEngine.js';
import { buffs, weapons } from './config.js';

// in your loop

export function pageLoad() {
  generateBuffList();
  generateWeaponList();
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

export const stateCheckboxes =
  document.getElementsByClassName('state-checkbox');

export const domRef = {
  output1: document.getElementById('output1'),
  outputLabel1: document.getElementById('output1-label'),
  outputButton1: document.querySelector('#output1-button'),
  // output2: document.getElementById("output2"),
  // outputLabel2: document.getElementById("output2-label")
  // output3: document.getElementById("output3"),
  // outputLabel3: document.getElementById("output3-label")
  // output4: document.getElementById("output4"),
  // outputLabel4: document.getElementById("output4-label")
  // output5: document.getElementById("output5"),
  // outputLabel5: document.getElementById("output5-label")
};
