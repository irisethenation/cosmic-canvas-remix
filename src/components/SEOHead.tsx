import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  jsonLd?: object;
}

const SEOHead = ({
  title,
  description,
  canonicalUrl,
  ogImage = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200",
  ogType = "website",
  jsonLd,
}: SEOHeadProps) => {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Basic meta tags
    setMetaTag("description", description);
    
    // Open Graph tags
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:type", ogType, true);
    setMetaTag("og:image", ogImage, true);
    
    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", ogImage);

    // Canonical URL
    if (canonicalUrl) {
      setMetaTag("og:url", canonicalUrl, true);
      
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonicalUrl);
    }

    // JSON-LD structured data
    if (jsonLd) {
      // Remove existing JSON-LD script if present
      const existingScript = document.querySelector('script[data-seo-jsonld]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    }
  }, [title, description, canonicalUrl, ogImage, ogType, jsonLd]);

  return null;
};

export default SEOHead;
