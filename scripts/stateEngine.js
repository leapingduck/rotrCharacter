import * as config from "./config.js";
import { stateCheckboxes } from "./dom.js";
import { calculateAttack } from "./macro.js";

const effectCheckboxes = document.getElementsByClassName("effectCheckbox");

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
  Object.values(config.attack).forEach((arr) => {
    arr.length = 0;
    arr.push(0);
  });

  const rules = [
    {
      when: (s) => s.powerAttack,
      then: () => {
        config.attack.untyped.push(-4);
        // damageBonus += 12;
      },
    },
    {
      when: (s) => s.furiousFocus && !s.powerAttack,
      then: () => {
        state.error = true;
        output.innerHTML =
          "You cannot have Furious Focus without Power Attack.";
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
        // damageAdditional = "1d6[Fire]";
      },
    },
    {
      when: (s) => s.banner,
      then: () => {
        config.attack.morale.push(1);
        // damageBonus += 1;
      },
    },
    {
      when: (s) => s.challenge,
      then: () => {
        config.attack.morale.push(2);
        // damageBonus += 6;
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
        // damageBonus += 2;
      },
    },
    {
      when: (s) => s.weapon2,
      then: () => {
        config.attack.item.push(1);
        config.attack.untyped.push(1);
        // damageBonus += 1;
        // weaponDice = "3d6";
      },
    },
    {
      when: (s) => s.enlarge,
      then: () => {
        config.attack.untyped.push(-1);
        // str += 1;
        // weaponDice = "3d6";
      },
    },
    {
      when: (s) => s.weapon2 && s.enlarge,
      then: () => {
        // weaponDice = "4d6";
      },
    },
    {
      when: (s) => s.weapon1 && s.weapon2,
      then: () => {
        state.error = true;
        output.innerHTML = "Pick a weapon!";
        return;
      },
    },
    {
      when: (s) => s.keen,
      then: () => {
        // critRange = 17;
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
        // vitalStrikeDamage = `${weaponDice} + ${weaponDice}`;
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

  calculateAttack();
  // calculateMacro();
}

export function handleStateChange() {
  console.log("State Changed");
  // Update the state object based on checkbox values
  state.powerAttack = stateCheckboxes.powerAttack.checked;
  state.furiousFocus = stateCheckboxes.furiousFocus.checked;
  state.banner = stateCheckboxes.banner.checked;
  state.haste = stateCheckboxes.haste.checked;
  state.heroism = stateCheckboxes.heroism.checked;
  state.challenge = stateCheckboxes.challenge.checked;
  state.secondAttack = stateCheckboxes.secondAttack.checked;
  state.thirdAttack = stateCheckboxes.thirdAttack.checked;
  state.flamingWeapon = stateCheckboxes.flamingWeapon.checked;
  state.keen = stateCheckboxes.keenWeapon.checked;
  state.weapon1 = stateCheckboxes.weapon1.checked;
  state.weapon2 = stateCheckboxes.weapon2.checked;
  state.vitalStrike = stateCheckboxes.vitalStrike.checked;
  state.chargeAction = stateCheckboxes.chargeAction.checked;
  state.enlarge = stateCheckboxes.enlarge.checked;
  state.error = false;

  applyRules();
}
