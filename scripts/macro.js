import { base, attack, damage } from './config.js';

let attackBonus;
let attackTotal;
let damageBase = Math.floor(base.strBonus * 1.5);
// let damageOutput = damageBase + damageBonus;
// let macroDamageOther = '';

function test() {
  attack.circumstance.push(3);
  attack.circumstance.push(2);
  console.log(attack.circumstance);
  console.log(Math.max(...attack.circumstance));
}
export function calculateAttack() {
  test();
  attackBonus =
    Math.max(...attack.circumstance) +
    Math.max(...attack.competence) +
    Math.max(...attack.enhancement) +
    Math.max(...attack.insight) +
    Math.max(...attack.luckgi);

  attackTotal = base.bab + base.strBonus + attackBonus;
  console.log('hello');
  console.log(attackTotal);
}

// export function calculateMacro() {
//   let macroPrefix = `&{template:pc}{{name=${attackName}}}{{type=attackdamage}}{{showchar=1}}{{charname=Lord Guber}}{{attack=1}}`;

//   let macroRoll = `{{roll=[[1d20cs>${critRange} + ${bab}[BAB] + ${str}[Strength] + ${attackBonus}[Buff]]]}}{{critconfirm=[[1d20 + ${bab}[BAB] + ${str}[Strength] + ${attackBonus}]]}}{{atkvs=Melee+STR vs AC}}`;

//   let macroDamage = `{{damage=1}}{{dmg1flag=1}}{{dmg1=[[${weaponDice} + ${vitalStrikeDamage} + ${damageOutput}]]}}{{dmg1type=Slashing}}{{dmg1crit=[[(${weaponDice} + ${damageOutput})*2 + ${vitalStrikeDamage}]]}}`;

//   if (damageAdditional != '') {
//     macroDamageOther = `{{dmg2flag=1}}{{dmg2type=Fire}}{{dmg2=[[${damageAdditional}]]}}{{dmg2crit=[[${damageAdditional}]]}}`;
//   } else {
//     macroDamageOther = '';
//   }
//   const macroFull = macroPrefix + macroRoll + macroDamage + macroDamageOther;

//   output.innerHTML = macroFull;
//   summaryFirst.innerHTML = `+${attackTotal} to hit; ${weaponDice} + ${damageOutput}`;
// }
