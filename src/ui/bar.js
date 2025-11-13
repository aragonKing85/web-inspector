// src/ui/bar.js
export function createBar({
  onToggleSelect = () => {},
  onAuditDom = () => {},
  onAuditSeo = () => {},
} = {}) {
  // Host aislado
  const host = document.createElement('div');
  host.id = '__inspector-root__';
  host.style.all = 'initial';
  host.style.position = 'fixed';
  host.style.left = '0';
  host.style.right = '0';
  host.style.bottom = '0';
  host.style.zIndex = '2147483000';
  host.style.pointerEvents = 'none';
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // UI
  const wrapper = document.createElement('div');
  wrapper.setAttribute('role', 'toolbar');
  wrapper.setAttribute('aria-label', 'HTML Inspector');
  wrapper.className = 'insp-bar';
  wrapper.addEventListener('click', (e) => e.stopPropagation());
  wrapper.addEventListener('mousedown', (e) => e.stopPropagation());
  wrapper.addEventListener('mouseup', (e) => e.stopPropagation());
  wrapper.addEventListener('keydown', (e) => e.stopPropagation());
  wrapper.style.pointerEvents = 'auto';

  // Estilos internos
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .insp-bar {
      box-sizing: border-box;
      position: relative;
      width: 100%;
      display: flex;
      gap: .5rem;
      align-items: center;
      justify-content: center;
      padding: .5rem .75rem;
      background: rgba(20,20,24,.98);
      color: #fff;
      font: 500 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      border-top: 1px solid rgba(255,255,255,.09);
      backface-visibility: hidden;
    }
    .insp-btn {
      appearance: none;
      border: 1px solid rgba(255,255,255,.15);
      background: rgba(255,255,255,.06);
      color: #fff;
      padding: .45rem .7rem;
      border-radius: .6rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      transition: transform .12s ease, background .12s ease, border-color .12s ease;
      user-select: none;
      outline: none;
    }
    .insp-btn:hover { background: rgba(255,255,255,.12); }
    .insp-btn:active { transform: translateY(1px) scale(.99); }
    .insp-btn:focus-visible { border-color: #7cc6ff; box-shadow: 0 0 0 2px rgba(124,198,255,.35) inset; }

    .insp-btn--active {
      background: rgba(124, 198, 255, 0.2);
      border-color: #7cc6ff;
    }

    .insp-sep {
      width: 1px;
      height: 24px;
      background: rgba(255,255,255,.1);
      margin: 0 .25rem;
    }

    .insp-badge {
      display: inline-block;
      min-width: 1.25rem;
      padding: 0 .35rem;
      text-align: center;
      border-radius: .5rem;
      font-size: 12px;
      line-height: 1.2;
      background: #ff5252;
      color: #fff;
    }

    .insp-right {
      position: absolute;
      right: .75rem;
      display: inline-flex;
      align-items: center;
      gap: .5rem;
    }

    .insp-close {
      border: 1px solid rgba(255,255,255,.15);
      background: transparent;
      color: #fff;
      width: 32px; height: 32px;
      border-radius: .6rem;
      cursor: pointer;
    }
  `;

  let selecting = false;

  const btnSelect = document.createElement('button');
  btnSelect.className = 'insp-btn';
  btnSelect.type = 'button';
  btnSelect.setAttribute('aria-label', 'Selector de elementos');
  btnSelect.textContent = 'Selector de elementos';
btnSelect.style.display = 'none'; //NOTE: No funciona por el momento, se oculta
  btnSelect.addEventListener('click', () => {
    selecting = !selecting;
    btnSelect.classList.toggle('insp-btn--active', selecting);
    onToggleSelect(selecting);
  });

  const btnAuditDom = document.createElement('button');
  btnAuditDom.className = 'insp-btn';
  btnAuditDom.type = 'button';
  btnAuditDom.setAttribute('aria-label', 'Audit DOM');
  btnAuditDom.innerHTML = `Audit DOM <span class="insp-badge" data-badge-dom>0</span>`;
  btnAuditDom.addEventListener('click', () => onAuditDom());

  const btnAuditSeo = document.createElement('button');
  btnAuditSeo.className = 'insp-btn';
  btnAuditSeo.type = 'button';
  btnAuditSeo.setAttribute('aria-label', 'Audit SEO');
  btnAuditSeo.innerHTML = `Audit SEO <span class="insp-badge" data-badge-seo>0</span>`;
  btnAuditSeo.addEventListener('click', () => onAuditSeo());

//   const sep = document.createElement('div');
//   sep.className = 'insp-sep';

  const right = document.createElement('div');
  right.className = 'insp-right';

  const btnClose = document.createElement('button');
  btnClose.className = 'insp-close';
  btnClose.type = 'button';
  btnClose.setAttribute('aria-label', 'Cerrar barra');
  btnClose.textContent = '×';

  wrapper.append(btnSelect,  btnAuditDom, btnAuditSeo);
//   wrapper.append(btnSelect, sep, btnAuditDom, btnAuditSeo);
  right.append(btnClose);

  shadow.append(style, wrapper, right);

  function updateCounts({ dom = 0, seo = 0 } = {}) {
    const bDom = shadow.querySelector('[data-badge-dom]');
    const bSeo = shadow.querySelector('[data-badge-seo]');
    if (bDom) bDom.textContent = String(dom);
    if (bSeo) bSeo.textContent = String(seo);
  }

  function open() {
    host.style.display = '';
  }
  function close() {
    host.style.display = 'none';
  }
  function destroy() {
    close();
    host.remove();
  }

  btnClose.addEventListener('click', () => close());

  shadow.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  function setSelectActive(isActive) {
    selecting = !!isActive;
    btnSelect.classList.toggle('insp-btn--active', selecting);
  }

  return { host, shadow, open, close, updateCounts, destroy, setSelectActive };
}
