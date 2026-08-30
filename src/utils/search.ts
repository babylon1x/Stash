const SPACE_COLLAPSE = /\s+/g;

export function normalize(value: string | undefined | null): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(SPACE_COLLAPSE, ' ');
}

export function buildSearchText(fields: {
  categoryName?: string;
  username?: string;
  author?: string;
  text?: string;
  url?: string;
}): string {
  return normalize(
    [fields.categoryName, fields.author, fields.username, fields.text, fields.url]
      .filter(Boolean)
      .join(' ')
  );
}

export function matchesQuery(searchText: string, query: string): boolean {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;
  return searchText.includes(normalizedQuery);
}

export function extractUsernameFromUrl(url: string): string {
  const match = url.match(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/([a-zA-Z0-9_]{1,15})\/status\/\d+/i);
  return match ? match[1].toLowerCase() : '';
}