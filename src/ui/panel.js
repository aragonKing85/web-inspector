// src/ui/panel.js

export function createPanel() {
  const host = document.createElement("div");
  host.id = "__inspector-panel__";
  host.style.position = "fixed";
  host.style.top = 0;
  host.style.right = 0;
  host.style.width = "380px";
  host.style.height = "100vh";
  host.style.zIndex = "2147483002";
  host.style.pointerEvents = "none";
  host.style.display = "none";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  const wrapper = document.createElement("div");
  wrapper.className = "panel-wrapper";

  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }

    .panel-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      width: 580px;
      height: 100%;
      background: #18181b;
      border-left: 1px solid #2d2d2f;
      color: #fff;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      pointer-events: auto;
      transform: translateX(100%);
      transition: transform .25s ease;
    }

    .panel-wrapper.open {
      transform: translateX(0);
    }

    /* Header */
    .panel-header {
      padding: 1rem;
      border-bottom: 1px solid rgba(255,255,255,.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1rem;
    }

    .panel-header button {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 1.4rem;
      cursor: pointer;
      padding: .25rem .5rem;
    }

    /* Tabs */
    .tabs {
      display: flex;
      border-bottom: 1px solid rgba(255,255,255,.1);
    }

    .tab {
      flex: 1;
      padding: .6rem 0;
      text-align: center;
      cursor: pointer;
      font-size: .9rem;
      user-select: none;
      background: rgba(255,255,255,.03);
      border-bottom: 2px solid transparent;
      transition: .15s ease background, .15s ease border;
    }

    .tab:hover {
      background: rgba(255,255,255,.08);
    }

    .tab.active {
      background: rgba(255,255,255,.12);
      border-bottom-color: #7cc6ff;
    }

    /* List */
    .panel-list {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      font-size: .9rem;
    }

    .panel-item {
      background: rgba(255,255,255,.06);
      padding: .75rem;
      border-radius: .5rem;
      margin-bottom: .75rem;
      border: 1px solid rgba(255,255,255,.1);
      display: flex;
      flex-direction: column;
      gap: .4rem;
    }

    .panel-item h3 {
      margin: 0;
      font-size: .95rem;
      color: #ff6b6b;
    }

    .panel-item.warn h3 { color: #ffc05e; }
    .panel-item.info h3 { color: #6bb8ff; }

    .panel-item p {
      margin: 0;
      color: #ddd;
      line-height: 1.4;
    }

    .panel-actions {
      display: flex;
      gap: .5rem;
      margin-top: .5rem;
    }

    .panel-actions button {
      font-size: .8rem;
      padding: .35rem .6rem;
      border-radius: .35rem;
      border: 1px solid rgba(255,255,255,.15);
      background: rgba(255,255,255,.08);
      color: #fff;
      cursor: pointer;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #999;
      font-size: .9rem;
    }
  `;

  /** Estructura HTML del panel */
  const header = document.createElement("div");
  header.className = "panel-header";
  header.innerHTML = `
    <span>Audit SEO</span>
    <button class="panel-close">×</button>
  `;

  /** Tabs */
  const tabs = document.createElement("div");
  tabs.className = "tabs";

  const categories = [
    { id: "info", label: "Información" },
    { id: "headings", label: "Encabezados" },
    { id: "links", label: "Enlaces" },
    { id: "opengraph", label: "OpenGraph" },
    { id: "indexing", label: "Indexación" },
    { id: "performance", label: "Rendimiento" }
  ];

  const tabElements = {};

  categories.forEach(cat => {
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.textContent = cat.label;
    tab.dataset.category = cat.id;
    tabs.appendChild(tab);
    tabElements[cat.id] = tab;
  });

  tabElements["info"].classList.add("active");

  /** Contenedor de lista */
  const list = document.createElement("div");
  list.className = "panel-list";

  wrapper.append(header, tabs, list);
  shadow.append(style, wrapper);

  let activeCategory = "info";
  let data = {
    info: [],
    headings: [],
    links: [],
    opengraph: [],
    indexing: [],
    performance: []
  };

  /** Renderizado */
  function render() {
    list.innerHTML = "";

    const items = data[activeCategory] || [];

    if (!items.length) {
      list.innerHTML = `<div class="empty-state">No hay errores en esta categoría.</div>`;
      return;
    }

    items.forEach(f => {
      const item = document.createElement("div");
      item.className = `panel-item ${f.severity}`;

      item.innerHTML = `
        <h3>${f.message}</h3>
        <p>${f.description || ""}</p>
      `;

      if (f.el) {
        const actions = document.createElement("div");
        actions.className = "panel-actions";

        const btnLocate = document.createElement("button");
        btnLocate.textContent = "Localizar";

        btnLocate.addEventListener("click", () => {
          f.el.scrollIntoView({ behavior: "smooth", block: "center" });
          f.el.style.outline = "2px solid #7cc6ff";
          setTimeout(() => f.el.style.outline = "", 1200);
        });

        actions.appendChild(btnLocate);
        item.appendChild(actions);
      }

      list.appendChild(item);
    });
  }

  /** Cambiar tab */
  tabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;

    Object.values(tabElements).forEach(t => t.classList.remove("active"));

    tab.classList.add("active");
    activeCategory = tab.dataset.category;

    render();
  });

  /** Cerrar panel */
  shadow.querySelector(".panel-close").addEventListener("click", close);

  function open() {
    host.style.display = "block";
    requestAnimationFrame(() => wrapper.classList.add("open"));
  }

  function close() {
    wrapper.classList.remove("open");
    setTimeout(() => host.style.display = "none", 250);
  }

  /** API: recibe lista completa de errores SEO */
  function updateList(listData) {
    /** Limpiar categorías */
    Object.keys(data).forEach(cat => data[cat] = []);

    /** Repartir findings por categoría */
    listData.forEach(f => {
      const cat = f.category || "info";
      if (!data[cat]) data[cat] = [];
      data[cat].push(f);
    });

    render();
  }

  return { open, close, updateList, host, shadow };
}
