import { NgModule } from '@angular/core';
import { provideServer } from '@spartacus/setup/ssr';

@NgModule({
  providers: [
    ...provideServer({
      serverRequestOrigin:
        process.env['SERVER_REQUEST_ORIGIN'] ?? 'http://localhost:4200',
    }),
  ],
})
export class AppServerModule {}
