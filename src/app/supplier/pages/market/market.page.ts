import { Component, OnDestroy } from '@angular/core';
import { SubheaderService } from '../../services';

@Component({
  selector: 'eb-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss']
})
export class MarketPage implements OnDestroy {

  constructor(private _subheader: SubheaderService) { }

  ngOnDestroy() {
    this._subheader.dispose();
  }
}
