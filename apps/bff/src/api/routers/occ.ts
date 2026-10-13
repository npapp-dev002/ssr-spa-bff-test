import { HttpRequestBuilder } from '@vivaldi/connectivity';
import { destinations } from '@repo/bff/contracts';
import { ProcedureParams } from '@vivaldi/trpc';
import { z } from 'zod';
import { Context } from '../context';
import { publicProcedure, router } from '../trpc';

type TypedDestinations = typeof destinations;
const occV2 = (ctx: { destinations: Context['destinations'] }) =>
  (ctx.destinations as unknown as TypedDestinations).occ.v2();

const getBaseSitesHeaders = {
  authorization: z.string().optional(),
};

export type getBaseSitesOptions = ProcedureParams<
  Context,
  z.ZodUndefined,
  typeof getBaseSitesHeaders
>;

export const getBaseSitesFn = async ({ ctx }: getBaseSitesOptions) => {
  return ctx.execute.http(
    HttpRequestBuilder.get<unknown>('/basesites').addCustomHeaders({
      authorization: ctx.forwardHeaders['authorization'],
    }),
    occV2(ctx),
  );
};

export const occ = router({
  getBaseSites: publicProcedure
    .meta({ headers: getBaseSitesHeaders })
    .query(getBaseSitesFn),
});
