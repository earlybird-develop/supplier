// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import 'rxjs/add/operator/finally';

import { MarketsService, InvoiceType, SubheaderService } from '../../services';
import { Market, Invoice, InvoicesFilter } from '../../models';
import { MarketHeaderComponent } from '../../components';
// tslint:disable-next-line:max-line-length
import { MinPayAmountModal } from '../../pages/market-invoices/min-pay-amount-modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DatePipe } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { DialogMarketOpen } from '../../../shared/dialog-market-open/dialog-market-open.page';
import { DialogOffer } from '../../../shared/dialog-offer/dialog-offer.page';


@Component({
  selector: 'eb-market-invoices',
  templateUrl: './market-invoices.page.html',
  styleUrls: ['./market-invoices.page.scss']
})
export class MarketInvoicesPage implements OnInit, OnDestroy {
  public buyId: string;
  public search = '';
  public checkbox = false;
  public market: Market = new Market();
  public invoices: Invoice[] = [];
  public filter = new InvoicesFilter();
  public invoiceType: any;
  public isParticipation = false;
  // 遮罩层判断
  public participationLoading = false;
  public bsModalRef: BsModalRef;

  private refresh_time = 5000;

  private _interval: any;

  public startDate: string;
  public endDate: string;

  // 倒计时时间
  public loadingTime = 60;

  // 判断是否刷新页面
  private refresh_data = false;

  private current_hash = [];

  private _code: string;


  public allInvoices = [];
  public isStatusInvoice = false;
  constructor(public marketsService: MarketsService,
    private _route: ActivatedRoute,
    private _toastr: ToastrService,
    private _subheader: SubheaderService,
    private modalService: BsModalService) {
      this.buyId = this._route.parent.snapshot.params.id;
    }

  ngOnInit() {
    this.load_hash();
    const subhHeader = this._subheader.show(MarketHeaderComponent);
    subhHeader.buyId = this.buyId;

    this.marketsService
      .getStat(this.buyId)
      .subscribe(
        market => {

          this.market = market;
          subhHeader.payDate = this.market.nextPaydate;
          subhHeader.buyerName = this.market.buyerName;
          this.isParticipation = this.market.isParticipation === 1;
        },
        errors => console.error(errors)
      );

    this._interval = setInterval(
      () => {

        this.load_hash();

        if (this.refresh_data) {
          this.getStat();
          this.loadInvoices();
        }

      }, this.refresh_time
    );


    this.setInvoiceType(InvoiceType.Eligible);
  }

  load_hash() {
    this.marketsService
      .getHashList([this.buyId])
      .subscribe(
        resp => {
          if (resp.code === 1) {

            // tslint:disable-next-line:max-line-length
            /*if (resp.data.length !== this.current_hash.length && this.current_hash.length > 0) {
              this.current_hash = [];
            }*/

            for (const hash of resp.data) {
              this._code = hash['cashpool_code'];
              if (this.current_hash.includes(this._code)) {  // 判断当前页面是否有该市场键
                if (this.current_hash[this._code] !== hash['stat_hash']) {
                  this.current_hash[this._code] = hash['stat_hash'];
                  this.refresh_data = true;
                } else {
                  this.refresh_data = false;
                }
              } else {
                this.current_hash.push(this._code);
                this.current_hash[this._code] = hash['stat_hash'];

                if (!this.refresh_data) {
                  this.refresh_data = true;
                }
              }
            }
          } else {
            this._toastr.warning(resp.msg);
          }
        }, error => {
          this._toastr.error('Internal server error');
        }
      );
  }

  getStat() {
    this.marketsService
      .getStat(this.buyId)
      .subscribe(
        market => {
          this.market = market;
        },
        errors => console.error(errors)
      );
  }

  ngOnDestroy() {

    clearInterval(this._interval);

  }

  openMinAmountModal() {

      if (this.market.buyerStatus === 0) {
          return;
      }

    const ref = this;
    const initialState = {
      market: this.market,
      call: function call(val) {
        ref.onSubmit(val);
      }
    };

    // tslint:disable-next-line:max-line-length
    this.bsModalRef = this.modalService.show(MinPayAmountModal, Object.assign({}, { class: 'modal-initial-pay', initialState }));
  }

