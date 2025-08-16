export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export function createPromptUrl(title: string, id: string): string {
  const slug = createSlug(title);
  return `/prompt/${slug}-${id}`;
}

export function extractIdFromSlug(slug: string): string | null {
  // Extract ID from slug format: title-slug-id
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // Check if last part looks like an ID (UUID or similar)
  if (lastPart && (lastPart.length >= 6)) {
    return lastPart;
  }
  
  return null;
}

export function generateMetaDescription(prompt: any): string {
  const maxLength = 150;
  const description = prompt.description || '';
  const category = prompt.tags?.[0] || '';
  
  let meta = description;
  if (meta.length > maxLength - 30) {
    meta = meta.substring(0, maxLength - 30) + '...';
  }
  
  const suffix = category ? ` Try this ${category.toLowerCase()} prompt now.` : ' Try this AI prompt now.';
  return meta + suffix;
}

export function generatePageTitle(prompt: any): string {
  const category = prompt.tags?.[0] || 'AI';
  return `Try ${prompt.title} - ${category} Prompt | StumbleUponPrompt`;
}

export function generateStructuredData(prompt: any): object {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": prompt.title,
    "description": prompt.description,
    "author": {
      "@type": "Person",
      "name": prompt.creatorName
    },
    "genre": prompt.tags?.join(', ') || '',
    "version": prompt.version || '1.0.0',
    "dateCreated": prompt.createdAt,
    "dateModified": prompt.lastUpdated,
    "keywords": prompt.tags?.join(', ') || '',
    "mainEntity": {
      "@type": "TextDigitalDocument",
      "text": prompt.prompt
    }
  };
}

export function generateOpenGraphTags(prompt: any, currentUrl: string): { [key: string]: string } {
  return {
    'og:title': generatePageTitle(prompt),
    'og:description': generateMetaDescription(prompt),
    'og:type': 'article',
    'og:url': currentUrl,
    'og:site_name': 'StumbleUponPrompt',
    'twitter:card': 'summary',
    'twitter:title': generatePageTitle(prompt),
    'twitter:description': generateMetaDescription(prompt)
  };
}