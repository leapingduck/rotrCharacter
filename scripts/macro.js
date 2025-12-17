import * as config from "./config.js";
import { createMacroElement } from "./dom.js";

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

function macroComponents(map, attackNumber) {
  // ### Create Empty Object and calculate variables ###
  let macroParts = {};
  calculateBonuses();

  // ### Creates the prefix - should only be used once in the combined macro ###
  let macroPrefix = `&{template:pc} {{type=attackdamage}} {{name= ${
    config.macroDefaults.attackName
  }  }} {{attack=1}} {{showchar=[[1]]}} {{atkvs=(Melee vs AC)}} {{dmg1flag=1}} ${
    config.macroDefaults.damageOther != ""
      ? "{{dmg2flag=1}} {{dmg2name=Acid}}"
      : ""
  } {{charname=Lord Guber}}`;

  let macroRoll = `{{roll=[[1d20cs>${config.activeWeapon.critRange} + ${
    config.baseStats.bab
  }[BAB] + ${config.baseStats.strBonus}[Strength] + ${
    config.macroDefaults.attackBonus
  }[Buff] + ${map}[MAP] ${
    config.macroDefaults.queryToggle ? " + ?{AttackMod|0}" : ""
  }]]}} {{critconfirm=[[1d20 + ${config.baseStats.bab}[BAB] + ${
    config.baseStats.strBonus
  }[Strength] + ${config.macroDefaults.attackBonus}[Buff]+ ${map}[MAP] ${
    config.macroDefaults.queryToggle ? " + ?{AttackMod|0}" : ""
  } ]]}}`;

  let macroDamage = `{{damage=1}}{{dmg1flag=1}}{{dmg1=[[${config.activeWeapon.damageDice} ${config.macroDefaults.vitalStrikeDamage} + ${config.macroDefaults.damageTotal} ]]}} {{dmg1type=Slashing}}{{dmg1crit=[[(${config.activeWeapon.damageDice} + ${config.macroDefaults.damageTotal})*2 ${config.macroDefaults.vitalStrikeDamage}]]}}`;

  // if (config.macro.damageOther != '') {
  //   macroDamage += `{{dmg2flag=1}}{{dmg2type=Fire}}{{dmg2=[[${config.macro.damageOther}]]}}{{dmg2crit=[[${config.macro.damageOther}]]}}`;
  // }

  macroParts = {
    prefix: macroPrefix,
    roll: macroRoll,
    damage: macroDamage
  };

  return macroParts;
}

// ##################################################
// ####          Multi Attack Calculator         ####
// ####   Sets the number of attacks per round   ####
// ##################################################

function handleAttackNumber(activeAction, haste) {
  let attacks = [
    { attackNumber: 1, attackName: "First Attack", multiAttackPenalty: 0 },
  ];
  let counter = 1;

  if (haste && activeAction == "fullRoundAttack") {
    counter += 1;
    attacks.push({
      attackNumber: counter,
      attackName: "Hasted Attack",
      multiAttackPenalty: 0,
    });
  }
  // add number of extra attacks to be stored in rules/config. Currently hardcoded here
  if (activeAction == "fullRoundAttack") {
    counter += 1;
    attacks.push({
      attackNumber: counter,
      attackName: "Second Extra Attack",
      multiAttackPenalty: -5,
    });

    counter += 1;
    attacks.push({
      attackNumber: counter,
      attackName: "Third Extra Attack",
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
// ####          Handle Macro (Export )          ####
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
  if (attacks.length > 1){
    createMacroElement(macroAccumulator, 'Full Attack', 'fullattack')
  }
}