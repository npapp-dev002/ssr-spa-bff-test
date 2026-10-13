import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler, inject, isDevMode, PLATFORM_ID } from '@angular/core';
import { LoggerService } from '@spartacus/core';
import type { TRPCLink } from '@trpc/client';
import type { AnyTRPCRouter } from '@trpc/server';
import { tap } from '@trpc/server/observable';

export class OutboundHttpError extends Error {
  constructor(cause: unknown) {
    super('Outbound HTTP Error', { cause });
  }
}

export const bffErrorHandlingLink: TRPCLink<AnyTRPCRouter> = () => {
  const errorHandler = inject(ErrorHandler);
  const platformId = inject(PLATFORM_ID);
  const logger = inject(LoggerService);

  return ({ next, op }) => {
    try {
      return next(op).pipe(
        tap({
          error: (error: unknown) => {
            if (!isPlatformBrowser(platformId) || isDevMode()) {
              errorHandler.handleError(new OutboundHttpError(error));
            }
          },
        }),
      );
    } catch (error) {
      logger.error(op.path, error);
      if (!isPlatformBrowser(platformId) || isDevMode()) {
        errorHandler.handleError(new OutboundHttpError(error));
      }
      throw error;
    }
  };
};
