export const baseStats = {
  bab: 16, // Base attack bonus
  strBonus: 7, // Strength modifier
  dexBonus: 5,
  conBonus: 0,
  intBonus: 0,
  wisBonus: 0,
  chaBonus: 0,
  armorClassBase: 10,
};

export const attackBonuses = {
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

export const damageBonuses = {
  enhancement: [0],
  luck: [0],
  morale: [0],
  insight: [0],
  item: [0],
  profane: [0],
  sacred: [0],
  untyped: [0],
};

export const armorBonuses = {
  armor: [0],
  deflection: [0],
  dexterity: [0],
  dodge: [0],
  natural: [0],
  shield: [0],
  size: [0],
  untyped: [0],
};

// this might become activeWeapon. weapon.js will update this before calculateMacro runs
export const activeWeapon = {
  critRange: 19,
  damageDice: "2d6",
  diceIndex: 0,
};

export const macroDefaults = {
  attackName: "First Attack",
  attackBonus: 0,
  attackTotal: 0,
  vitalStrikeDamage: "",
  damageBase: Math.floor(baseStats.strBonus * 1.5),
  damageBonus: 0,
  damageOther: "",
  damageTotal: 0,
  queryToggle: 0,
};

export const damageDiceProgression = [
  "1d2",
  "1d3",
  "1d4",
  "1d6",
  "1d8",
  "1d10",
  "2d6",
  "2d8",
  "3d6",
  "3d8",
  "4d6",
  "4d8",
  "6d6",
  "6d8",
  "8d6",
  "8d8",
  "12d6",
  "12d8",
  "16d6",
];

// Lists - Could be added to a db in later version
export const buffs = [
  { name: "Power Attack", id: "powerAttack", type: "attack" },
  { name: "Furious Focus", id: "furiousFocus", type: "attack" },
  { name: "Banner", id: "banner", type: "attack" },
  { name: "Challenged Foe", id: "challenge", type: "attack" },
  { name: "Enlarge", id: "enlarge", type: "attack" },
  { name: "Haste", id: "haste", type: "attack" },
  { name: "Heroism", id: "heroism", type: "attack" },
  { name: "Smite Chaos", id: "smiteChaos", type: "attack" },
  { name: "Mark of Wrath", id: "markWrath", type: "attack" },
];

export const actionTypes = [
  {
    name: "Charge",
    id: "chargeAction",
    type: "action",
  },
  {
    name: "Vital Strike",
    id: "vitalStrike",
    type: "action",
  },
  {
    name: "Full Round Attack",
    id: "fullRoundAttack",
    type: "action",
  },
  {
    name: "Fight Defensively",
    id: "fightDefensively",
    type: "action",
  },
];

export const weaponEffects = [
  { name: "Flaming Weapon", id: "flamingWeapon", type: "weapon" },
  { name: "Keen Weapon", id: "keenWeapon", type: "weapon" },
  { name: "Bane", id: "baneWeapon", type: "weapon" },
  { name: "Impact Weapon", id: "impactWeapon", type: "weapon" },
  { name: "Weapon Focus", id: "focusWeapon", type: "weapon" },
  { name: "Runeforged Weapon", id: "runeforgedWeapon", type: "weapon" },
];

export const spellEffects = [
  // Add Dropdown for some things?
  { name: "Keen Weapon", id: "", type: "", source: "Billy - Rune Something" },
];

export const weapons = [
  {
    name: "Impact Greatsword (+1)",
    id: "GS02",
    type: "greatsword",
    itemBonus: 2,
    effectIDs: [
      "impactWeapon",
      "focusWeapon",
      "keenWeapon",
      "runeforgedWeapon",
    ],
  },
  {
    name: "Gauntlet",
    id: "WH02",
    type: "warhammer",
    itemBonus: 1,
    effectIDs: [],
  },
];

export const weaponBaseStats = [
  {
    name: "greatsword",
    id: "GS",
    damageDice: "2d6",
    damageType: "slashing",
    hands: 2,
    critRange: 19,
    critMultiplier: 2,
  },
  {
    name: "warhammer",
    id: "WH",
    damageDice: "1d8",
    damageType: "bludgeoning",
    hands: [1, 2],
    critRange: 20,
    critMultiplier: 3,
  },
];

const loadouts = [
  {
    name: "Standard Vital Strike",
    true: ["powerAttack", "furiousFocus", "keenWeapon"],
  },
];
