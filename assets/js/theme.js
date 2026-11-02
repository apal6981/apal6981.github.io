(function () {
  var media = window.matchMedia('(prefers-color-scheme: dark)'), mode = 'system';
  try { var saved = localStorage.getItem('portfolio-theme'); if (['light','dark'].includes(saved)) mode = saved; } catch (_) {}
  function apply() { document.documentElement.dataset.theme = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode; document.documentElement.dataset.mode = mode; window.dispatchEvent(new Event('themechange')); var b = document.querySelector('[data-theme-control]'); if(b) { b.hidden = false; b.textContent = 'Theme: ' + mode[0].toUpperCase() + mode.slice(1); } }
  apply(); media.addEventListener('change', apply);
  document.addEventListener('DOMContentLoaded', function () { apply(); document.querySelector('[data-theme-control]').addEventListener('click', function () { mode = ['system','light','dark'][(['system','light','dark'].indexOf(mode)+1)%3]; try { if(mode==='system') localStorage.removeItem('portfolio-theme'); else localStorage.setItem('portfolio-theme',mode); } catch (_) {} apply(); }); });
})();