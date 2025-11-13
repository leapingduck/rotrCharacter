import * as config from './config.js';
import { domRef } from './dom.js';
let tempTotal;

let macroDamageOther;

export function calculateMacro() {
  config.calculateAttack();

  let macroPrefix = `&{template:pc}{{name=${config.macro.attackName}}}{{type=attackdamage}}{{showchar=1}}{{charname=Lord Guber}}{{attack=1}}`;

  let macroRoll = `{{roll=[[1d20cs>${config.weapon.critRange} + ${config.base.bab}[BAB] + ${config.base.strBonus}[Strength] + ${config.macro.attackBonus}[Buff]]]}}{{critconfirm=[[1d20 + ${config.base.bab}[BAB] + ${config.base.strBonus}[Strength] + ${config.macro.attackBonus}[Buff]]]}}{{atkvs=Melee+STR vs AC}}`;

  let macroDamage = `{{damage=1}}{{dmg1flag=1}}{{dmg1=[[${config.weapon.damageDice} + ${config.macro.vitalStrikeDamage} + ${config.macro.damageTotal}]]}}{{dmg1type=Slashing}}{{dmg1crit=[[(${config.weapon.damageDice} + ${config.macro.damageTotal})*2 + ${config.macro.vitalStrikeDamage}]]}}`;

  if (config.macro.damageOther != '') {
    macroDamageOther = `{{dmg2flag=1}}{{dmg2type=Fire}}{{dmg2=[[${config.macro.damageOther}]]}}{{dmg2crit=[[${config.macro.damageOther}]]}}`;
  } else {
    macroDamageOther = '';
  }
  const macroFull = macroPrefix + macroRoll + macroDamage + macroDamageOther;

  tempTotal = config.base.bab + config.base.strBonus + config.macro.attackBonus;

  domRef.output.innerHTML = macroFull;
}
