import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'eb-market-header',
  templateUrl: './market-header.component.html',
  styleUrls: ['./market-header.component.scss']
})
export class MarketHeaderComponent {
  public marketCode: string;
  public payDate: string;
  public marketName: string;
  public timeArr: any;

  constructor(private _route: ActivatedRoute) {
    this.marketCode = this._route.parent.snapshot.params.id;
  }

}
