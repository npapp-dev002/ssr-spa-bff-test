import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { BffClientService } from '../bff-client.service';

@Component({
  selector: 'app-occ-base-sites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
  template: `
    <h2>OCC Base Sites (via BFF)</h2>
    <button (click)="load()">Load Base Sites</button>
    @if (result()) { <pre>{{ result() | json }}</pre> }
    @if (error()) { <p style="color:red">{{ error() }}</p> }
  `,
})
export class OccBaseSitesComponent {
  private readonly bff = inject(BffClientService);

  result = signal<unknown>(null);
  error = signal('');

  async load(): Promise<void> {
    const res = await this.bff.client.occ.getBaseSites.query();
    this.result.set(res);
  }
}
