/**
 * Note URL aliases. Lives under src/client so the published package
 * (which ships src/client/, not the rest of src/) can resolve this import.
 *
 * Canonical route is `/notes/{n}` where `n` is the index without leading zeros
 * (`0001` → `/notes/1`). All of these resolve to the same note and should
 * redirect to the canonical form:
 *   /notes/1
 *   /notes/0001
 *   /notes/0001. 欢迎          (current or stale title)
 *   /notes/{frontmatter id}
 */

export interface NoteRef {
  /** 4-digit index, e.g. "0001". */
  index: string;
  /** Frontmatter `id` (UUID), when present. */
  id?: string;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** `1` / `0001` / `0001. anything` (title is ignored). */
const INDEX_SLUG_RE = /^(\d{1,4})(?:\..*)?$/;

export function canonicalNoteRoute(index: string): string {
  return `/notes/${Number(index)}`;
}

export function parseNoteSlug(
  slug: string,
): { kind: "index"; index: string } | { kind: "uuid"; id: string } | null {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // keep raw
  }
  const trimmed = decoded.replace(/\.md$/i, "").replace(/\/$/, "").trim();
  if (!trimmed) return null;
  if (UUID_RE.test(trimmed)) return { kind: "uuid", id: trimmed.toLowerCase() };
  const match = trimmed.match(INDEX_SLUG_RE);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isInteger(value) || value < 1 || value > 9999) return null;
  return { kind: "index", index: String(value).padStart(4, "0") };
}

export function resolveNoteSlug(
  slug: string,
  notes: readonly NoteRef[],
): string | null {
  const parsed = parseNoteSlug(slug);
  if (!parsed) return null;
  const note =
    parsed.kind === "uuid"
      ? notes.find((item) => item.id?.toLowerCase() === parsed.id)
      : notes.find((item) => item.index === parsed.index);
  return note ? canonicalNoteRoute(note.index) : null;
}

/** Pathname `/notes/0001. 欢迎` → canonical `/notes/1`, or null if not a note URL. */
export function resolveNotePath(
  pathname: string,
  notes: readonly NoteRef[],
  base = "/",
): string | null {
  const relative = stripBase(pathname.split(/[?#]/)[0] ?? "", base);
  if (relative === "/" || relative === "/404") return null;
  if (!relative.startsWith("/notes/")) return null;
  return resolveNoteSlug(relative.slice("/notes/".length), notes);
}

export function stripBase(pathname: string, base: string): string {
  if (base === "/") return pathname || "/";
  const prefix = base.replace(/\/$/, "");
  if (pathname === prefix || pathname === `${prefix}/`) return "/";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname || "/";
}
