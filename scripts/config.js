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
  item: [0],
  untyped: [0],
};

export const damage = {
  enhancement: [0],
  luck: [0],
  morale: [0],
  item: [0],
  profane: [0],
  sacred: [0],
  untyped: [0],
};

// this might become activeWeapon. weapon.js will update this before calculateMacro runs
export const weapon = {
  critRange: 19,
  damageDice: '2d6',
};

export const macro = {
  attackName: 'First Attack',
  attackBonus: 0,
  attackTotal: 0,
  vitalStrikeDamage: 0,
  damageBase: Math.floor(base.strBonus * 1.5),
  damageBonus: 0,
  damageOther: '',
  damageTotal: 0,
};

export function calculateAttack() {
  let untypedAttackBonus = attack.untyped.reduce(
    (partialSum, a) => partialSum + a,
    0
  );

  let untypedDamageBonus = damage.untyped.reduce(
    (partialSum, a) => partialSum + a,
    0
  );

  macro.damageBonus =
    Math.max(...damage.enhancement) +
    Math.max(...damage.luck) +
    Math.max(...damage.morale) +
    Math.max(...damage.item) +
    Math.max(...damage.profane) +
    Math.max(...damage.sacred) +
    untypedDamageBonus;

  macro.damageTotal = macro.damageBase + macro.damageBonus;

  macro.attackBonus =
    Math.max(...attack.circumstance) +
    Math.max(...attack.competence) +
    Math.max(...attack.enhancement) +
    Math.max(...attack.insight) +
    Math.max(...attack.luck) +
    Math.max(...attack.morale) +
    Math.max(...attack.size) +
    Math.max(...attack.item) +
    untypedAttackBonus;

  macro.attackTotal = base.bab + base.strBonus + macro.attackBonus;
}

export const buffs = [
  { name: 'Power Attack', id: 'powerAttack', type: 'attack' },
  { name: 'Furious Focus', id: 'furiousFocus', type: 'attack' },
  { name: 'Banner', id: 'banner', type: 'attack' },
  { name: 'Challenged Foe', id: 'challenge', type: 'attack' },
  { name: 'Enlarge', id: 'enlarge', type: 'attack' },
  { name: 'Haste', id: 'haste', type: 'attack' },
  { name: 'Heroism', id: 'heroism', type: 'attack' },
  { name: 'Second Attack', id: 'secondAttack', type: 'action' },
  { name: 'Third Attack', id: 'thirdAttack', type: 'action' },
  { name: 'Charge', id: 'chargeAction', type: 'action' },
  { name: 'Vital Strike', id: 'vitalStrike', type: 'action' },
  { name: 'Full Round Attack', id: 'fullRoundAttack', type: 'action' },
  { name: 'Fight Defensively', id: 'fightDefensively', type: 'action' },
];

export const weaponEffects = [
  { name: 'Flaming Weapon', id: 'flamingWeapon', type: 'weapon' },
  { name: 'Keen Weapon', id: 'keenWeapon', type: 'weapon' },
  { name: 'Bane', id: 'baneWeapon', type: 'weapon' },
  { name: 'Impact Weapon', id: 'impactWeapon', type: 'weapon' },
  { name: 'Weapon Focus', id: 'focusWeapon', type: 'weapon' },
];

export const weapons = [
  {
    name: 'Flaming Giant Bane Greatsword (+1)',
    id: 'GS01',
    type: 'greatsword',
    itemBonus: 1,
    effectIDs: ['flamingWeapon', 'keenWeapon', 'baneWeapon', 'focusWeapon'],
  },
  {
    name: 'Impact Greatsword (+1)',
    id: 'GS02',
    type: 'greatsword',
    itemBonus: 1,
    effectIDs: ['impactWeapon', 'focusWeapon'],
  },
  {
    name: 'Adamantine Warhammer (+1)',
    id: 'WH01',
    type: 'warhammer',
    itemBonus: 1,
    effectIDs: [],
  },
  {
    name: 'Gauntlet',
    id: 'WH02',
    type: 'warhammer',
    itemBonus: 1,
    effectIDs: [],
  },
];

export const weaponTypes = [
  {
    name: 'greatsword',
    id: 'GS',
    damageDice: '2d6',
    damageType: 'slashing',
    hands: 2,
    critRange: 19,
    critMultiplier: 2,
  },
  {
    name: 'warhammer',
    id: 'WH',
    damageDice: '1d8',
    damageType: 'bludgeoning',
    hands: [1, 2],
    critRange: 20,
    critMultiplier: 3,
  },
];

export const damageDiceProgression = [
  '1d2',
  '1d3',
  '1d4',
  '1d6',
  '1d8',
  '1d10',
  '2d6',
  '2d8',
  '3d6',
  '3d8',
  '4d6',
  '4d8',
  '6d6',
  '6d8',
  '8d6',
  '8d8',
  '12d6',
  '12d8',
  '16d6',
];
