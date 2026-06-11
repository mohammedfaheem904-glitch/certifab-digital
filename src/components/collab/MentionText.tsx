import { ROLE_GROUPS } from "@/lib/collab/types";

/**
 * Render a comment body with @[Name](user|role:id) tokens and plain @Group
 * tokens highlighted. Markdown beyond bold/italic/code is rendered as-is.
 */
export function MentionText({ body }: { body: string }) {
  const parts: React.ReactNode[] = [];
  const re = /@\[([^\]]+)\]\((user|role):([^)]+)\)/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    if (m.index > last) parts.push(renderPlain(body.slice(last, m.index), `t-${i++}`));
    parts.push(
      <span
        key={`m-${i++}`}
        className="inline-flex items-center rounded bg-primary/15 text-primary px-1 font-medium"
      >
        @{m[1]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < body.length) parts.push(renderPlain(body.slice(last), `t-${i++}`));
  return <span className="whitespace-pre-wrap break-words text-sm leading-relaxed">{parts}</span>;
}

function renderPlain(text: string, key: string) {
  // Highlight plain role tokens
  let nodes: React.ReactNode[] = [text];
  for (const g of ROLE_GROUPS) {
    nodes = nodes.flatMap((n, ni) => {
      if (typeof n !== "string") return [n];
      const parts: React.ReactNode[] = [];
      const re = new RegExp(`(${escape(g.token)})`, "gi");
      const split = n.split(re);
      split.forEach((s, idx) => {
        if (re.test(s)) {
          parts.push(
            <span
              key={`${key}-${ni}-${idx}`}
              className="inline-flex items-center rounded bg-accent/40 text-foreground px-1 font-medium"
            >
              {s}
            </span>,
          );
        } else if (s) {
          parts.push(s);
        }
      });
      return parts;
    });
  }
  return <span key={key}>{nodes}</span>;
}

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
