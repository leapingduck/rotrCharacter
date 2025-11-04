const powerAttack = document.getElementById('powerAttack');
const furiousFocus = document.getElementById('furiousFocus');
const output = document.getElementById('output');

powerAttack.addEventListener('change', applyRules);
furiousFocus.addEventListener('change', applyRules);

function applyRules() {
  const state = {
    powerAttack: powerAttack.checked,
    furiousFocus: furiousFocus.checked,
  };

  const rules = [
    {
      when: (s) => s.powerAttack && !s.furiousFocus,
      then: 'Power Attack Active',
    },
    {
      when: (s) => s.furiousFocus && !s.powerAttack,
      then: 'Cannot only have furious focus',
    },
    {
      when: (s) => s.powerAttack && s.furiousFocus,
      then: 'Furious Focus negates penalty to hit.',
    },
  ];

  const results = rules
    .filter((rule) => rule.when(state))
    .map((rule) => rule.then);
  output.innerHTML = results.join('<br>');
}
