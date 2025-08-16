import { createSlug } from "../lib/seo-utils";
import type { Prompt } from "@shared/schema";

export function generateSitemap(prompts: Prompt[], baseUrl: string = 'https://stumbleuponprompt.replit.app'): string {
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Get unique categories and tags
  const categories = Array.from(new Set(prompts.flatMap(prompt => prompt.tags || [])));
  const tags = categories; // Same as categories for this implementation
  
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily', lastmod: now },
    { url: '/create', priority: '0.8', changefreq: 'weekly', lastmod: now },
  ];
  
  const promptPages = prompts.map(prompt => ({
    url: `/prompt/${createSlug(prompt.title)}-${prompt.id}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: prompt.lastUpdated ? new Date(prompt.lastUpdated).toISOString().split('T')[0] : now
  }));
  
  const categoryPages = categories.map(category => ({
    url: `/category/${encodeURIComponent(category)}`,
    priority: '0.7',
    changefreq: 'daily',
    lastmod: now
  }));
  
  const tagPages = tags.map(tag => ({
    url: `/tag/${encodeURIComponent(tag)}`,
    priority: '0.6',
    changefreq: 'daily',
    lastmod: now
  }));
  
  const allPages = [...staticPages, ...promptPages, ...categoryPages, ...tagPages];
  
  const urls = allPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : `<lastmod>${now}</lastmod>`}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}