import * as config from './config.js';
import { domRef } from './dom.js';

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

  domRef.output1.innerHTML = macroFull;
  domRef.outputLabel1.innerHTML = `First Attack: 1d20 + ${config.macro.attackTotal}(${config.base.bab} + ${config.base.strBonus} + ${config.macro.attackBonus})`;
  domRef.outputButton1.innerHTML = config.macro.attackName;
}
