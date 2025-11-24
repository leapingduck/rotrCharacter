import * as config from './config.js';
import { createMacroElement } from './dom.js';

function macroComponents(map, attackNumber) {
  // ### Create Empty Object and calculate variables ###
  let macroParts = {};
  calculateAttack();

  // ### Creates the prefix - should only be used once in the combined macro ###
  let macroPrefix = `&{template:pc} {{type=attackdamage}} {{name= ${
    config.macro.attackName
  }  }} {{attack=1}} {{showchar=[[1]]}} {{atkvs=(Melee vs AC)}} {{dmg1flag=1}} ${
    config.macro.damageOther != '' ? '{{dmg2flag=1}} {{dmg2name=Acid}}' : ''
  } {{charname=Lord Guber}}`;

  // this is not dry at all... figure something out
  const counter = attackNumber > 0 ? `${attackNumber}` : '';

  let CombinedMacroRoll = `{{roll${counter}=[[1d20cs>${
    config.weapon.critRange
  } + ${config.base.bab}[BAB] + ${config.base.strBonus}[Strength] + ${
    config.macro.attackBonus
  }[Buff] + ${map}[MAP] ${
    config.macro.queryToggle ? ' + ?{AttackMod|0}' : ''
  }]]}} {{critconfirm${counter}=[[1d20 + ${config.base.bab}[BAB] + ${
    config.base.strBonus
  }[Strength] + ${config.macro.attackBonus}[Buff]+ ${map}[MAP] ${
    config.macro.queryToggle ? ' + ?{AttackMod|0}' : ''
  } ]]}}`;

  let macroRoll = `{{roll=[[1d20cs>${config.weapon.critRange} + ${
    config.base.bab
  }[BAB] + ${config.base.strBonus}[Strength] + ${
    config.macro.attackBonus
  }[Buff] + ${map}[MAP] ${
    config.macro.queryToggle ? ' + ?{AttackMod|0}' : ''
  }]]}} {{critconfirm=[[1d20 + ${config.base.bab}[BAB] + ${
    config.base.strBonus
  }[Strength] + ${config.macro.attackBonus}[Buff]+ ${map}[MAP] ${
    config.macro.queryToggle ? ' + ?{AttackMod|0}' : ''
  } ]]}}`;

  let macroDamage = `{{damage=1}}{{dmg1flag=1}}{{dmg1=[[${config.weapon.damageDice} ${config.macro.vitalStrikeDamage} + ${config.macro.damageTotal} ]]}} {{dmg1type=Slashing}}{{dmg1crit=[[(${config.weapon.damageDice} + ${config.macro.damageTotal})*2 ${config.macro.vitalStrikeDamage}]]}}`;

  let combinedMacroDamage = `{{roll${counter}dmg1=[[${config.weapon.damageDice} ${config.macro.vitalStrikeDamage} + ${config.macro.damageTotal} ]]}} {{roll${counter}dmg1type=Slashing}}{{roll${counter}dmg1crit=[[(${config.weapon.damageDice} + ${config.macro.damageTotal})*2 ${config.macro.vitalStrikeDamage}]]}}`;

  // if (config.macro.damageOther != '') {
  //   macroDamage += `{{dmg2flag=1}}{{dmg2type=Fire}}{{dmg2=[[${config.macro.damageOther}]]}}{{dmg2crit=[[${config.macro.damageOther}]]}}`;
  // }

  macroParts = {
    prefix: macroPrefix,
    roll: macroRoll,
    damage: macroDamage,
    combinedRoll: CombinedMacroRoll,
    combinedDamage: combinedMacroDamage,
  };

  return macroParts;
}
let macroParts = macroComponents(0, 0);

const macro = macroParts.prefix + macroParts.roll + macroParts.damage;
let combinedMacro =
  macroParts.prefix + macroParts.combinedRoll + macroParts.combinedDamage;
