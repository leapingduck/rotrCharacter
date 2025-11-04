// Define state as a global constant
const state = {
  powerAttack: false,
  furiousFocus: false,
  banner: false,
  flamingWeapon: false,
  baneWeapon: false,
  vitalStrike: false,
  chargeAction: false,
  error: false,
};

const powerAttack = document.getElementById('powerAttack');
const furiousFocus = document.getElementById('furiousFocus');
const banner = document.getElementById('banner');
const flamingWeapon = document.getElementById('flamingWeapon');
const baneWeapon = document.getElementById('baneWeapon');
const vitalStrike = document.getElementById('vitalStrike');
const chargeAction = document.getElementById('chargeAction');
const output = document.getElementById('output');
const someElement = document.getElementById('someElement'); // Example element to apply the class

// Event listeners for the checkboxes
powerAttack.addEventListener('change', handleStateChange);
furiousFocus.addEventListener('change', handleStateChange);
banner.addEventListener('change', handleStateChange);
flamingWeapon.addEventListener('change', handleStateChange);
baneWeapon.addEventListener('change', handleStateChange);
vitalStrike.addEventListener('change', handleStateChange);
chargeAction.addEventListener('change', handleStateChange);

let bab = 14; // Base attack bonus
let str = 6; // Strength modifier
let bonuses = 0; // Any other bonuses
let tohit = bab + str + bonuses; // Initial to-hit value

function handleStateChange() {
  // Update the state object based on checkbox values
  state.powerAttack = powerAttack.checked;
  state.furiousFocus = furiousFocus.checked;
  state.banner = banner.checked;
  state.flamingWeapon = flamingWeapon.checked;
  state.baneWeapon = baneWeapon.checked;
  state.vitalStrike = vitalStrike.checked;
  state.chargeAction = chargeAction.checked;
  state.error = false;

  applyRules();
  applyClassBasedOnState();
}

function applyRules() {
  tohit = bab + str + bonuses;

  const rules = [
    {
      when: (s) => s.powerAttack && !s.furiousFocus,
      then: () => {
        tohit -= 2;
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
        tohit += 2;
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

  // Update the output if no errors
  if (!state.error) {
    output.innerHTML = `/r 1d20 + ${tohit}`;
  }
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
