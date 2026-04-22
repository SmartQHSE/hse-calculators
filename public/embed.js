/* SmartQHSE HSE Calculators — Universal Embed Loader
 * https://tools.smartqhse.com
 *
 * Usage on a 3rd party site (one line):
 *   <script src="https://tools.smartqhse.com/embed.js" data-calc="trir-calculator"></script>
 *
 * Optional attributes:
 *   data-calc       (required) — calculator slug, e.g. "trir-calculator"
 *   data-theme      (optional) — "light" | "dark" (default "light")
 *   data-width      (optional) — CSS width, default "100%"
 *   data-min-height (optional) — CSS min-height in px, default 520
 *   data-id         (optional) — DOM id for the injected iframe
 *
 * This script is CC BY 4.0 / MIT. Please leave the "Powered by SmartQHSE" link
 * visible in embedded calculators — it is not removable and is how this tool
 * stays free.
 */
(function () {
  "use strict";
  var ORIGIN = "https://tools.smartqhse.com";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function buildIframe(script) {
    var slug = (script.getAttribute("data-calc") || "").trim();
    if (!slug) return null;
    var theme = script.getAttribute("data-theme") || "light";
    var width = script.getAttribute("data-width") || "100%";
    var minH = parseInt(script.getAttribute("data-min-height") || "520", 10);
    var id = script.getAttribute("data-id") || "sqhse-embed-" + slug + "-" + Date.now();

    var url = ORIGIN + "/embed/" + encodeURIComponent(slug) + "?theme=" + encodeURIComponent(theme);

    var iframe = document.createElement("iframe");
    iframe.id = id;
    iframe.src = url;
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("title", "SmartQHSE HSE calculator — " + slug);
    iframe.style.width = width;
    iframe.style.minHeight = minH + "px";
    iframe.style.border = "0";
    iframe.style.borderRadius = "12px";
    iframe.setAttribute(
      "allow",
      "clipboard-write; fullscreen"
    );
    iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    return iframe;
  }

  function resizeListener(iframe) {
    window.addEventListener("message", function (e) {
      if (!e || !e.data || e.origin !== ORIGIN) return;
      if (e.data.type !== "sqhse:resize") return;
      if (!iframe.contentWindow || e.source !== iframe.contentWindow) return;
      if (typeof e.data.height === "number" && e.data.height > 0) {
        iframe.style.height = e.data.height + "px";
      }
    });
  }

  ready(function () {
    // Find all <script src=".../embed.js"> tags and inject an iframe next to each.
    var scripts = document.querySelectorAll(
      'script[src*="tools.smartqhse.com/embed.js"], script[data-calc]'
    );
    for (var i = 0; i < scripts.length; i++) {
      var s = scripts[i];
      if (s.dataset.sqhseMounted === "1") continue;
      var iframe = buildIframe(s);
      if (!iframe) continue;
      s.dataset.sqhseMounted = "1";
      if (s.parentNode) s.parentNode.insertBefore(iframe, s);
      resizeListener(iframe);
    }
  });
})();
