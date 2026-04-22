// Minimal layout for embedded calculator pages. Strips site chrome (header,
// footer, nav) — only the calculator itself renders so 3rd-party hosts get a
// clean widget. frame-ancestors is wide open because the whole point is to
// be embeddable anywhere.
import "../globals.css";

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
