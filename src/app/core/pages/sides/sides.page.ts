import { Component } from '@angular/core';

@Component({
  selector: 'eb-sides',
  template: `
    <div class="text-center">
      <a [routerLink]="['/supplier/signin']">Supplier</a>
      |
      <a [routerLink]="['/buyer/signin']">Buyer</a>
    </div>
  `,
  styles: [`
    .text-center {
      margin-top: 100px;
    }
  `]
})
export class SidesPage { }
