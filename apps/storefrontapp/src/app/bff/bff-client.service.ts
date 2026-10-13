import { Injectable, inject } from '@angular/core';
import { createTRPCClient, createTerminationLink } from '@vivaldi/trpc/client';
import type { RootRouter } from '@repo/bff/clients';
import { BFF_BASE_URL } from './bff-base-url.token';
import { bffErrorHandlingLink } from './bff-error-handling.link';
import { bffAuthLink } from './bff-auth.link';
import { bffTimeoutLink } from './bff-timeout.link';

@Injectable({ providedIn: 'root' })
export class BffClientService {
  readonly client;

  constructor() {
    const bffBaseUrl = inject(BFF_BASE_URL);

    this.client = createTRPCClient<RootRouter>({
      links: [
        bffErrorHandlingLink,
        bffAuthLink,
        bffTimeoutLink,
        createTerminationLink<RootRouter>({ url: bffBaseUrl }),
      ],
    });
  }
}
