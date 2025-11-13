// src/core/rules/rules-seo.js
import { defineRule } from "./rule-types.js";

export const rulesSeo = [
/* ----------------------------
 *  INFORMACIÓN GENERAL
 * ---------------------------- */

defineRule({
  id: "seo-title-missing",
  group: "seo",
  category: "info",
  mode: "panel",
  severity: "error",
  message: "Falta la etiqueta &lt;title&gt;.",
  description: "El título es fundamental para SEO y debe describir la página.",
  test() {
    const t = document.querySelector("title");
    if (t && t.textContent.trim() !== "") return true;

    return {
      el: document.head,
      message: "Falta la etiqueta &lt;title&gt;.",
      description: "Incluye un título que describa correctamente la página.",
      severity: "error",
      category: "info",
      mode: "panel"
    };
  }
}),


defineRule({
  id: "seo-description-missing",
  group: "seo",
  category: "info",
  mode: "panel",
  severity: "error",
  message: "Falta la meta description.",
  description: "La meta descripción ayuda a mejorar el CTR y el SEO.",
  test() {
    const meta = document.querySelector("meta[name='description']");
    if (meta && meta.getAttribute("content")?.trim() !== "") return true;

    return {
      el: document.head,
      message: "Falta la meta description.",
      description: "Añade &lt;meta name=\"description\" content=\"...\"&gt;",
      severity: "error",
      category: "info",
      mode: "panel"
    };
  }
}),


defineRule({
  id: "seo-description-length",
  group: "seo",
  category: "info",
  mode: "panel",
  severity: "warn",
  query: "meta[name='description']",
  message: "La meta description tiene una longitud no óptima.",
  description: "Debe tener entre 50 y 160 caracteres.",
  test(el) {
    const txt = el.getAttribute("content") || "";
    return txt.length >= 50 && txt.length <= 160;
  }
}),


defineRule({
  id: "seo-canonical-missing",
  group: "seo",
  category: "info",
  mode: "panel",
  severity: "warn",
  message: "Falta la etiqueta &lt;link rel='canonical'&gt;.",
  description: "El canonical ayuda a evitar contenido duplicado.",
  test() {
    const c = document.querySelector("link[rel='canonical']");
    if (c) return true;

    return {
      el: document.head,
      message: "Falta la etiqueta &lt;link rel='canonical'&gt;.",
      description: "Añade una URL canónica válida.",
      severity: "warn",
      category: "info",
      mode: "panel"
    };
  }
}),


defineRule({
  id: "seo-viewport-missing",
  group: "seo",
  category: "info",
  mode: "panel",
  severity: "warn",
  message: "Falta la etiqueta meta viewport.",
  description: "Es necesaria para diseño responsive y móviles.",
  test() {
    const meta = document.querySelector("meta[name='viewport']");
    if (meta) return true;

    return {
      el: document.head,
      message: "Falta &lt;meta name='viewport'&gt;.",
      description: "Añade &lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"&gt;",
      severity: "warn",
      category: "info",
      mode: "panel"
    };
  }
}),


  /* ----------------------------
   *  ENCABEZADOS
   * ---------------------------- */

  defineRule({
    id: "seo-multiple-h1",
    group: "seo",
    category: "headings",
    mode: "panel",
    severity: "error",
    message: "Existe más de un &lt;h1&lt; en la página.",
    description: "Debe haber solo un H1 principal.",
    test() {
      const h1s = [...document.querySelectorAll("h1")];
      if (h1s.length <= 1) return true;

      return h1s.slice(1).map(el => ({
        el,
        ruleId: "seo-multiple-h1",
        message: "H1 duplicado",
        description: "Debe existir solo un H1 por página.",
        severity: "error",
        category: "headings",
        mode: "panel"
      }));
    }
  }),

  defineRule({
    id: "seo-empty-h1",
    group: "seo",
    category: "headings",
    mode: "panel",
    severity: "warn",
    query: "h1",
    message: "El &lt;h1&gt; está vacío.",
    description: "Debe contener texto representativo del contenido.",
    test(el) {
      return el.textContent.trim() !== "";
    }
  }),
defineRule({
  id: "seo-headings-structure",
  group: "seo",
  category: "headings",
  mode: "panel",
  severity: "info",
  message: "Jerarquía de encabezados detectada.",
  description: "Estructura completa de los encabezados en la página.",
  test() {
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];

    if (hs.length === 0) return true;

    return hs.map(h => ({
      el: h,
      message: `${h.tagName}: ${h.textContent.trim().slice(0, 80)}`,
      description: "",
      severity: "info",
      category: "headings",
      mode: "panel",
    }));
  }
}),
  /* ----------------------------
   *  ENLACES
   * ---------------------------- */

  defineRule({
    id: "seo-poor-anchor-text",
    group: "seo",
    category: "links",
    mode: "overlay",
    severity: "info",
    query: "a[href]",
    message: "Texto de enlace poco descriptivo.",
    description: "Evita textos como 'haz clic aquí', 'ver más', 'leer más'.",
    test(el) {
      const txt = el.textContent.trim().toLowerCase();
      const bad = [
        "click aquí", "haz clic aquí", "leer más", "ver más", "aquí", "more", "read more"
      ];
      return !bad.includes(txt);
    }
  }),

  defineRule({
    id: "seo-empty-href",
    group: "seo",
    category: "links",
    mode: "overlay",
    severity: "warn",
    query: "a[href=''], a[href='#']",
    message: "El enlace tiene un href no válido.",
    description: "Un href vacío afecta SEO y accesibilidad.",
    test() {
      return false;
    }
  }),