  public onSubmit(val) {
    this.marketsService
      .setOfferApr(this.buyId, val.min_payment, val.offer_value)
      .finally(() => this.participationLoading = false)
      .subscribe(
          () => null
      )
    ;
    this.bsModalRef.hide();
    this.getStat();
  }

  public setInvoiceType(type): void {

    let allInvoices;
    this.allInvoices = [];
    this.isStatusInvoice = false;
    allInvoices = ['eligible', 'ineligible', 'adjustments', 'awarded'];

    if (type === 'all') {
      this.isStatusInvoice = true;
      allInvoices.forEach(element => {
        this.invoiceType = element;
        this.loadInvoices();
      });
      this.invoiceType = 'all';
    } else {
      this.invoiceType = type;
      this.loadInvoices();
    }

  }


  public loadInvoices(): void {
    this.checkbox = false;
    this.marketsService
      .getInvoices(this.buyId, this.filter, this.invoiceType)
      .subscribe(
        invoices => {
          if (this.isStatusInvoice === true) {
            this.allInvoices = this.allInvoices.concat(invoices);
            this.invoices = this.allInvoices;
          } else {
            this.invoices = invoices;
          }
        },
        errors => console.error(errors)
      );
  }

  public setIncluded(isIncluded = true): void {
    const incIds: string[] = this.invoices
      .filter(x => x._checked)
      .map(x => x.invId.toString());

    if (incIds.length === 0) {
      return;
    }

    this.marketsService
      .setInvoicesInclude(incIds, this.buyId, isIncluded)
      .subscribe(() => this.loadInvoices());
  }

  public toggleDpe(value: number, e: Event): void {
    this.filter.toggleDpe(value, e);
    this.loadInvoices();
  }

  public toggleAmount(value: number, e: Event): void {
    this.filter.toggleAmount(value, e);
    this.loadInvoices();
  }

  public goCustomRange(): void {
      const pipe = new DatePipe('EN');
      this.filter.startDate = pipe.transform(this.startDate, 'yyyy-MM-dd');
      this.filter.endDate = pipe.transform(this.endDate, 'yyyy-MM-dd');

      this.loadInvoices();
  }

  public setCheckedInvoices(e: Event): void {
    this.invoices.map(x => x._checked = e.target['checked']);
  }

  public exportToCsv(): void {
    const invoices = this.invoices
      .filter(x => x._checked)
      .map(x => x._toJSON());

    const params = { useBom: false };
    const csv = new Angular2Csv(invoices, 'Invoices', params);
  }

  public setPayAmount(amount: number): void {
    this.marketsService
      .setOfferApr(this.market.id, amount, this.market.offerApr)
      .subscribe(() => this.market.minPayment = amount * 100);
  }

  public setOfferApr(apr: number): void {
    this._interval = setInterval(
      () => {
        this.loadingTime--;
      }, 1000
    );
    // 遮罩层打开
    this.participationLoading = true;
    // todo : This hack needs to be removed when api will work
    this.market.offerApr = apr;
    this.market.offerStatus = 1;

    this.marketsService
      .setOfferApr(this.market.id, this.market.minPayment, apr)
      .subscribe(
          () => {
              this.market.offerApr = apr;
              this.participationLoading = false;
          },
          error => {
              this._toastr.error('提交失败');
              this.participationLoading = false;
          }
      );
  }

  public setParticipation(value: boolean): void {

   if ( this.market.buyerStatus === 1) {
      this.participationLoading = true;
   }

    // todo : This hack needs to be removed when api will work
    this.isParticipation = value;

    // 这里打开关闭参与的市场时，都要将 开价禁用
    this.market.offerStatus = 1;

    this.marketsService
      .setParticipation(this.buyId, value)
        .finally(() => {
            this.participationLoading = false;
            const initialState = {};
            if (this.isParticipation) {
                // tslint:disable-next-line:max-line-length
                this.bsModalRef = this.modalService.show(DialogMarketOpen, Object.assign({}, { class: 'dialog-market-open', initialState }));
            }
        })
      .subscribe(() => null);
  }
}
