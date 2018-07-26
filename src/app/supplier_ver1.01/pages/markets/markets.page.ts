import { Component, OnDestroy, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { Market } from '../../models';
import { MarketsHeaderComponent } from '../../components';

import {
  MarketsService,
  SubheaderService
} from '../../services';


@Component({
  selector: 'eb-markets',
  templateUrl: './markets.page.html',
  styleUrls: ['./markets.page.scss']
})
export class MarketsPage implements OnInit, OnDestroy {
  public participation = 'all_on';
  public markets: Market[];

  constructor(private _marketsService: MarketsService,
              private _subheader: SubheaderService,
              private _toastr: ToastrService) { }

  ngOnInit() {
    this._subheader.show(MarketsHeaderComponent);

    this._marketsService
      .getList()
      .subscribe(
        markets => this.markets = markets,
        errors => console.error(errors)
      );
  }

  ngOnDestroy() {
    this._subheader.dispose();
  }

  public setParticipation(market: Market, value: boolean): void {
    this._marketsService
      .setParticipation(market.id, value)
      .subscribe(
        () => {
          market.isParticipation = value ? 1 : 0;
          this._toastr.success('Market updated!');
        },
        () => this._toastr.error('Internal server error')
      );
  }

  public setOfferApr(market, val: number): void {
    market.offerApr = val;

    this._marketsService
      .setOfferApr(market.id, market.minPayment, val)
      .subscribe(
        () => {
          market.offerApr = val;
          this._toastr.success('Market updated!');
        });
  }
}
