export function createSnippet(text: string, query: string, radius = 35): string {
  const cleanText = text.replace(/\s+/g, " ");
  const lowerQuery = query.toLowerCase();
  const index = cleanText.toLowerCase().indexOf(lowerQuery);

  if (index === -1) return cleanText.slice(0, radius * 2) + (cleanText.length > radius * 2 ? "..." : "");

  const start = Math.max(0, index - radius);
  const end = Math.min(cleanText.length, index + lowerQuery.length + radius);

  return `${start > 0 ? "..." : ""}${cleanText.slice(start, end)}${end < cleanText.length ? "..." : ""}`;
}