export function macroBuilder(activeAction, haste) {
  createMacroElement(macro, 'First Attack', 'firstAttack');

  if (haste && activeAction === 'fullRoundAttack') {
    let macroParts = macroComponents(0, 1);
    createMacroElement(macro, 'Haste', 'hastedAttack');
    combinedMacro += macroParts.combinedRoll + macroParts.combinedDamage;
    iterativeMacroBuilder(2);
    createMacroElement(combinedMacro, 'Combined', 'multiAttack');
  } else if (activeAction === 'fullRoundAttack') {
    iterativeMacroBuilder(1);
    createMacroElement(combinedMacro, 'Combined', 'multiAttack');
  }
}

function iterativeMacroBuilder(attackNum) {
  // Iterative Attacks - Does not currently apply furious focus correctly.

  macroParts = macroComponents(-5, attackNum);
  const macro5 = macroParts.prefix + macroParts.roll + macroParts.damage;
  console.log(macro5);
  createMacroElement(macro5, 'Second', 'secondAttack');
  combinedMacro += macroParts.combinedRoll + macroParts.combinedDamage;

  macroParts = macroComponents(-10, attackNum + 1);
  const macro10 = macroParts.prefix + macroParts.roll + macroParts.damage;
  console.log(macro10);
  createMacroElement(macro10, 'Third', 'thirdAttack');
  combinedMacro += macroParts.combinedRoll + macroParts.combinedDamage;
}

function calculateAttack() {
  const dmg = config.damage;
  const atk = config.attack;
  const mac = config.macro;

  let untypedDamageBonus = dmg.untyped.reduce((acc, a) => acc + a, 0);
  mac.damageBase = Math.floor(config.base.strBonus * 1.5);
  mac.damageBonus =
    Math.max(...dmg.enhancement) +
    Math.max(...dmg.luck) +
    Math.max(...dmg.morale) +
    Math.max(...dmg.item) +
    Math.max(...dmg.profane) +
    Math.max(...dmg.sacred) +
    untypedDamageBonus;

  mac.damageTotal = mac.damageBase + mac.damageBonus;

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

  mac.attackTotal = config.base.bab + config.base.strBonus + mac.attackBonus;
}

// reference - multiattack
// &{template:pc}{{type=attackdamage}}{{name=FirstAttack}}{{attack=1}}{{showchar=[[1]]}}{{atkvs=(MeleevsAC)}}{{charname=LordGuber}}{{roll=[[1d20cs>19+14[BAB]+6[Strength]+0[Buff]+0[MAP]]]}}{{critconfirm=[[1d20+14[BAB]+6[Strength]+0[Buff]+0[MAP]]]}}{{rolldmg1=[[2d6+9]]}}{{rolldmg1type=Slashing}}{{rolldmg1crit=[[(2d6+9)*2]]}}{{roll1=[[1d20cs>19+14[BAB]+6[Strength]+0[Buff]+-5[MAP]]]}}{{critconfirm1=[[1d20+14[BAB]+6[Strength]+0[Buff]+-5[MAP]]]}}{{roll1dmg1=[[2d6+9]]}}{{roll1dmg1type=Slashing}}{{roll1dmg1crit=[[(2d6+9)*2]]}}{{roll2=[[1d20cs>19+14[BAB]+6[Strength]+0[Buff]+-10[MAP]]]}}{{critconfirm2=[[1d20+14[BAB]+6[Strength]+0[Buff]+-10[MAP]]]}}{{roll2dmg1=[[2d6+9]]}}{{roll2dmg1type=Slashing}}{{roll2dmg1crit=[[(2d6+9)*2]]}}

// reference single attack
// &{template:pc}{{type=attackdamage}}{{name=FirstAttack}}{{attack=1}}{{dmg1flag=1}}{{showchar=[[1]]}}{{atkvs=(MeleevsAC)}}{{charname=LordGuber}}{{roll=[[1d20cs>19+14[BAB]+6[Strength]+0[Buff]+0[MAP]]]}}{{critconfirm=[[1d20+14[BAB]+6[Strength]+0[Buff]+0[MAP]]]}}{{dmg1=[[2d6+9]]}}{{dmg1type=Slashing}}{{rolldmg1crit=[[(2d6+9)*2]]}}
