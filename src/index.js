// src/index.js
(function () {
  function createBar() {
    const bar = document.createElement('div');
    bar.id = '__inspector-bar__';
    bar.style.position = 'fixed';
    bar.style.bottom = '0';
    bar.style.left = '0';
    bar.style.width = '100%';
    bar.style.height = '40px';
    bar.style.background = '#222';
    bar.style.color = '#fff';
    bar.style.display = 'flex';
    bar.style.alignItems = 'center';
    bar.style.justifyContent = 'center';
    bar.style.zIndex = '999999';
    bar.textContent = 'HTML Inspector - MVP';
    document.body.appendChild(bar);
  }

  window.HTMLInspector = {
    init() {
      if (!document.getElementById('__inspector-bar__')) {
        createBar();
      }
    },
  };
})();
