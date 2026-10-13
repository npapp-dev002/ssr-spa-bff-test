import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Meta } from '@angular/platform-browser';

// Inlined until BFF meta tag constants are released in @spartacus/core (CXSPA-13587).
const BFF_BASE_URL_META_TAG_NAME = 'bff-base-url';
const BFF_BASE_URL_META_TAG_PLACEHOLDER = 'BFF_BASE_URL_VALUE';

export const BFF_BASE_URL = new InjectionToken<string>('BFF_BASE_URL', {
  providedIn: 'root',
  factory: () => {
    const platformId = inject(PLATFORM_ID);
    const meta = inject(Meta);
    const tag = meta.getTag(`name="${BFF_BASE_URL_META_TAG_NAME}"`);
    const content = tag?.content ?? '';
    const configured = content && content !== BFF_BASE_URL_META_TAG_PLACEHOLDER;

    if (configured) {
      return content;
    }
    // On the server there is no dev proxy and relative URLs have no origin.
    if (isPlatformServer(platformId)) {
      return process.env['BFF_SSR_BASE_URL'] || 'https://localhost:8482/bff/api';
    }
    return '/bff/api';
  },
});
