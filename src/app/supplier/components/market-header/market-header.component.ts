import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'eb-market-header',
  templateUrl: './market-header.component.html',
  styleUrls: ['./market-header.component.scss']
})
export class MarketHeaderComponent {
  public buyId: string;
  public payDate: string;
  public buyerName: string;
  public timeArr: any;

  constructor(private _route: ActivatedRoute) {
    this.buyId = this._route.parent.snapshot.params.id;
  }

}
