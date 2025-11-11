// import { handleStateChange } from './stateEngine.js';
import { calculateAttack } from './macro.js';
import { attack } from './config.js';

attack.luck.push(3);
attack.luck.push(312);
attack.luck.push(32);
attack.luck.push(2213);
attack.luck.push(23);

calculateAttack();

// Array.from(effectCheckboxes).forEach((c) =>
//   c.addEventListener('change', handleStateChange)
// );
// flamingWeapon.addEventListener('change', handleStateChange);
// vitalStrike.addEventListener('change', handleStateChange);
// chargeAction.addEventListener('change', handleStateChange);

// calculateMacro();
