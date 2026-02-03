import * as config from './config.js';
import { createMacroElement } from './dom.js';

let macroParts = macroComponents(0, 0);
let macroAccumulator = macroParts.prefix;

const macro = macroParts.prefix + macroParts.roll + macroParts.damage;
let combinedMacro =
  macroParts.prefix + macroParts.combinedRoll + macroParts.combinedDamage;

// ##################################################
// ####            Calculate Bonuses             ####
// ####     based on changes from state list     ####
// ##################################################

function calculateBonuses() {
  const dmg = config.damageBonuses;
  const atk = config.attackBonuses;
  const mac = config.macroDefaults;

  // Damage Calculation  - Goes to [Buff] in damage sections of macro
  let untypedDamageBonus = dmg.untyped.reduce((acc, a) => acc + a, 0);
  mac.damageBase = Math.floor(config.baseStats.strBonus * 1.5);
  mac.damageBonus =
    Math.max(...dmg.enhancement) +
    Math.max(...dmg.luck) +
    Math.max(...dmg.morale) +
    Math.max(...dmg.insight) +
    Math.max(...dmg.item) +
    Math.max(...dmg.profane) +
    Math.max(...dmg.sacred) +
    untypedDamageBonus;

  mac.damageTotal = mac.damageBase + mac.damageBonus;

  // Attack Calculation - Goes to [Buff] in attack and crit sections of macro
  let untypedAttackBonus = atk.untyped.reduce((acc, a) => acc + a, 0);

  mac.attackBonus =
    Math.max(...atk.circumstance) +
    Math.max(...atk.competence) +
    Math.max(...atk.enhancement) +
    Math.max(...atk.insight) +
    Math.max(...atk.luck) +
    Math.max(...atk.morale) +
    Math.max(...atk.size) +
    Math.max(...atk.item) +
    untypedAttackBonus;

  mac.attackTotal =
    config.baseStats.bab + config.baseStats.strBonus + mac.attackBonus;
}

// ##################################################
// ####          Build Macro Components          ####
// ####             IGNORE THE MESS              ####
// ##################################################

// Don't love the nested - chad fixed it in the middle of a session and I need to rebuild.

function macroComponents(map, attackNumber) {
  let macroParts = {};
  calculateBonuses();

  const isFirst = attackNumber === 1;

  // Rolls:
  // attackNumber==1 => {{roll=...}} {{critconfirm=...}}
  // attackNumber==2 => {{roll1=...}} {{critconfirm1=...}}
  // attackNumber==3 => {{roll2=...}} {{critconfirm2=...}}
  const rollSuffix = isFirst ? '' : String(attackNumber - 1); // "", "1", "2", ...

  // Damage keys:
  // attackNumber==1 => {{dmg1=...}} {{dmg1crit=...}}
  // attackNumber==2 => {{roll1dmg1=...}} {{roll1dmg1crit=...}}
  // attackNumber==3 => {{roll2dmg1=...}} {{roll2dmg1crit=...}}
  const dmgPrefix = isFirst ? '' : `roll${attackNumber - 1}`; // "", "roll1", "roll2", ...

  // Normalize optional additive chunks so Roll20 math stays valid
  function normalizeAdditiveChunk(chunk) {
    const s = (chunk ?? '').toString().trim();
    if (!s) return '';
    if (/^[+\-*/]/.test(s)) return ` ${s}`; // already has operator
    return ` + ${s}`; // assume additive
  }

  // Safer "always add" chunk (useful when you already inserted a "+")
  function normalizeBareNumber(chunk) {
    const s = (chunk ?? '').toString().trim();
    if (!s) return '0';
    // If they pass "+10" or "-2", keep it as-is but without leading "+"
    // so we don't generate "+ +10".
    return s.replace(/^\+\s*/, '');
  }

  const vitalAdd = normalizeAdditiveChunk(
    config.macroDefaults.vitalStrikeDamage,
  );

  const baseDice = config.activeWeapon.damageDice; // e.g. "2d6"
  const baseBonus = normalizeBareNumber(config.macroDefaults.damageTotal); // e.g. "9" (or "+9")

  const dmg1Expr = `${baseDice}${vitalAdd} + ${baseBonus}`;
  const dmg1CritExpr = `(${baseDice} + ${baseBonus})*2${vitalAdd}`;

  const hasDmg2 =
    (config.macroDefaults.damageOther ?? '').toString().trim() !== '';

  // Prefix (use once when combining the whole macro)
  // Important: damage=1 and dmg1flag=1 are what makes the template display damage.
  const macroPrefix =
    `&{template:pc}` +
    ` {{type=attackdamage}}` +
    ` {{name=${config.macroDefaults.attackName}}}` +
    ` {{attack=1}}` +
    ` {{showchar=[[1]]}}` +
    ` {{atkvs=(Melee vs AC)}}` +
    ` {{charname=Lord Guber}}` +
    ` {{damage=1}}` +
    ` {{dmg1flag=1}}` +
    (hasDmg2 ? ` {{dmg2flag=1}} {{dmg2name=Acid}}` : ``);

  const macroRoll =
    ` {{roll${rollSuffix}=[[1d20cs>${config.activeWeapon.critRange}` +
    ` + ${config.baseStats.bab}[BAB]` +
    ` + ${config.baseStats.strBonus}[Strength]` +
    ` + ${config.macroDefaults.attackBonus}[Buff]` +
    ` + ${map}[MAP]` +
    (config.macroDefaults.queryToggle ? ` + ?{AttackMod|0}` : ``) +
    `]]}}` +
    ` {{critconfirm${rollSuffix}=[[1d20` +
    ` + ${config.baseStats.bab}[BAB]` +
    ` + ${config.baseStats.strBonus}[Strength]` +
    ` + ${config.macroDefaults.attackBonus}[Buff]` +
    ` + ${map}[MAP]` +
    (config.macroDefaults.queryToggle ? ` + ?{AttackMod|0}` : ``) +
    `]]}}`;

  // For attack 1, this produces: {{dmg1=...}} {{dmg1type=...}} {{dmg1crit=...}}
  // For attack 2+, this produces: {{roll1dmg1=...}} {{roll1dmg1type=...}} {{roll1dmg1crit=...}}
  const macroDamage =
    ` {{${dmgPrefix}dmg1=[[${dmg1Expr}]]}}` +
    ` {{${dmgPrefix}dmg1type=Slashing}}` +
    ` {{${dmgPrefix}dmg1crit=[[${dmg1CritExpr}]]}}`;

  macroParts = {
    prefix: macroPrefix,
    roll: macroRoll,
    damage: macroDamage,
  };

  return macroParts;
}

