import { Component, OnDestroy, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { TranslateService } from '@ngx-translate/core';

import { Market } from '../../models';
import { MarketsHeaderComponent } from '../../components';
import {
  ISelectOption
} from '../../../shared/custom-select/custom-select.component';

import {
  MarketsService,
  SubheaderService
} from '../../services';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DialogMarketOpen } from '../../../shared/dialog-market-open/dialog-market-open.page'


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
    { id: 1, value: this.translate.instant('supplier.pages.markets.apr') }
  ];
  public offerType = this.offerTypes[0];
  public offerPercent = 0;
  public processingLoading = false;

  private refresh_time = 30000;
  private _interval: any;
  public bsModalRef: BsModalRef;

  constructor(private _marketsService: MarketsService,
              private _subheader: SubheaderService,
              private _toastr: ToastrService,
              private modalService: BsModalService,
              private translate: TranslateService) {
      }

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
        error => console.error(error)
      );
  }

  public showProcessing(market: Market): boolean{
      return market.showProcess;
  }

  public setParticipation(market: Market, value: boolean): void {

    this._marketsService
      .setParticipation(market.id, value)
      .subscribe(
        sucess => {

            market.isParticipation = value ? 1 : 0;

           const initialState = {};
          if (market.isParticipation == 1) {
              this.bsModalRef = this.modalService.show(DialogMarketOpen, Object.assign({}, { class: 'dialog-market-open', initialState }));
          }

            this._toastr.success('提交成功!');
            this.load();
        },
        error => {
            this._toastr.error('提交失败!')
            this.load();
        }
      )

  }

  public setOfferApr(market, val: number): void {

     market.offerApr = val;
    this._marketsService
      .setOfferApr(market.id, market.minPayment, val)
        .subscribe(
            success => {

              market.offerStatus = 1;
              this._toastr.success('提交成功!');
              this.load()

            },
            error => {
                this._toastr.error('提交失败');
                this.load();
            }
        );

  }

  public configureOffer(market: Market): void {
    market.showProcess = true;

    this._marketsService.configureOffer(
      this.offerType.value,
      this.offerPercent,
      0,
      market.id
    )
    .subscribe(
        () => {
            market.showProcess = false;
            this.load();
        }
    )
  }
}
