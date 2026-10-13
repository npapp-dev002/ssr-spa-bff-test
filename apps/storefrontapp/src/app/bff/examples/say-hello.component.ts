import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BffClientService } from '../bff-client.service';

@Component({
  selector: 'app-say-hello',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <h2>BFF Say Hello</h2>
    <input [(ngModel)]="name" placeholder="Your name" />
    <button (click)="sayHello()">Say Hello</button>
    @if (message()) { <p>{{ message() }}</p> }
    @if (error()) { <p style="color:red">{{ error() }}</p> }
  `,
})
export class SayHelloComponent {
  private readonly bff = inject(BffClientService);

  name = '';
  message = signal('');
  error = signal('');

  async sayHello(): Promise<void> {
    const res = await this.bff.client.sample.sayHello.query({ name: this.name });
    this.message.set(res.message);
  }
}
