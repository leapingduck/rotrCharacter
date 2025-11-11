export const base = {
  bab: 14, // Base attack bonus
  strBonus: 6, // Strength modifier
  dexBonus: 2,
};

export const attack = {
  circumstance: [0],
  competence: [0],
  enhancement: [0],
  insight: [0],
  luck: [0],
  morale: [0],
  size: [0],
};

export const damage = {
  enhancement: [0],
  luck: [0],
  morale: [0],
  profane: [0],
  sacred: [0],
};

const weapon = {
  critRange: 19,
  damageDice: '2d6',
};

const flamingWeapon = document.getElementById('flamingWeapon');
const vitalStrike = document.getElementById('vitalStrike');
const chargeAction = document.getElementById('chargeAction');
const output = document.getElementById('output');
const summaryFirst = document.getElementById('summaryFirst');
const effectCheckboxes = document.getElementsByClassName('effectCheckbox');

//-----------------------------------------------------------
// const weaponAbilities = [
//   { name: 'powerAttack', untypedAttack: -2, untypedDamage: 8 },
//   { name: 'furiousFoucs' },
// ];

// const damageDiceProgression = [
//   '1d2',
//   '1d3',
//   '1d4',
//   '1d6',
//   '1d8',
//   '1d10',
//   '2d6',
//   '2d8',
//   '3d6',
//   '3d8',
//   '4d6',
//   '4d8',
//   '6d6',
//   '6d8',
//   '8d6',
//   '8d8',
//   '12d6',
//   '12d8',
//   '16d6',
// ];

// const weaponList = [
//   { name: 'greatsword', damage: '2d6' },
//   { name: 'warhammer', damage: '1d8' },
// ];
