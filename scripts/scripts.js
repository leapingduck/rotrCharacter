// Define state as a global constant
const state = {
  powerAttack: false,
  furiousFocus: false,
  banner: false,
  challenge: false,
  flamingWeapon: false,
  secondAttack: false,
  thirdAttack: false,
  weapon1: false,
  weapon2: false,
  vitalStrike: false,
  chargeAction: false,
  keenWeapon: false,
  error: false,
};

const effectCheckboxes = document.getElementsByClassName('effectCheckbox');

Array.from(effectCheckboxes).forEach((c) =>
  c.addEventListener('change', handleStateChange)
);

const flamingWeapon = document.getElementById('flamingWeapon');

const vitalStrike = document.getElementById('vitalStrike');
const chargeAction = document.getElementById('chargeAction');

const output = document.getElementById('output');
const summaryFirst = document.getElementById('summaryFirst');

flamingWeapon.addEventListener('change', handleStateChange);
vitalStrike.addEventListener('change', handleStateChange);
chargeAction.addEventListener('change', handleStateChange);

let bab = 14; // Base attack bonus
let str = 6; // Strength modifier
let attackBonus = 0;
let attackTotal = bab + str + attackBonus;
let critRange = 19;
let damageBase = str * 1.5;
let damageBonus = 0;
let damageOutput = damageBase + damageBonus;
let weaponDice = '2d6';
let vitalStrikeDamage = 0;
let attackName = 'First Attack';
let damageAdditional = '';
calculateMacro();

// Macro formulas
function calculateMacro() {
  attackTotal = bab + str + attackBonus;
  damageOutput = damageBase + damageBonus;

  let macroDamageOther = '';
  let macroPrefix = `&{template:pc}{{name=${attackName}}}{{type=attackdamage}}{{showchar=1}}{{charname=Lord Guber}}{{attack=1}}`;

  let macroRoll = `{{roll=[[1d20cs>${critRange} + ${bab}[BAB] + ${str}[Strength] + ${attackBonus}[Buff]]]}}{{critconfirm=[[1d20 + ${bab}[BAB] + ${str}[Strength] + ${attackBonus}]]}}{{atkvs=Melee+STR vs AC}}`;

  let macroDamage = `{{damage=1}}{{dmg1flag=1}}{{dmg1=[[${weaponDice} + ${vitalStrikeDamage} + ${damageOutput}]]}}{{dmg1type=Slashing}}{{dmg1crit=[[(${weaponDice} + ${damageOutput})*2 + ${vitalStrikeDamage}]]}}`;

  if (damageAdditional != '') {
    macroDamageOther = `{{dmg2flag=1}}{{dmg2type=Fire}}{{dmg2=[[${damageAdditional}]]}}{{dmg2crit=[[${damageAdditional}]]}}`;
  } else {
    macroDamageOther = '';
  }
  const macroFull = macroPrefix + macroRoll + macroDamage + macroDamageOther;

  output.innerHTML = macroFull;
  summaryFirst.innerHTML = `+${attackTotal} to hit; ${weaponDice} + ${damageOutput}`;
}

function handleStateChange() {
  console.log('State Changed');
  // Update the state object based on checkbox values
  state.powerAttack = effectCheckboxes.powerAttack.checked;
  state.furiousFocus = effectCheckboxes.furiousFocus.checked;
  state.banner = effectCheckboxes.banner.checked;
  state.challenge = effectCheckboxes.challenge.checked;
  state.secondAttack = effectCheckboxes.secondAttack.checked;
  state.thirdAttack = effectCheckboxes.thirdAttack.checked;
  state.flamingWeapon = flamingWeapon.checked;
  state.keen = effectCheckboxes.keenWeapon.checked;
  state.weapon1 = effectCheckboxes.weapon1.checked;
  state.weapon2 = effectCheckboxes.weapon2.checked;
  state.vitalStrike = vitalStrike.checked;
  state.chargeAction = chargeAction.checked;
  state.error = false;

  applyRules();
  applyClassBasedOnState();
}

function applyRules() {
  // reset
  attackBonus = 0;
  damageBonus = 0;
  damageAdditional = '';
  critRange = 19;

  const rules = [
    {
      when: (s) => s.powerAttack,
      then: () => {
        attackBonus -= 4;
        damageBonus += 12;
      },
    },
    {
      when: (s) => s.furiousFocus && !s.powerAttack,
      then: () => {
        state.error = true;
        output.innerHTML =
          'You cannot have Furious Focus without Power Attack.';
        return;
      },
    },
    {
      when: (s) => s.powerAttack && s.furiousFocus,
      then: () => {
        attackBonus += 4;
      },
    },
    {
      when: (s) => s.flamingWeapon,
      then: () => {
        damageAdditional = '1d6[Fire]';
      },
    },
    {
      when: (s) => s.banner,
      then: () => {
        attackBonus += 1;
        damageBonus += 1;
      },
    },
    {
      when: (s) => s.challenge,
      then: () => {
        attackBonus += 2;
        damageBonus += 6;
      },
    },
    {
      when: (s) => s.furiousFocus && s.secondAttack ^ s.thirdAttack,
      then: () => {
        attackBonus -= 4;
      },
    },
    {
      when: (s) => s.secondAttack && !s.thirdAttack,
      then: () => {
        attackBonus -= 5;
      },
    },
    {
      when: (s) => s.thirdAttack && !s.secondAttack,
      then: () => {
        attackBonus -= 10;
      },
    },
    {
      when: (s) => s.thirdAttack && s.secondAttack,
      then: () => {
        state.error = true;
        output.innerHTML =
          "Can't select second and third attack at the same time.";
        return;
      },
    },
    {
      when: (s) => s.weapon1,
      then: () => {
        attackBonus += 3;
        damageBonus += 2;
      },
    },
    {
      when: (s) => s.weapon2,
      then: () => {
        attackBonus += 2;
        damageBonus += 1;
        weaponDice = '3d6';
      },
    },
    {
      when: (s) => s.weapon1 && s.weapon2,
      then: () => {
        state.error = true;
        output.innerHTML = 'Pick a weapon!';
        return;
      },
    },
    {
      when: (s) => s.keen,
      then: () => {
        critRange = 17;
      },
    },
    {
      when: (s) => s.vitalStrike,
      then: () => {
        vitalStrikeDamage = `${weaponDice} + ${weaponDice}`;
      },
    },
  ];

  // Apply the rules
  for (const rule of rules) {
    if (rule.when(state)) {
      rule.then(state);
      if (state.error) return;
    }
  }
  calculateMacro();
}

function applyClassBasedOnState() {
  Object.entries(state).forEach(([key, isChecked]) => {
    if (key === 'error') return;

    const checkbox = document.getElementById(key);
    if (checkbox) {
      const parentElement = checkbox.parentElement;
      if (isChecked) {
        parentElement.classList.add('active');
      } else {
        parentElement.classList.remove('active');
      }
    }
  });
}
