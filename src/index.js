// src/index.js
import { createBar } from "./ui/bar.js";
import { Selector } from "./core/selector.js";
import { Overlay } from "./core/overlay.js";
import { RuleEngine } from "./core/rules/rule-engine.js";
import { rulesDom } from "./core/rules/rules-dom.js";
import { rulesSeo } from "./core/rules/rules-seo.js";
import { createPanel } from "./ui/panel.js";

const state = {
  bar: null,
  selector: null,
  rules: null,
  overlay: null,
  panel: null,
  mounted: false,
  domActive: false,
  seoActive: false,
};

function init() {
  if (state.mounted) return;
  state.mounted = true;
  state.panel = createPanel();
  state.overlay = new Overlay();
  // 1. Motor de reglas
  state.rules = new RuleEngine();
  state.rules.register(rulesDom);
  state.rules.register(rulesSeo);

  // 2. Selector
  state.selector = new Selector(state.overlay);

  // 3. Barra UI
  state.bar = createBar({
    onToggleSelect: (active) => {
      if (active) state.selector.enable();
      else state.selector.disable();
    },
    onAuditDom: () => {
      // toggle real
      state.domActive = !state.domActive;
        state.panel.close();
      if (!state.domActive) {
        state.overlay.clearAll();
        state.bar.updateCounts({ dom: 0 });
        return;
      }
      const { overlay } = state.rules.run("dom");

      // limpiar SEO del panel
      state.panel.updateList([]); // vacío

      // mostrar overlay DOM
      state.overlay.highlightList(overlay);

      // contador DOM solamente
      state.bar.updateCounts({
        dom: overlay.length,
      });


    },
    onAuditSeo: () => {
      state.seoActive = !state.seoActive;

      if (!state.seoActive) {
        state.overlay.clearAll();
        state.panel.close();
        state.bar.updateCounts({ seo: 0 });
        return;
      }

      const { overlay, panel } = state.rules.run("seo");

      // Pintar en pantalla los errores visuales
      state.overlay.highlightList(overlay);

      // Panel SEO: pasarle todos los errores no visuales
      state.panel.updateList(panel);

      // Mostrar panel
      state.panel.open();

      // Actualizar contador
      state.bar.updateCounts({
        seo: overlay.length + panel.length,
      });
    },
  });

  state.bar.open();
}

function destroy() {
  state.selector?.disable();
  state.selector = null;
  state.bar?.destroy();
  state.bar = null;
  state.rules = null;
  state.mounted = false;
}

if (!window.HTMLInspector) {
  window.HTMLInspector = { init, destroy };
}
