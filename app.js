// Kalkulator trasy: koszt autem + porównanie z rowerem. Stan w localStorage.
(function () {
  'use strict';
  var KEY = 'trasa-v1';
  var ids = ['km', 'spal', 'cena', 'vauto'];
  var els = {};
  ids.forEach(function (id) { els[id] = document.getElementById(id); });
  var out = document.getElementById('out');
  var detail = document.getElementById('detail');
  var err = document.getElementById('err');

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || '{}');
      ids.forEach(function (id) { if (s[id] !== undefined) els[id].value = s[id]; });
    } catch (e) {}
  }
  function fmt(n, d) {
    return (Math.round(n * 10) / 10).toFixed(d === undefined ? 1 : d).replace('.', ',');
  }
  function czas(min) {
    var h = Math.floor(min / 60), m = Math.round(min % 60);
    return h > 0 ? h + ' g ' + m + ' min' : m + ' min';
  }
  function render() {
    var s = {};
    ids.forEach(function (id) { s[id] = +els[id].value || 0; });
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    var bad = s.km <= 0;
    err.hidden = !bad;
    out.hidden = bad;
    if (bad) { detail.textContent = ''; return; }
    var koszt = s.km * s.spal / 100 * s.cena;
    var tAuto = s.vauto > 0 ? s.km / s.vauto * 60 : 0;
    var tRow = s.km / 18 * 60;
    var kcal = Math.round(s.km * 30);
    out.textContent = fmt(koszt, 2).replace(',0', ',00') + ' zł';
    detail.textContent = 'Auto: ' + czas(tAuto) + '. Rower: ' + czas(tRow) +
      ' i ok. ' + kcal + ' kcal. Rower taniej o ' + fmt(koszt, 2) + ' zł.';
  }
  ids.forEach(function (id) { els[id].addEventListener('input', render); });
  load(); render();
})();
