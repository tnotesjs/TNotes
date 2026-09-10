export interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
  collapsed?: boolean;
}

export interface PageHeading {
  text: string;
  level: number;
  id: string;
}

export interface PageData {
  route: string;
  relativePath: string;
  title: string;
  description: string;
  /** Structured outline entries. Older builds may still emit plain strings. */
  headings: Array<PageHeading | string>;
  text: string;
  frontmatter: Record<string, unknown>;
}

export interface MarkdownConfig {
  lineNumbers: boolean;
  math: boolean;
  imageLazyLoading: boolean;
}

/**
 * Site configuration — sourced from tnotes.json (kb-level config).
 * Unknown tnotes.json keys are preserved by @tnotesjs/kb but ignored here.
 */
export interface SsgConfig {
  /** Deploy base path, e.g. "/TNotes.vite/". Defaults to "/". */
  base?: string;
  title?: string;
  description?: string;
  lang?: string;
  port?: number;
  /** Note index used as the home page; defaults to the first TOC note. */
  home?: string;
  /** kb-level comments switch (giscus) — reserved, comments ship later. */
  discussions?: boolean;
  ignoreDeadLinks?: boolean | string[];
  head?: Array<[string, Record<string, string>, string?]>;
  /** Optional theme module (must default-export { enhanceApp? }). */
  theme?: string;
  markdown?: Partial<MarkdownConfig>;
}

export interface ResolvedSsgConfig {
  root: string;
  outDir: string;
  cacheDir: string;
  publicDir: string;
  base: string;
  title: string;
  description: string;
  lang: string;
  port: number;
  home?: string;
  discussions: boolean;
  ignoreDeadLinks: boolean | string[];
  head: Array<[string, Record<string, string>, string?]>;
  theme?: string;
  markdown: MarkdownConfig;
}

export interface SiteNoteRef {
  index: string;
  id?: string;
}

/** The serialized `virtual:tnotes-site` payload available to the client. */
export interface SiteData {
  base: string;
  title: string;
  description: string;
  lang: string;
  discussions: boolean;
  sidebar: SidebarItem[];
  markdown: MarkdownConfig;
  notes: SiteNoteRef[];
}
