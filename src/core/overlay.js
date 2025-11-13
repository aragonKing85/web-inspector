// src/core/overlay.js

export class Overlay {
  constructor() {
    this.host = document.createElement("div");
    this.host.id = "__inspector-overlay__";
    this.host.style.position = "fixed";
    this.host.style.left = 0;
    this.host.style.top = 0;
    this.host.style.width = "100vw";
    this.host.style.height = "100vh";
    this.host.style.pointerEvents = "none"; // se activa por highlight
    this.host.style.zIndex = "2147483001";

    this.shadow = this.host.attachShadow({ mode: "open" });
    this.shadow.appendChild(this._createStyles());

    this.container = document.createElement("div");
    this.container.className = "insp-highlight-container";
    this.shadow.appendChild(this.container);

    this.instances = [];

    document.body.appendChild(this.host);

    // Reposicionar boxes en scroll/resize
    this._repositionAll = this._repositionAll.bind(this);
    window.addEventListener("scroll", this._repositionAll, true);
    window.addEventListener("resize", this._repositionAll, true);
  }

  _createStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .insp-highlight-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; /* activamos sólo en elementos hijos */
      }

      .insp-highlight-box {
        position: absolute;
        border: 2px solid #ff4d4d;
        background: rgba(255, 77, 77, 0.15);
        border-radius: 6px;
        pointer-events: auto;
      }

      .insp-highlight-icon {
        position: absolute;
        width: 22px;
        height: 22px;
        background: #ff4d4d;
        border-radius: 50%;
        color: #fff;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        transform: translate(-50%, -50%);
      }

      .insp-tooltip {
        position: absolute;
        max-width: 260px;
        background: #111;
        color: #fff;
        padding: 10px 14px;
        border-radius: 8px;
        font-family: system-ui;
        font-size: 14px;
        line-height: 1.4;
        pointer-events: none;
        opacity: 0;
        transform: translateY(-6px);
        transition: opacity .15s ease, transform .15s ease;
        border: 1px solid #333;
        box-shadow: 0 4px 16px rgba(0,0,0,0.45);
        z-index:999999
      }

      .insp-tooltip.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .insp-title {
        font-weight: 600;
        margin-bottom: 4px;
        color: #ff4d4d;
      }
    `;
    return style;
  }

  /**
   * Pinta un listado de highlights
   */
  highlightList(findings) {
    this.clearAll();

    findings.forEach((f) => {
      const rect = f.el.getBoundingClientRect();

      const box = document.createElement("div");
      box.className = "insp-highlight-box";

      const icon = document.createElement("div");
      icon.className = "insp-highlight-icon";
      icon.textContent = "!";

      const tooltip = document.createElement("div");
      tooltip.className = "insp-tooltip";
      tooltip.innerHTML = `
        <div class="insp-title">${f.message}</div>
        <div>${f.description || ""}</div>
      `;

      const instance = { el: f.el, box, icon, tooltip };
      this.instances.push(instance);

      this.container.appendChild(box);
      this.container.appendChild(icon);
      this.container.appendChild(tooltip);

      // Hover icon/caja → mostrar tooltip
      const show = () => tooltip.classList.add("visible");
      const hide = () => tooltip.classList.remove("visible");

      box.addEventListener("mouseenter", show);
      box.addEventListener("mouseleave", hide);
      icon.addEventListener("mouseenter", show);
      icon.addEventListener("mouseleave", hide);
    });

    this._repositionAll();
  }

  /**
   * Recalcular todas las posiciones al hacer scroll/resize
   */
  _repositionAll() {
    this.instances.forEach((inst) => {
      const rect = inst.el.getBoundingClientRect();

      inst.box.style.left = rect.left + "px";
      inst.box.style.top = rect.top + "px";
      inst.box.style.width = rect.width + "px";
      inst.box.style.height = rect.height + "px";

      inst.icon.style.left = rect.right + "px";
      inst.icon.style.top = rect.top + "px";

      inst.tooltip.style.left = rect.left + "px";
      inst.tooltip.style.top = rect.bottom + 6 + "px";
    });
  }

  clearAll() {
    this.instances.forEach((i) => {
      i.box.remove();
      i.icon.remove();
      i.tooltip.remove();
    });
    this.instances = [];
  }

  destroy() {
    this.clearAll();
    window.removeEventListener("scroll", this._repositionAll, true);
    window.removeEventListener("resize", this._repositionAll, true);
    this.host.remove();
  }
}
