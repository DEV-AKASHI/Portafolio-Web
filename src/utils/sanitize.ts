/**
 * Utilidades de sanitización seguras para SVG y embeds HTML
 * Previene vulnerabilidades XSS (CWE-79) sin dependencias externas
 */

// Tags SVG seguros permitidos
const ALLOWED_SVG_TAGS = new Set([
  'svg', 'path', 'g', 'circle', 'rect', 'polygon', 'polyline',
  'ellipse', 'line', 'defs', 'lineargradient', 'radialgradient',
  'stop', 'mask', 'clippath', 'use', 'text', 'tspan', 'symbol'
]);

// Atributos SVG seguros permitidos
const ALLOWED_SVG_ATTRS = new Set([
  'viewbox', 'xmlns', 'd', 'fill', 'stroke', 'stroke-width',
  'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray',
  'stroke-dashoffset', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2',
  'width', 'height', 'transform', 'opacity', 'fill-opacity', 'stroke-opacity',
  'id', 'class', 'classname', 'points', 'offset', 'stop-color', 'stop-opacity',
  'fill-rule', 'clip-rule', 'mask', 'clip-path'
]);

/**
 * Sanitiza código SVG eliminando scripts, foreignObjects y atributos de eventos on*
 */
export function sanitizeSvg(rawSvg: string | null | undefined): string {
  if (!rawSvg || typeof rawSvg !== 'string') return '';
  if (typeof window === 'undefined') return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawSvg.trim(), 'image/svg+xml');

    // Verificar si hubo error de parseo XML
    if (doc.querySelector('parsererror')) {
      return '';
    }

    const svgElement = doc.documentElement;
    if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
      return '';
    }

    // Filtrar elementos y atributos recursivamente
    const cleanNode = (node: Element) => {
      const tagName = node.nodeName.toLowerCase();

      // Eliminar cualquier etiqueta que no esté en la lista permitida
      if (!ALLOWED_SVG_TAGS.has(tagName)) {
        node.remove();
        return;
      }

      // Filtrar atributos
      const attrs = Array.from(node.attributes);
      for (const attr of attrs) {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value.trim().toLowerCase();

        // Bloquear handlers on* (onload, onerror, etc.)
        if (attrName.startsWith('on')) {
          node.removeAttribute(attr.name);
          continue;
        }

        // Bloquear esquemas peligrosos en atributos
        if (attrValue.startsWith('javascript:') || attrValue.startsWith('data:text/html')) {
          node.removeAttribute(attr.name);
          continue;
        }

        // Bloquear atributos no permitidos salvo xlink:href a ids locales
        if (attrName === 'xlink:href' || attrName === 'href') {
          if (!attrValue.startsWith('#')) {
            node.removeAttribute(attr.name);
          }
          continue;
        }

        if (!ALLOWED_SVG_ATTRS.has(attrName)) {
          node.removeAttribute(attr.name);
        }
      }

      // Procesar hijos
      Array.from(node.children).forEach(cleanNode);
    };

    cleanNode(svgElement);

    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
  } catch {
    return '';
  }
}

/**
 * Sanitiza código embed HTML para experimentos (iframes interactivos)
 * Aplica sandbox estricto y elimina scripts maliciosos
 */
export function sanitizeEmbed(rawHtml: string | null | undefined): string {
  if (!rawHtml || typeof rawHtml !== 'string') return '';
  if (typeof window === 'undefined') return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml.trim(), 'text/html');

    // Eliminar etiquetas de ejecución de script o recursos no deseados
    const dangerousTags = ['script', 'link', 'meta', 'style', 'object', 'embed', 'form', 'input', 'button', 'base'];
    dangerousTags.forEach((tag) => {
      doc.querySelectorAll(tag).forEach((el) => el.remove());
    });

    // Sanitizar todos los elementos restantes
    doc.querySelectorAll('*').forEach((el) => {
      const attrs = Array.from(el.attributes);
      for (const attr of attrs) {
        const name = attr.name.toLowerCase();
        const val = attr.value.trim().toLowerCase();

        // Eliminar handlers on*
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }

        // Eliminar URLs con esquema javascript
        if (val.startsWith('javascript:') || val.startsWith('data:text/html')) {
          el.removeAttribute(attr.name);
        }
      }

      // Si es un iframe, asegurar protocolo HTTPS y sandbox
      if (el.nodeName.toLowerCase() === 'iframe') {
        const src = el.getAttribute('src') || '';
        if (src && !src.startsWith('https://') && !src.startsWith('//') && !src.startsWith('/')) {
          el.remove();
          return;
        }

        // Forzar sandbox estricto para aislar el iframe del contexto del portafolio
        el.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups');
        el.setAttribute('loading', 'lazy');
      }
    });

    return doc.body.innerHTML;
  } catch {
    return '';
  }
}
