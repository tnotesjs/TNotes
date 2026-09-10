export const tokenizeSearch = (value: string) =>
  value.match(/[\u3400-\u9fff]|[\p{L}\p{N}_-]+/gu) ?? [];

export const normalizeSearchTerm = (term: string) => term.toLowerCase();