defineRule({
  id: "seo-link-missing-aria",
  group: "seo",
  category: "links",
  mode: "overlay",
  severity: "warn",
  query: "a[href]",
  message: "El enlace no tiene aria-label.",
  description: "Añade un aria-label cuando el texto no es suficientemente descriptivo.",
  test(el) {
    const txt = el.textContent.trim();
    if (txt.length > 2) return true; 
    return el.hasAttribute("aria-label");
  }
}),
/* ----------------------------
 *  OPEN GRAPH
 * ---------------------------- */

defineRule({
  id: "seo-og-title-missing",
  group: "seo",
  category: "opengraph",
  mode: "panel",
  severity: "warn",
  message: "Falta og:title.",
  description: "Necesario para compartir en redes sociales.",
  test() {
    const tag = document.querySelector("meta[property='og:title']");
    if (tag) return true;

    return {
      el: document.head,
      message: "Falta og:title.",
      description: "Añade &lt;meta property='og:title' content='...'&gt;",
      severity: "warn",
      category: "opengraph",
      mode: "panel"
    };
  }
}),


defineRule({
  id: "seo-og-image-missing",
  group: "seo",
  category: "opengraph",
  mode: "panel",
  severity: "warn",
  message: "Falta og:image.",
  description: "Las redes sociales necesitan una imagen destacada.",
  test() {
    const tag = document.querySelector("meta[property='og:image']");
    if (tag) return true;

    return {
      el: document.head,
      message: "Falta og:image.",
      description: "Añade &lt;meta property='og:image' content='url.jpg'&gt;",
      severity: "warn",
      category: "opengraph",
      mode: "panel"
    };
  }
}),


/* ----------------------------
 *  INDEXACIÓN
 * ---------------------------- */

defineRule({
  id: "seo-noindex",
  group: "seo",
  category: "indexing",
  mode: "panel",
  severity: "warn",
  message: "La página está marcada como no indexable.",
  description: "Meta robots contiene noindex.",
  test() {
    const meta = document.querySelector("meta[name='robots']");

    // No hay etiqueta robots → OK (no es error)
    if (!meta) return true;

    const content = meta.getAttribute("content") || "";

    // Si NO contiene noindex → OK
    if (!content.includes("noindex")) return true;

    // Error → devolver finding
    return {
      el: meta,
      message: "La página tiene meta noindex.",
      description: "Elimina 'noindex' para permitir indexación.",
      severity: "warn",
      category: "indexing",
      mode: "panel"
    };
  }
}),

  /* ----------------------------
   *  RENDIMIENTO (WEB VITALS)
   * ---------------------------- */

defineRule({
  id: "seo-img-missing-dimensions",
  group: "seo",
  category: "performance",
  mode: "overlay",
  severity: "warn",
  query: "img",
  message: "Imagen sin width/height definidos.",
  description: "Define width y height en la imagen para evitar Layout Shift (CLS).",
  test(el) {
    const w = el.getAttribute("width");
    const h = el.getAttribute("height");

    // Si faltan ambos → error
    if (!w && !h) return false;

    // Si uno está vacío → error
    if (!w || !h) return false;

    // Si width/height son '0' o cadenas vacías → error
    if (parseInt(w, 10) <= 0 || parseInt(h, 10) <= 0) return false;

    // Todo correcto
    return true;
  }
}),

  defineRule({
    id: "seo-img-no-lazy",
    group: "seo",
    category: "performance",
    mode: "panel",
    severity: "info",
    query: "img",
    message: "Imagen por debajo de la mitad de la página sin lazy loading.",
    description: "Añade loading='lazy' para optimizar rendimiento.",
    test(el) {
      const rect = el.getBoundingClientRect();
      const lazy = el.getAttribute("loading") === "lazy";
      return lazy || rect.top < window.innerHeight;
    }
  }),
defineRule({
  id: "seo-script-no-defer",
  group: "seo",
  category: "performance",
  mode: "panel",
  severity: "warn",
  query: "script[src]",
  message: "Script sin defer o async.",
  description: "Añadir defer/async mejora rendimiento y reduce bloqueo.",
  test(el) {
    return el.hasAttribute("defer") || el.hasAttribute("async");
  }
}),
defineRule({
  id: "seo-img-no-modern-format",
  group: "seo",
  category: "performance",
  mode: "panel",
  severity: "info",
  query: "img",
  message: "Imagen sin formato moderno (WebP o AVIF).",
  description: "Considera usar WebP o AVIF para optimizar las imágenes.",
  test(el) {
    const src = el.getAttribute("src") || "";
    return src.endsWith(".webp") || src.endsWith(".avif");
  }
}),
defineRule({
  id: "seo-theme-color-missing",
  group: "seo",
  category: "performance",
  mode: "panel",
  severity: "info",
  message: "Falta meta name='theme-color'.",
  description: "Mejora la integración con móviles Android.",
  test() {
    return !!document.querySelector("meta[name='theme-color']");
  }
})

];
