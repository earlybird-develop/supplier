import { Component, OnDestroy, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { Market } from '../../models';
import { MarketsHeaderComponent } from '../../components';
import {
  ISelectOption
} from '../../../shared/custom-select/custom-select.component';

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
  public hideMe = {};
  public offerTypes: ISelectOption[] = [
    { id: 1, value: 'APR' },
    { id: 2, value: 'DISC' },
  ];
  public offerType = this.offerTypes[0];
  public offerPercent = 0;
  public processingLoading = false;

  private refresh_time = 30000;
  private _interval: any;

  constructor(private _marketsService: MarketsService,
              private _subheader: SubheaderService,
              private _toastr: ToastrService) { }

  ngOnInit() {

    this._subheader.show(MarketsHeaderComponent);

    this.load();

    this._interval = setInterval(
      () => {
        this.load();
      }
      , this.refresh_time
    );


  }

  ngOnDestroy() {
    this._subheader.dispose();

    clearInterval(this._interval);

  }

  public load(): void{
    this._marketsService
      .getList()
      .subscribe(
        markets => this.markets = markets,
        errors => console.error(errors)
      );
  }

  public showProcessing(market: Market): boolean{
      return market.showProcess;
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

  public configureOffer(market: Market): void {
    market.showProcess = true;
    this._marketsService.configureOffer(
      this.offerType.value,
      this.offerPercent,
      0,
      market.id
    )
    .finally(() => market.showProcess = false)
    .subscribe(() => {})
  }
}
