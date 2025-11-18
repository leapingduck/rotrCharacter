import * as config from './config.js';
import { domRef, createMacroElement } from './dom.js';

let macroPrefix = `&{template:pc}{{name=${config.macro.attackName}}}{{type=attackdamage}}{{showchar=1}}{{charname=Lord Guber}}{{attack=1}}`;

let macroRoll = `{{roll=[[1d20cs>${config.weapon.critRange} + ${config.base.bab}[BAB] + ${config.base.strBonus}[Strength] + ${config.macro.attackBonus}[Buff]]]}}{{critconfirm=[[1d20 + ${config.base.bab}[BAB] + ${config.base.strBonus}[Strength] + ${config.macro.attackBonus}[Buff]]]}}{{atkvs=Melee+STR vs AC}}`;

let macroDamage = `{{damage=1}}{{dmg1flag=1}}{{dmg1=[[${config.weapon.damageDice} + ${config.macro.vitalStrikeDamage} + ${config.macro.damageTotal}]]}}{{dmg1type=Slashing}}{{dmg1crit=[[(${config.weapon.damageDice} + ${config.macro.damageTotal})*2 + ${config.macro.vitalStrikeDamage}]]}}`;

export function generateMacroOutput(actionType) {
  if (actionType) {
    const currentAction = config.actionTypes.find((a) => a.id == actionType);

    // build elements for all of the action types in an array
    currentAction.actions.forEach((a) => {
      console.log(a);
      const macroSingle = calculateMacroSingle(a);
      createMacroElement(macroSingle, actionType);
    });

    if (currentAction.actions.length > 1) {
      const macroMulti = calculateMacroMulti();
      createMacroElement(macroMulti, actionType);
    }
  }
}
function calculateMacroSingle(actionName) {
  config.calculateAttack(actionName);

  const macroComplete = macroPrefix + macroRoll + macroDamage;

  if (config.macro.damageOther != '') {
    macroComplete += `{{dmg2flag=1}}{{dmg2type=Fire}}{{dmg2=[[${config.macro.damageOther}]]}}{{dmg2crit=[[${config.macro.damageOther}]]}}`;
  }
  return macroComplete;
}

function calculateMacroMulti() {
  const macroBase = 'multiattack' + macroPrefix + macroRoll + macroDamage;

  if (config.macro.damageOther != '') {
    macroBase += `{{dmg2flag=1}}{{dmg2type=Fire}}{{dmg2=[[${config.macro.damageOther}]]}}{{dmg2crit=[[${config.macro.damageOther}]]}}`;
  }
  const macroComplete = macroBase;
  return macroComplete;
}
