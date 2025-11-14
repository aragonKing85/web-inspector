// src/core/rules/rules-dom.js
import { defineRule } from './rule-types.js';

/**
 * REGLAS DOM
 */
export const rulesDom = [

  /**
   * 1) IMG sin ALT
   */
  defineRule({
    id: "img-alt-missing",
    group: "dom",
    message: "La imagen no tiene atributo alt.",
    description: "Todas las imágenes deben tener un alt descriptivo o alt=\"\" si son decorativas.",
    severity: "error",
    query: "img:not([alt])",
    test(el) {
      return false; // si aparece en el query, ya es error
    }
  }),

  /**
   * 2) IMG con alt vacío pero sin role="presentation"
   */
  defineRule({
    id: "img-alt-empty-without-role",
    group: "dom",
    message: "La imagen tiene alt vacío pero no está marcada como decorativa.",
    description: "Si una imagen no aporta información debe tener alt=\"\" y role=\"presentation\".",
    severity: "warn",
    query: "img[alt='']",
    test(el) {
      return el.getAttribute("role") === "presentation";
    }
  }),

/**
 * A sin href
 */
defineRule({
  id: "a-href-missing",
  group: "dom",
  message: "El enlace no tiene atributo href.",
  description: "Todos los enlaces deben tener un destino válido.",
  severity: "error",
  query: "a:not([href])",  // sólo detecta los que NO tienen el atributo
  test(el) {
    return false; // ya es error solo por aparecer en la selección
  }
}),

/**
 * A con href vacío
 */
defineRule({
  id: "a-href-empty",
  group: "dom",
  message: "El enlace tiene href vacío.",
  description: "Un enlace vacío no es funcional. Añade un enlace real o usa <button> si es una acción.",
  severity: "error",
  query: "a[href='']",
  test(el) {
    return false;
  }
}),

/**
 * A con href="#"
 */
defineRule({
  id: "a-href-hash",
  group: "dom",
  message: "El enlace apunta solo a '#'.",
  description: "Los enlaces con '#' no tienen destino real. Úsalo solo para anclas reales o reemplázalo.",
  severity: "warn",
  query: "a[href='#']",
  test(el) {
    return false;
  }
}),

/**
 * A con href inválido como javascript:void(0)
 */
defineRule({
  id: "a-href-js-void",
  group: "dom",
  message: "El enlace usa javascript:void(0), lo cual es una mala práctica.",
  description: "Evita javascript:void(0). Usa botones o controladores de eventos adecuados.",
  severity: "warn",
  query: "a[href^='javascript:void']",
  test(el) {
    return false;
  }
}),
/**
 * A con href vacío o solo espacios
 */
// defineRule({
//   id: "a-href-whitespace",
//   group: "dom",
//   message: "El enlace tiene un href vacío o compuesto solo por espacios.",
//   description: "Asegúrate de incluir un destino válido.",
//   severity: "error",
//   query: "a[href]", // después filtramos dentro del test
//   test(el) {
//     const href = el.getAttribute("href");
//     return href.trim() !== "";
//   }
// }),
  /**
   * 4) BUTTON sin type
   */
  // defineRule({
  //   id: "button-without-type",
  //   group: "dom",
  //   message: "El botón no tiene atributo type.",
  //   description: "Siempre define type=\"button\" en botones para evitar submits inesperados.",
  //   severity: "warn",
  //   query: "button:not([type])",
  //   test(el) {
  //     return false;
  //   }
  // }),

  /**
   * 5) IDs duplicados
   * Esta NO usa query, porque hay que analizar todos los elementos con id
   */
  defineRule({
    id: "duplicate-ids",
    group: "dom",
    message: "Hay elementos con IDs duplicados.",
    description: "Cada id debe ser único en el documento.",
    severity: "error",
    test() {
      const allWithId = document.querySelectorAll("[id]");
      const map = new Map();
      const duplicates = [];

      allWithId.forEach(el => {
        const id = el.id;
        if (!map.has(id)) {
          map.set(id, el);
        } else {
          // Encontrado otro con el mismo id
          duplicates.push({
            el,
            ruleId: "duplicate-ids",
            message: "ID duplicado: #" + id,
            description: "Cada id debe ser único en el DOM.",
            severity: "error",
          });
        }
      });

      return duplicates;
    }
  }),
defineRule({
  id: "interactive-non-button",
  group: "dom",
  message: "Elemento interactivo no es un botón real.",
  description: "Usa <button> para elementos que no navegan a otro destino.",
  severity: "warn",
  query: "[onclick], [role='button']",
  test(el) {
    const tag = el.tagName.toLowerCase();

    // ❌ NO marcar si es <a> con href
    if (tag === "a" && el.hasAttribute("href")) return true;

    // ❌ NO marcar si es un enlace con clases típicas de WP
    if (el.matches("a.button, a.wp-element-button, a.wp-block-button__link")) return true;

    // OK solo si realmente es un <button>
    return tag === "button";
  }
}),

  /**
   * 6) tabindex positivo
   */
  defineRule({
    id: "tabindex-positive",
    group: "dom",
    message: "El tabindex positivo es una mala práctica.",
    description: "Usa tabindex=\"0\" para elementos interactivos o no lo uses si no es necesario.",
    severity: "warn",
    query: "[tabindex]",
    test(el) {
      const val = parseInt(el.getAttribute("tabindex"), 10);
      return !(val > 0); // false => error
    }
  }),
defineRule({
  id: "input-no-label",
  group: "dom",
  message: "El campo de formulario no tiene etiqueta.",
  description: "Todos los inputs deben tener un <label> visible o aria-label.",
  severity: "error",
  query: "input:not([type='hidden']), textarea, select",
  test(el) {
    const id = el.id;
    if (id && document.querySelector(`label[for='${id}']`)) return true;
    if (el.closest("label")) return true;
    if (el.getAttribute("aria-label")) return true;
    return false;
  }
}),
defineRule({
  id: "img-too-big",
  group: "dom",
  message: "La imagen tiene un tamaño muy grande.",
  description: "Optimiza imágenes demasiado grandes para mejorar rendimiento.",
  severity: "info",
  query: "img",
  test(el) {
    const w = el.naturalWidth;
    const h = el.naturalHeight;
    return !(w > 2500 || h > 2500);
  }
}),
defineRule({
  id: "tabindex-invalid",
  group: "dom",
  message: "El tabindex tiene un valor inválido.",
  description: "Evita tabindex positivo. Usa tabindex=\"0\".",
  severity: "warn",
  query: "[tabindex]",
  test(el) {
    const v = parseInt(el.getAttribute("tabindex"), 10);
    return Number.isInteger(v) && v <= 0;
  }
}),
defineRule({
  id: "redundant-role",
  group: "dom",
  message: "Rol redundante o innecesario.",
  description: "Muchos roles son inútiles porque el elemento ya es semántico.",
  severity: "info",
  query: "[role]",
  test(el) {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute("role");

    const redundant = {
      h1: "heading",
      h2: "heading",
      h3: "heading",
      button: "button",
      ul: "list",
      ol: "list",
      li: "listitem",
    };

    return redundant[tag] !== role;
  }
}),
];
