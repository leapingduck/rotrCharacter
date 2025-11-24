import * as config from './config.js';
import { stateCheckboxes, generateWeaponEffects, clearUI } from './dom.js';
import { macroBuilder } from './macro.js';

function buildInitialState() {
  const ids = [
    ...config.buffs.map((buff) => buff.id),
    ...config.weaponEffects.map((effect) => effect.id),
    ...config.weapons.map((weapon) => weapon.id),
    ...config.actionTypes.map((action) => action.id),
  ];

  return ids.reduce(
    (acc, id) => {
      acc[id] = false;
      return acc;
    },
    { error: false }
  );
}

const state = buildInitialState();

function applyRules() {
  // make function
  // reset values ------------------------------------
  Object.values(config.attack).forEach((arr) => {
    arr.length = 0;
    arr.push(0);
  });

  Object.values(config.damage).forEach((arr) => {
    arr.length = 0;
    arr.push(0);
  });

  let activeAction;
  let haste;
  config.macro.damageOther = '';
  config.weapon.damageDice = '2d6';
  config.weapon.critRange = 19;
  config.macro.vitalStrikeDamage = '';
  //  -------------------------------------------------

  // make validation function. Checks for stuff like if power attack is unchecked then make sure furious focus is unchecked
  // Can't have more than one action type or more than one weapon at a time,
  //this def should go elsewhere, but its going here for now.
  clearUI();

  const rules = [
    {
      when: (s) => s.powerAttack,
      then: () => {
        config.attack.untyped.push(-4);
        config.damage.untyped.push(12);
      },
    },
    {
      when: (s) => s.furiousFocus && !s.powerAttack,
      then: () => {
        state.error = true;
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
      when: (s) => s.GS01,
      then: () => {
        config.attack.item.push(1);
        config.attack.untyped.push(1);
        config.damage.item.push(1);
      },
    },
    {
      when: (s) => s.GS02,
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
        config.base.strBonus += 1;
        config.weapon.damageDice = '3d6';
      },
    },
    {
      when: (s) => s.GS02 && s.enlarge,
      then: () => {
        config.weapon.damageDice = '4d6';
      },
    },
    {
      when: (s) => s.weapon1 && s.weapon2,
      then: () => {
        state.error = true;
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
        haste = true;
        config.attack.untyped.push(1);
      },
    },
    {
      when: (s) => s.chargeAction,
      then: () => {
        activeAction = 'chargeAction';
      },
    },
    {
      when: (s) => s.fullRoundAttack,
      then: () => {
        activeAction = 'fullRoundAttack';
      },
    },
    {
      when: (s) => s.fightDefensively,
      then: () => {
        config.attack.untyped.push(-200);
        activeAction = 'fightDefensively';
      },
    },
    {
      when: (s) => s.vitalStrike,
      then: () => {
        activeAction = 'vitalStrike';
        config.macro.vitalStrikeDamage = `+ ${config.weapon.damageDice} + ${config.weapon.damageDice}`;
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

  macroBuilder(activeAction, haste);
}

function updateWeaponEffectsUI() {
  const weaponEffectsContainer = document.querySelector('#weaponEffectsList');
  if (weaponEffectsContainer) {
    // 1. Clear current weapon effects
    weaponEffectsContainer.innerHTML = '';
  }
  // 2. Decide which weapon is selected
  let selectedWeaponId = null;

  if (state.GS01 && !state.GS02) {
    selectedWeaponId = 'GS01';
  } else if (state.GS02 && !state.GS01) {
    selectedWeaponId = 'GS02';
  } else {
    // no weapon or invalid combo, nothing to render
    return;
  }

  // 3. Generate effects for the selected weapon
  generateWeaponEffects(selectedWeaponId);

  // 4. After generating, sync checkboxes from state
  for (const checkbox of stateCheckboxes) {
    const id = checkbox.id;

    // only apply state if we track this id
    if (Object.prototype.hasOwnProperty.call(state, id)) {
      checkbox.checked = !!state[id];
    }
  }
}

export function handleStateChange() {
  for (const checkbox of stateCheckboxes) {
    const id = checkbox.id;
    state[id] = checkbox.checked;
  }
  state.error = false;
  updateWeaponEffectsUI();
  applyRules();
}
