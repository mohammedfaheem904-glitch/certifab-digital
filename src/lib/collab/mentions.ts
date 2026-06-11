import { ROLE_GROUPS, type AppRole } from "./types";

/**
 * Parse a markdown comment body for @mentions.
 * Returns the user IDs and role tokens to fan out notifications to.
 *
 * Convention used by the composer:
 *   - User mentions are inserted as `@[Display Name](user:<uuid>)`
 *   - Role mentions are inserted as `@[QA-Team](role:qa_qc_manager)`
 * Both also have a fallback plain `@token` form which is detected for roles.
 */
export function parseMentions(body: string): {
  userIds: string[];
  roles: AppRole[];
  plain: string;
} {
  const userIds = new Set<string>();
  const roles = new Set<AppRole>();

  const linkRe = /@\[([^\]]+)\]\((user|role):([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(body))) {
    if (m[2] === "user") userIds.add(m[3]);
    else roles.add(m[3] as AppRole);
  }

  // Plain @TokenName for roles
  for (const g of ROLE_GROUPS) {
    const re = new RegExp(`(^|\\s)${escapeRe(g.token)}\\b`, "i");
    if (re.test(body)) roles.add(g.role);
  }

  // Build a plain-text variant suitable for notifications + search.
  const plain = body
    .replace(linkRe, "@$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim();

  return { userIds: [...userIds], roles: [...roles], plain };
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
