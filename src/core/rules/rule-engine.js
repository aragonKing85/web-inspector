// src/core/rules/rule-engine.js
export class RuleEngine {
  constructor() {
    this.rules = [];
  }

  register(rulesArray) {
    this.rules.push(...rulesArray);
  }

  run(group) {
    const overlay = [];
    const panel = [];

    const rules = this.rules.filter(r => r.group === group);

    for (const rule of rules) {

      /* -----------------------------------------
       * 1) REGLAS CON SELECTOR CSS
       * ----------------------------------------- */
      if (rule.query) {
        const nodes = document.querySelectorAll(rule.query);

        nodes.forEach(el => {
          if (this.isInspectorNode(el)) return;

          let result = rule.test(el);

          // Si devuelve true → no hay error
          if (result === true) return;

          // Si devuelve false → error simple
          if (result === false) {
            result = {
              el,
              ruleId: rule.id,
              message: rule.message,
              description: rule.description,
              severity: rule.severity,
              category: rule.category || "info",
              mode: rule.mode || "overlay"
            };
          }

          // Si devuelve null / undefined / string → ignorar
          if (!result) return;
          if (typeof result !== "object") return;

          const findings = Array.isArray(result) ? result : [result];

          findings.forEach(f => {
            if (!f || typeof f !== "object") return;

            const finding = {
              ...f,
              el: f.el || el,
              ruleId: f.ruleId || rule.id,
              message: f.message || rule.message,
              description: f.description || rule.description,
              severity: f.severity || rule.severity,
              category: f.category || rule.category || "info",
              mode: f.mode || rule.mode || "overlay"
            };

            if (this.isInspectorNode(finding.el)) return;

            if (finding.mode === "overlay") overlay.push(finding);
            if (finding.mode === "panel") panel.push(finding);

            // duplicado automático para SEO
            if (group === "seo" && finding.mode === "overlay") {
              panel.push({ ...finding, mode: "panel" });
            }
          });
        });
      }

      /* -----------------------------------------
       * 2) REGLAS SIN SELECTOR CSS
       * ----------------------------------------- */
      else {
        let result = rule.test(document);

        // boolean → ignorar (REGLA SEO válida sin errores)
        if (result === true || result === false) continue;

        if (!result) continue;
        if (typeof result !== "object") continue;

        const findings = Array.isArray(result) ? result : [result];

        findings.forEach(f => {
          if (!f || typeof f !== "object") return;

          const finding = {
            ...f,
            ruleId: f.ruleId || rule.id,
            message: f.message || rule.message,
            description: f.description || rule.description,
            severity: f.severity || rule.severity,
            category: f.category || rule.category || "info",
            mode: f.mode || rule.mode || "panel"
          };

          if (finding.el && this.isInspectorNode(finding.el)) return;

          if (finding.mode === "overlay") overlay.push(finding);
          if (finding.mode === "panel") panel.push(finding);

          if (group === "seo" && finding.mode === "overlay") {
            panel.push({ ...finding, mode: "panel" });
          }
        });
      }
    }

    return { overlay, panel };
  }


  /* -----------------------------------------
   *  IGNORAR NODOS DEL INSPECTOR
   * ----------------------------------------- */
  isInspectorNode(el) {
    if (!el) return false;
    if (el.id?.startsWith("__inspector-")) return true;
    return !!el.closest?.("[id^='__inspector-']");
  }
}
