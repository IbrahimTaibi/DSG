export function joinSlug(slugArr: string[] | string): string {
  if (Array.isArray(slugArr)) return slugArr.join('/');
  return slugArr;
}

export function parseSlug(slug: string | string[] | undefined): string[] {
  if (!slug) return [];
  if (Array.isArray(slug)) return slug;
  return slug.split('/');
} 