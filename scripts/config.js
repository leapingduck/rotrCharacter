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

// remove these bonuses from the rules and add here?
// or weapons update and then a base rule checks for stuff like weapon focus?
export const weapon = {
  critRange: 19,
  damageDice: "2d6",
};

export const macro = {
  attackName: "First Attack",
  attackBonus: 0,
  vitalStrikeDamage: 0,
  damageBase: Math.floor(base.strBonus * 1.5),
  damageBonus: 0,
  damageOther: "",
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

//-----------------------------------------------------------
// Ideally, handle state change would pull from this array and apply 
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
