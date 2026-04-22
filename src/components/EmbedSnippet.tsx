"use client";

import { useState } from "react";

export default function EmbedSnippet({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const [which, setWhich] = useState<"script" | "iframe">("script");

  const scriptSnippet = `<script src="https://tools.smartqhse.com/embed.js" data-calc="${slug}"></script>`;
  const iframeSnippet = `<iframe src="https://tools.smartqhse.com/embed/${slug}" style="width:100%;min-height:520px;border:0" title="${name.replace(/"/g, "&quot;")}" loading="lazy"></iframe>`;
  const snippet = which === "script" ? scriptSnippet : iframeSnippet;

  function copy() {
    navigator.clipboard
      .writeText(snippet)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {});
  }

  return (
    <section className="mt-10 p-6 rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-[#0F2A44]">Embed this calculator</h2>
          <p className="text-xs text-slate-500 mt-1">
            Free for any website, blog, or course — MIT / CC BY 4.0. Attribution stays visible.
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg border border-slate-200 bg-slate-50">
          <button
            onClick={() => setWhich("script")}
            className={`px-2 py-1 text-[11px] font-mono rounded ${
              which === "script" ? "bg-white shadow-sm text-[#0F2A44]" : "text-slate-500"
            }`}
          >
            &lt;script&gt;
          </button>
          <button
            onClick={() => setWhich("iframe")}
            className={`px-2 py-1 text-[11px] font-mono rounded ${
              which === "iframe" ? "bg-white shadow-sm text-[#0F2A44]" : "text-slate-500"
            }`}
          >
            &lt;iframe&gt;
          </button>
        </div>
      </div>

      <div className="relative">
        <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] overflow-x-auto pr-20">
          {snippet}
        </pre>
        <button
          onClick={copy}
          className="absolute top-2 right-2 px-3 py-1 rounded-md bg-[#00C897] text-[#0F2A44] text-xs font-semibold hover:opacity-90"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <div className="mt-3 text-[11px] text-slate-400">
        Optional attributes: <code className="font-mono">data-theme</code>,{" "}
        <code className="font-mono">data-width</code>,{" "}
        <code className="font-mono">data-min-height</code>. Works on any CMS (WordPress, Webflow,
        Ghost, plain HTML).
      </div>
    </section>
  );
}
