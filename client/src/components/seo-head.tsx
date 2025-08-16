import { useEffect } from 'react';
import { generateMetaDescription, generatePageTitle, generateStructuredData, generateOpenGraphTags } from '../../../lib/seo-utils';

interface SEOHeadProps {
  title?: string;
  description?: string;
  prompt?: any;
  canonicalUrl?: string;
}

export function SEOHead({ title, description, prompt, canonicalUrl }: SEOHeadProps) {
  useEffect(() => {
    // Set document title
    if (title) {
      document.title = title;
    } else if (prompt) {
      document.title = generatePageTitle(prompt);
    } else {
      document.title = 'StumbleUponPrompt - Discover Quality AI Prompts';
    }

    // Set meta description
    const metaDesc = description || (prompt ? generateMetaDescription(prompt) : 
      'Discover high-quality AI prompts for ChatGPT, Claude, and Gemini. Stumble through curated prompts with one-click integration.');
    
    let descriptionMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.content = metaDesc;

    // Set canonical URL
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonicalUrl;
    }

    // Set Open Graph and Twitter tags
    if (prompt) {
      const currentUrl = window.location.href;
      const ogTags = generateOpenGraphTags(prompt, currentUrl);
      
      Object.entries(ogTags).forEach(([property, content]) => {
        const isTwitter = property.startsWith('twitter:');
        const metaProperty = isTwitter ? 'name' : 'property';
        
        let meta = document.querySelector(`meta[${metaProperty}="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(metaProperty, property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      });
    }

    // Set structured data
    if (prompt) {
      const structuredData = generateStructuredData(prompt);
      
      let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      if (prompt) {
        // Remove prompt-specific meta tags
        const metasToRemove = [
          'meta[property^="og:"]',
          'meta[name^="twitter:"]',
          'script[type="application/ld+json"]'
        ];
        
        metasToRemove.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });
      }
    };
  }, [title, description, prompt, canonicalUrl]);

  return null; // This component doesn't render anything
}