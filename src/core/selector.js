// src/core/selector.js

function isInspectorHost(node) {
  if (!node) return false;
  if (node.id === '__inspector-root__') return true;
  if (node.id === '__inspector-overlay__') return true;
  if (node.id === '__inspector-panel__') return true;
  return false;
}

export class Selector {
  constructor(overlay) {
    this.overlay = overlay;
    this.active = false;

    this._onMove = this._onMove.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  enable() {
    if (this.active) return;
    this.active = true;
    document.addEventListener('mousemove', this._onMove, true);
    document.addEventListener('keydown', this._onKeyDown, true);
  }

  disable() {
    if (!this.active) return;
    this.active = false;
    document.removeEventListener('mousemove', this._onMove, true);
    document.removeEventListener('keydown', this._onKeyDown, true);
    this.overlay.hide();
  }

  _onMove(e) {
    const target = e.target;

    if (isInspectorHost(target)) return;

    if (target === document.documentElement || target === document.body) {
      this.overlay.hide();
      return;
    }

    const label = this._describeElement(target);
    this.overlay.highlightElement(target, {
      title: label,
      desc: 'Modo selector activo. Pulsa ESC para salir.',
    });
  }

  _onKeyDown(e) {
    if (e.key === 'Escape') {
      this.disable();
    }
  }

  _describeElement(el) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classList = el.classList && el.classList.length
      ? '.' + Array.from(el.classList).join('.')
      : '';
    return `${tag}${id}${classList}`;
  }
}
