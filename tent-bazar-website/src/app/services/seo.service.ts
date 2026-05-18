import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly siteName = 'Aditya Agency & Tent Bazar';
  private readonly baseUrl = 'https://tentbazaar.in';

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  setPage(config: {
    title: string;
    description: string;
    path?: string;
    image?: string;
    keywords?: string;
    jsonLd?: object;
  }) {
    const fullTitle = `${config.title} | ${this.siteName}`;
    const url = config.path ? `${this.baseUrl}${config.path}` : this.baseUrl;
    const image = config.image || `${this.baseUrl}/assets/images/logo.svg`;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonicalUrl(url);

    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    }
  }

  private setCanonicalUrl(url: string) {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data: object) {
    let script = this.document.getElementById('structured-data') as HTMLScriptElement;
    if (!script) {
      script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('id', 'structured-data');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
