import { inject, Injector } from '@angular/core';
import { AuthHttpHeaderService, AuthService, AuthToken } from '@spartacus/core';
import type { Operation, TRPCLink } from '@trpc/client';
import type { AnyTRPCRouter } from '@trpc/server';
import { fromRxObservable, toRxObservable } from '@vivaldi/angular/utils';
import { OperationHeaders } from '@vivaldi/trpc/universal';
import { of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

export const bffAuthLink: TRPCLink<AnyTRPCRouter> = () => {
  const injector = inject(Injector);

  return ({ next, op }) => {
    const authService = injector.get(AuthService);
    const authHeaderService = injector.get(AuthHttpHeaderService);

    return fromRxObservable(
      authService.isUserLoggedIn().pipe(
        switchMap((isLoggedIn) =>
          isLoggedIn ? authHeaderService.getStableToken() : of(undefined),
        ),
        switchMap((token) =>
          toRxObservable(
            token ? next(createAuthHeader(op, token)) : next(op),
          ),
        ),
        first(),
      ),
    );
  };
};

function createAuthHeader(op: Operation, token: AuthToken) {
  const headers = new OperationHeaders(op);
  const tokenType = token.token_type || 'Bearer';
  const accessToken = token.access_token;

  if (!accessToken || typeof accessToken !== 'string') {
    return op;
  }

  // Strip newlines — Node.js rejects header values containing \r or \n.
  const sanitizedToken = accessToken.replace(/[\r\n]/g, '');

  return headers.append('Authorization', `${tokenType} ${sanitizedToken}`);
}
