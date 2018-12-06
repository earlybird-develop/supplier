import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'eb-sidebarable-page',
  templateUrl: './sidebarable-page.component.html',
  styleUrls: ['./sidebarable-page.component.scss']
})
export class SidebarablePageComponent {

  public buyId: string;

  constructor(private _route: ActivatedRoute) {
    this.buyId = this._route.parent.snapshot.params.id;
  }
}