// ##################################################
// ####          Multi Attack Calculator         ####
// ####   Sets the number of attacks per round   ####
// ##################################################

function handleAttackNumber(activeAction, haste) {
  let attacks = [
    { attackNumber: 1, attackName: 'First Attack', multiAttackPenalty: 0 },
  ];
  let counter = 1;

  if (haste && activeAction == 'fullRoundAttack') {
    counter += 1;
    attacks.push({
      attackNumber: counter,
      attackName: 'Hasted Attack',
      multiAttackPenalty: 0,
    });
  }
  // add number of extra attacks to be stored in rules/config. Currently hardcoded here
  if (activeAction == 'fullRoundAttack') {
    counter += 1;
    attacks.push({
      attackNumber: counter,
      attackName: 'Second Extra Attack',
      multiAttackPenalty: -5,
    });

    counter += 1;
    attacks.push({
      attackNumber: counter,
      attackName: 'Third Extra Attack',
      multiAttackPenalty: -10,
    });

    counter += 1;
    attacks.push({
      attackNumber: counter,
      attackName: 'Fourth Extra Attack',
      multiAttackPenalty: -10,
    });
  }

  return attacks;
}

// ##################################################
// ####               Macro Builder              ####
// ####  Creates a single macro and adds to DOM  ####
// ####  Yes these comment blocks are excessive  ####
// ##################################################

function macroBuilder(_attackNumber, _attackName, _map) {
  // should attacknumber be 0 for all of the individual macros?
  // only iterative attacks need attack number?
  const baseMacroParts = macroComponents(_map, _attackNumber);
  const macro =
    baseMacroParts.prefix + baseMacroParts.roll + baseMacroParts.damage;

  createMacroElement(macro, _attackName, `attack${_attackNumber}`);
}

// ##################################################
// ####          Combined Macro Builder          ####
// ####    Combines all attacks into one macro   ####
// ##################################################

function macroCombiner(_attackNumber, _map) {
  const combinedMacroParts = macroComponents(_map, _attackNumber);
  macroAccumulator += combinedMacroParts.roll;
  macroAccumulator += combinedMacroParts.damage;
}

// ##################################################
// ####           Handle Macro (Export)          ####
// ####    Called from outside to get started    ####
// ##################################################

export function handleMacro(activeAction, haste) {
  const attacks = handleAttackNumber(activeAction, haste);
  macroAccumulator = macroParts.prefix;
  attacks.forEach((a) => {
    macroBuilder(a.attackNumber, a.attackName, a.multiAttackPenalty);
    if (attacks.length > 1) {
      macroCombiner(a.attackNumber, a.multiAttackPenalty);
    }
  });
  if (attacks.length > 1) {
    createMacroElement(macroAccumulator, 'Full Attack', 'fullattack');
  }

  console.log(
    'config.attackBonuses.circumstance',
    config.attackBonuses.circumstance,
  );
  console.log(
    'config.attackBonuses.competence',
    config.attackBonuses.competence,
  );
  console.log(
    'config.attackBonuses.enhancement',
    config.attackBonuses.enhancement,
  );
  console.log('config.attackBonuses.insight', config.attackBonuses.insight);
  console.log('config.attackBonuses.luck', config.attackBonuses.luck);
  console.log('config.attackBonuses.morale', config.attackBonuses.morale);
  console.log('config.attackBonuses.size', config.attackBonuses.size);
  console.log('config.attackBonuses.item', config.attackBonuses.item);
  console.log('config.attackBonuses.untyped', config.attackBonuses.untyped);

  console.log(
    'config.damageBonuses.enhancement',
    config.damageBonuses.enhancement,
  );
  console.log('config.damageBonuses.luck', config.damageBonuses.luck);
  console.log('config.damageBonuses.morale', config.damageBonuses.morale);
  console.log('config.damageBonuses.insight', config.damageBonuses.insight);
  console.log('config.damageBonuses.item', config.damageBonuses.item);
  console.log('config.damageBonuses.profane', config.damageBonuses.profane);
  console.log('config.damageBonuses.sacred', config.damageBonuses.sacred);
  console.log('config.damageBonuses.untyped', config.damageBonuses.untyped);
}
