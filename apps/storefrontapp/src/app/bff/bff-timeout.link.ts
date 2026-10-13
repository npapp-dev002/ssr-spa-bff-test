import { isPlatformBrowser } from '@angular/common';
import { inject, isDevMode, PLATFORM_ID } from '@angular/core';
import { LoggerService } from '@spartacus/core';
import type { TRPCLink } from '@trpc/client';
import type { AnyTRPCRouter } from '@trpc/server';
import { fromRxObservable, toRxObservable } from '@vivaldi/angular/utils';
import { timeout, catchError, TimeoutError } from 'rxjs';

const DEFAULT_TIMEOUT_MS = 20_000;

export const bffTimeoutLink: TRPCLink<AnyTRPCRouter> = () => {
  const platformId = inject(PLATFORM_ID);
  const logger = inject(LoggerService);

  return ({ next, op }) => {
    const isBrowser = isPlatformBrowser(platformId);
    const timeoutMs = isBrowser ? undefined : DEFAULT_TIMEOUT_MS;

    if (!timeoutMs && !isDevMode()) {
      return next(op);
    }

    const effectiveTimeout = timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const abortController = new AbortController();
    op.signal = abortController.signal;

    return fromRxObservable(
      toRxObservable(next(op)).pipe(
        timeout(effectiveTimeout),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            abortController.abort();
            const message = `BFF procedure "${op.path}" timed out after ${effectiveTimeout}ms.`;
            logger.warn(message);
            throw new Error(message, { cause: error });
          }
          throw error;
        }),
      ),
    );
  };
};
