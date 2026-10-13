/*
 * Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { type VivaldiApi } from '@vivaldi/config';

const hosts = [] satisfies VivaldiApi['hosts'];

export default {
  hosts,

  apis: [],
} satisfies VivaldiApi<typeof hosts>;
