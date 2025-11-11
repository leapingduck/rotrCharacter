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
  heroism: false,
  vitalStrike: false,
  chargeAction: false,
  keenWeapon: false,
  haste: false,
  enlarge: false,
  error: false,
};

function applyRules() {
  // reset
  attackBonus = 0;
  damageBonus = 0;
  damageAdditional = '';
  critRange = 19;
  attackName = 'First';
  str = 6;
  weaponDice = '2d6';

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
      when: (s) => s.heroism,
      then: () => {
        attackBonus += 2;
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
        attackName = 'Second';
      },
    },
    {
      when: (s) => s.thirdAttack && !s.secondAttack,
      then: () => {
        attackBonus -= 10;
        attackName = 'Third';
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
      when: (s) => s.enlarge,
      then: () => {
        attackBonus -= 1;
        str += 1;
        weaponDice = '3d6';
      },
    },
    {
      when: (s) => s.weapon2 && s.enlarge,
      then: () => {
        weaponDice = '4d6';
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
      when: (s) => s.haste,
      then: () => {
        attackBonus += 1;
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

export function handleStateChange() {
  console.log('State Changed');
  // Update the state object based on checkbox values
  state.powerAttack = effectCheckboxes.powerAttack.checked;
  state.furiousFocus = effectCheckboxes.furiousFocus.checked;
  state.banner = effectCheckboxes.banner.checked;
  state.haste = effectCheckboxes.haste.checked;
  state.heroism = effectCheckboxes.heroism.checked;
  state.challenge = effectCheckboxes.challenge.checked;
  state.secondAttack = effectCheckboxes.secondAttack.checked;
  state.thirdAttack = effectCheckboxes.thirdAttack.checked;
  state.flamingWeapon = flamingWeapon.checked;
  state.keen = effectCheckboxes.keenWeapon.checked;
  state.weapon1 = effectCheckboxes.weapon1.checked;
  state.weapon2 = effectCheckboxes.weapon2.checked;
  state.vitalStrike = vitalStrike.checked;
  state.chargeAction = chargeAction.checked;
  state.enlarge = effectCheckboxes.enlarge.checked;
  state.error = false;

  applyRules();
  applyClassBasedOnState();
}
