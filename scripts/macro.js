import * as config from './config.js';
import { createMacroElement } from './dom.js';

function macroComponents(map, attackNumber) {
  let macroParts = {};
  calculateAttack();
  let macroPrefix = `&{template:pc}{{name=${config.macro.attackName}}}{{type=attackdamage}}{{showchar=1}}{{charname=Lord Guber}}{{attack=1}}{{atkvs=Melee+STR vs AC}}`;
  // implement adding queries later on
  // let macroQuery = ' + ?{AttackMod|0}'
  //${attackNumber > 1 ? attackNumber : ''}

  // this is close. rolls all three dice but no damage currently. Need to do similar thing for damage roll iterations.
  // this also breaks the individual macros. Roll2 won't work if it is rolled alone.
  const rollKey = attackNumber > 1 ? `roll${attackNumber}` : 'roll';

  let macroRoll = `{{${rollKey}=[[1d20cs>${config.weapon.critRange} + ${config.base.bab}[BAB] + ${config.base.strBonus}[Strength] + ${config.macro.attackBonus}[Buff] + ${map}[MAP]]]}} {{critconfirm=[[1d20 + ${config.base.bab}[BAB] + ${config.base.strBonus}[Strength] + ${config.macro.attackBonus}[Buff]+ ${map}[MAP]]]}}`;

  let macroDamage = `{{damage=1}} {{dmg1flag=1}} {{dmg1=[[${config.weapon.damageDice} ${config.macro.vitalStrikeDamage} + ${config.macro.damageTotal} ]]}} {{dmg1type=Slashing}}{{dmg1crit=[[(${config.weapon.damageDice} + ${config.macro.damageTotal})*2 ${config.macro.vitalStrikeDamage}]]}}`;
  if (config.macro.damageOther != '') {
    macroDamage += `{{dmg2flag=1}}{{dmg2type=Fire}}{{dmg2=[[${config.macro.damageOther}]]}}{{dmg2crit=[[${config.macro.damageOther}]]}}`;
  }

  macroParts = {
    prefix: macroPrefix,
    roll: macroRoll,
    damage: macroDamage,
  };

  return macroParts;
}

export function macroBuilder(activeAction, haste) {
  let macroParts = macroComponents(0, 0);

  // First Attack
  const macro = macroParts.prefix + macroParts.roll + macroParts.damage;
  let macroRunning = macro;

  createMacroElement(macro, 'First Attack', 'firstAttack');

  if (haste && activeAction === 'fullRoundAttack') {
    createMacroElement(macro, 'Haste', 'hastedAttack');
    macroRunning += macroParts.roll + macroParts.damage;
  }

  if (activeAction === 'fullRoundAttack') {
    macroParts = macroComponents(-5, 2);

    const macro5 = macroParts.prefix + macroParts.roll + macroParts.damage;
    console.log(macro5);
    createMacroElement(macro5, 'Second', 'secondAttack');
    macroRunning += macroParts.roll + macroParts.damage;

    macroParts = macroComponents(-10, 3);
    const macro10 = macroParts.prefix + macroParts.roll + macroParts.damage;
    console.log(macro10);
    createMacroElement(macro10, 'Third', 'thirdAttack');
    macroRunning += macroParts.roll + macroParts.damage;

    createMacroElement(macroRunning, 'Combined', 'multiAttack');
  }
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
