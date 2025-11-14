import * as config from './config.js';
import { stateCheckboxes } from './dom.js';
import { calculateMacro } from './macro.js';

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
  // reset values ------------------------------------
  Object.values(config.attack).forEach((arr) => {
    arr.length = 0;
    arr.push(0);
  });

  Object.values(config.damage).forEach((arr) => {
    arr.length = 0;
    arr.push(0);
  });

  config.macro.damageOther = '';
  config.weapon.damageDice = '2d6';
  config.weapon.critRange = 19;
  //  -------------------------------------------------

  const rules = [
    {
      when: (s) => s.powerAttack,
      then: () => {
        config.attack.untyped.push(-4);
        //two handed
        config.damage.untyped.push(12);
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
        config.attack.untyped.push(4);
      },
    },
    {
      when: (s) => s.flamingWeapon,
      then: () => {
        config.macro.damageOther = '1d6[Fire]';
      },
    },
    {
      when: (s) => s.banner,
      then: () => {
        config.attack.morale.push(1);
        config.damage.morale.push(1);
      },
    },
    {
      when: (s) => s.challenge,
      then: () => {
        config.attack.morale.push(2);
        config.damage.morale.push(6);
      },
    },
    {
      when: (s) => s.heroism,
      then: () => {
        config.attack.morale.push(2);
      },
    },
    {
      when: (s) => s.furiousFocus && s.secondAttack ^ s.thirdAttack,
      then: () => {
        config.attack.untyped.push(-4);
      },
    },
    {
      when: (s) => s.secondAttack && !s.thirdAttack,
      then: () => {
        config.attack.untyped.push(-5);
        // attackName = "Second";
      },
    },
    {
      when: (s) => s.thirdAttack && !s.secondAttack,
      then: () => {
        config.attack.untyped.push(-10);
        // attackName = "Third";
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
        config.attack.item.push(2);
        config.attack.untyped.push(1);
        config.damage.item.push(2);
      },
    },
    {
      when: (s) => s.weapon2,
      then: () => {
        config.attack.item.push(1);
        config.attack.untyped.push(1);
        config.damage.item.push(1);
        config.weapon.damageDice = '3d6';
      },
    },
    {
      when: (s) => s.enlarge,
      then: () => {
        config.attack.untyped.push(-1);
        // str += 1;
        config.weapon.damageDice = '3d6';
      },
    },
    {
      when: (s) => s.weapon2 && s.enlarge,
      then: () => {
        config.weapon.damageDice = '4d6';
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
      when: (s) => s.keenWeapon,
      then: () => {
        config.weapon.critRange = 17;
      },
    },
    {
      when: (s) => s.haste,
      then: () => {
        config.attack.untyped.push(1);
      },
    },
    {
      when: (s) => s.vitalStrike,
      then: () => {
        config.macro.vitalStrikeDamage = `${config.weapon.damageDice} + ${config.weapon.damageDice}`;
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
  for (const checkbox of stateCheckboxes) {
    const id = checkbox.id;
    state[id] = checkbox.checked;
  }
  state.error = false;

  applyRules();
}
