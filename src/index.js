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

  domResults: null,
  seoResults: null,

  activeView: "dom",
  mounted: false
};

/* ------------------------------------------
   Ejecutar auditorías UNA sola vez al cargar
------------------------------------------- */
function runInitialAudits() {
  // Ejecutar reglas DOM
  state.domResults = state.rules.run("dom");

  // Ejecutar reglas SEO
  state.seoResults = state.rules.run("seo");

  // Actualizar contadores
  state.bar.updateCounts({
    dom: state.domResults.overlay.length + state.domResults.panel.length,
    seo: state.seoResults.overlay.length + state.seoResults.panel.length
  });
}

/* ------------------------------------------
   Mostrar vista DOM
------------------------------------------- */
function showDomView() {
  state.activeView = "dom";

  // Limpiar vista anterior
  state.overlay.clearAll();

  // Mostrar overlay DOM
  state.overlay.highlightList(state.domResults.overlay);

  // Ocultar panel SEO
  state.panel.close();

  // Activar botón DOM
  state.bar.setActiveButton("dom");
}

/* ------------------------------------------
   Mostrar vista SEO
------------------------------------------- */
function showSeoView() {
  state.activeView = "seo";

  // Limpiar vista anterior
  state.overlay.clearAll();

  // Mostrar overlay SEO
  state.overlay.highlightList(state.seoResults.overlay);

  // Actualizar panel con errores SEO
  state.panel.updateList(state.seoResults.panel);
  state.panel.open();

  // Activar botón SEO
  state.bar.setActiveButton("seo");
}

/* ------------------------------------------
   INIT
------------------------------------------- */
function init() {
  if (state.mounted) return;
  state.mounted = true;

  state.panel = createPanel();
  state.overlay = new Overlay();

  // Motor de reglas
  state.rules = new RuleEngine();
  state.rules.register(rulesDom);
  state.rules.register(rulesSeo);

  // Selector de elementos
  state.selector = new Selector(state.overlay);

  // Barra inferior
  state.bar = createBar({
    onToggleSelect: (active) => {
      if (active) state.selector.enable();
      else state.selector.disable();
    },
    onAuditDom: showDomView,
    onAuditSeo: showSeoView
  });

  // Ejecutamos auditorías una sola vez
  runInitialAudits();

  // Mostrar DOM por defecto
  showDomView();

  // Mostrar barra
  state.bar.open();
}

/* ------------------------------------------
   DESTROY
------------------------------------------- */
function destroy() {
  state.selector?.disable();
  state.selector = null;

  state.overlay?.destroy();
  state.overlay = null;

  state.panel?.close();
  state.panel = null;

  state.bar?.destroy();
  state.bar = null;

  state.rules = null;

  state.domResults = null;
  state.seoResults = null;

  state.activeView = "dom";

  state.mounted = false;
}

if (!window.HTMLInspector) {
  window.HTMLInspector = { init, destroy };
}


(function startInspector() {
  function safeInit() {
    if (!window.HTMLInspector) return;
    try {
      window.HTMLInspector.init();
    } catch (e) {
      console.error("[Inspector] Init error:", e);
    }
  }

  if (document.body) safeInit();
  else document.addEventListener("DOMContentLoaded", safeInit);
})();
