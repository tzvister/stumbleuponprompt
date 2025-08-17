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
  if (!slug) {
    return null;
  }

  // Prefer a UUID (v4-like) at the end of the slug
  const uuidAtEnd = slug.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
  if (uuidAtEnd) {
    return uuidAtEnd[0];
  }

  // Fallback: if the last 36 characters look like a UUID-ish token, use them
  const possibleUuid = slug.slice(-36);
  if (/^[0-9a-fA-F-]{36}$/.test(possibleUuid)) {
    return possibleUuid;
  }

  // Last-resort fallback: return the substring after the final hyphen
  const lastDashIndex = slug.lastIndexOf('-');
  if (lastDashIndex !== -1 && lastDashIndex + 1 < slug.length) {
    const candidate = slug.slice(lastDashIndex + 1);
    return candidate || null;
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