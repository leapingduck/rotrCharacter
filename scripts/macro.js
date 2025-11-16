import * as config from './config.js';
import { domRef, createMacroElement } from './dom.js';

let macroDamageOther;

export function generateMacroOutput(actionType) {
  const currentAction = config.actionTypes.find((a) => a.id == actionType);

  currentAction.actions.forEach((a) => {
    console.log(a);
    const macroComplete = calculateMacro(a);
    createMacroElement(macroComplete, actionType);
  });
}

function calculateMacro(actionName) {
  config.calculateAttack(actionName);

  let macroPrefix = `&{template:pc}{{name=${config.macro.attackName}}}{{type=attackdamage}}{{showchar=1}}{{charname=Lord Guber}}{{attack=1}}`;

  let macroRoll = `{{roll=[[1d20cs>${config.weapon.critRange} + ${config.base.bab}[BAB] + ${config.base.strBonus}[Strength] + ${config.macro.attackBonus}[Buff]]]}}{{critconfirm=[[1d20 + ${config.base.bab}[BAB] + ${config.base.strBonus}[Strength] + ${config.macro.attackBonus}[Buff]]]}}{{atkvs=Melee+STR vs AC}}`;

  let macroDamage = `{{damage=1}}{{dmg1flag=1}}{{dmg1=[[${config.weapon.damageDice} + ${config.macro.vitalStrikeDamage} + ${config.macro.damageTotal}]]}}{{dmg1type=Slashing}}{{dmg1crit=[[(${config.weapon.damageDice} + ${config.macro.damageTotal})*2 + ${config.macro.vitalStrikeDamage}]]}}`;

  if (config.macro.damageOther != '') {
    macroDamageOther = `{{dmg2flag=1}}{{dmg2type=Fire}}{{dmg2=[[${config.macro.damageOther}]]}}{{dmg2crit=[[${config.macro.damageOther}]]}}`;
  } else {
    macroDamageOther = '';
  }
  const macroComplete =
    macroPrefix + macroRoll + macroDamage + macroDamageOther;

  return macroComplete;
}
