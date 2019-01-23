import { Component, OnInit, OnDestroy, Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import 'rxjs/add/operator/finally';
import { MarketsService, InvoiceType, SubheaderService } from '../../services';
import { Market, Invoice, InvoicesFilter } from '../../models';
import { MarketHeaderComponent } from '../../components';
import { MinPayAmountModal } from './min-pay-amount-modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DatePipe } from '@angular/common';
import { DialogMarketOpen } from '../dialog-market-open/dialog-market-open.page';
import { InlineEditComponent } from '../../../shared/inline-edit/inline-edit.component';
import { DialogOffer } from '../dialog-offer/dialog-offer.page';

@Component({
  selector: 'eb-market-invoices',
  templateUrl: './market-invoices.page.html',
  styleUrls: ['./market-invoices.page.scss'],
  providers: [InlineEditComponent]
})
export class MarketInvoicesPage implements OnInit, OnDestroy {
  public marketId: string;
  public search = '';
  public checkbox = false;
  public market: Market = new Market();
  public invoices: Invoice[] = [];
  public filter = new InvoicesFilter();
  public invoiceType: any;
  public isParticipation: number;
  public participationLoading = false;  // 遮罩层判断
  public bsModalRef: BsModalRef;
  private refresh_time = 5000;
  private _interval: any;
  public startDate: string;
  public endDate: string;
  public loadingTime = 60;// 倒计时时间
  private refresh_data = false; // 判断是否刷新页面
  private current_hash = [];
  private _code: string;
  public markets: Market[];
  public user_profile: string; // 用户信息
  public allInvoices = [];
  public isStatusInvoice = false;
  public filterDate = [];
  public filterAmount = [];
  public filterInclude = 0;
  public filterAward = 0;

  constructor(
    public marketsService: MarketsService,
    private _route: ActivatedRoute,
    private _toastr: ToastrService,
    private _subheader: SubheaderService,
    private modalService: BsModalService,
    private inlineEdit: InlineEditComponent
  ) {
    this.marketId = this._route.parent.snapshot.params.id;
  }

  ngOnInit() {

    this.load_hash();
    const subhHeader = this._subheader.show(MarketHeaderComponent);
    subhHeader.marketId = this.marketId;

    this.marketsService.getStat(this.marketId).subscribe(
      market => {
        this.market = market;
        subhHeader.payDate = this.market.nextPaydate;
        subhHeader.marketName = this.market.marketName;
        this.isParticipation = this.market.isParticipation;
      },
      errors => console.error(errors)
    );

    this._interval = setInterval(() => {
      this.load_hash();

      if (this.refresh_data) {
        this.getStat();
        this.loadInvoices();
      }
    }, this.refresh_time);

    this.setInvoiceType(InvoiceType.Eligible);
  }

  load_hash() {
    this.marketsService.getHashList([this.marketId]).subscribe(
      resp => {
        if (resp.code === 1) {
          /*if (resp.data.length !== this.current_hash.length && this.current_hash.length > 0) {
              this.current_hash = [];
            }*/
          for (const hash of resp.data) {
            this._code = hash['cashpool_code'];
            if (this.current_hash.includes(this._code)) {
              // 判断当前页面是否有该市场键
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
      },
      error => {
        this._toastr.error('Internal server error');
      }
    );
  }

  getStat() {
    this.marketsService.getStat(this.marketId).subscribe(
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
    if (this.market.marketStatus === 0) {
      return;
    }
    const ref = this;
    const initialState = {
      market: this.market,
      call: function call(val) {
        ref.onSubmit(val);
      }
    };
    this.bsModalRef = this.modalService.show(
      MinPayAmountModal,
      Object.assign({}, { class: 'modal-initial-pay', initialState })
    );
  }

  public onSubmit(offer) {
    this.marketsService
      .setOfferApr(this.marketId, offer.min_payment, offer.offer_value)
      .finally(() => (this.participationLoading = false))
      .subscribe(() => null);
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
      this.loadAllInvoices();
      this.invoiceType = 'all';
    } else {
      this.invoiceType = type;
      this.loadInvoices();
    }
  }

  public loadAllInvoices(): void {
    this.checkbox = false;
    this.marketsService
      .getAllInvoices(this.marketId, this.filter)
      .subscribe(
        x => {
          console.log(x);
          this.invoices = x;
        },
        errors => console.error(errors)
      );
  }

  public loadInvoices(): void {
    this.checkbox = false;
    this.marketsService
      .getInvoices(this.marketId, this.filter, this.invoiceType)
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
      .setInvoicesInclude(incIds, this.marketId, isIncluded)
      .subscribe(() => this.loadInvoices());
  }

  public toggleDpe(value: number, e: Event, check: boolean): void {
    this.filter.toggleDpe(value, e);
    if (check) {
      this.filterDate.push(value);
    } else {
      var index = this.filterDate.indexOf(value);
      this.filterDate.splice(index, 1);
    }
  }

  public toggleInclude(num: number, checked: boolean) {
    if (checked) {
      this.filterInclude = this.filterInclude + num;
    } else {
      this.filterInclude = this.filterInclude - num;
    }
  }

  public toggleClearing(num: number, checked: boolean) {
    if (checked) {
      this.filterAward = this.filterAward + num;
    } else {
      this.filterAward = this.filterAward - num;
    }
  }

  public toggleAmount(value: number, e: Event, checked: boolean): void {
    this.filter.toggleAmount(value, e);
    if (checked) {
      this.filterAmount.push(value);
    } else {
      var index = this.filterAmount.indexOf(value);
      this.filterAmount.splice(index, 1);
    }
  }

  public goCustomRange(): void {
    const pipe = new DatePipe('EN');
    this.filter.startDate = pipe.transform(this.startDate, 'yyyy-MM-dd');
    this.filter.endDate = pipe.transform(this.endDate, 'yyyy-MM-dd');
    this.loadInvoices();
  }

  public setCheckedInvoices(e: Event): void {
    this.invoices.map(x => (x._checked = e.target['checked']));
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
      .subscribe(() => (this.market.minPayment = amount * 100));
  }

  public setOfferApr(apr: number): void {
    this._interval = setInterval(() => {
      this.loadingTime--;
    }, 1000);
    // 遮罩层打开

    if (this.inlineEdit.checkLocalStorage()) {
      this.setOfferAprToService();
    } else {
      var ref = this;
      const initialState = {
        values: apr,
        buyId: this.marketId,
        call: function call() {
          ref.setOfferAprToService();
        },
        cancel: function cancel() {
          ref.ngOnInit();
        }
      };
      this.bsModalRef = this.modalService.show(DialogOffer, Object.assign({ initialState }, { class: 'dialog-offer', initialState }));
    }
    this.market.offerApr = apr;
  }
  public setOfferAprToService() {
    this.participationLoading = true;
    this.market.offerStatus = 1;
    this.marketsService
      .setOfferApr(this.market.id, this.market.minPayment, this.market.offerApr)
      .subscribe(
        (response) => {
          console.log(response);
          this.participationLoading = false;
        },
        error => {
          this._toastr.error('提交失败');
          this.participationLoading = false;
        }
      );
  }

  private _setParticipation(value: boolean): void {
    if (this.market.marketStatus === 1) {
      this.participationLoading = true;
    }
    // 这里打开关闭参与的市场时，都要将 开价禁用
    this.market.offerStatus = 1;
    this.marketsService
      .setParticipation(this.market.id, value)
      .subscribe(
        sucess => {
          this.isParticipation = value ? 1 : 0;
          this.participationLoading = false;
          this._toastr.success('提交成功!');
          this.getStat();
        },
        error => {
          this.isParticipation = value ? 0 : 1;   //若执行失败则返回原来的值
          this.participationLoading = false;
          this._toastr.error('提交失败!');
          this.getStat();
        }
      )
  }

  public setParticipation(value: boolean): void {
    // 获取当前localStorage值
    let dialogShow = localStorage.getItem('dialogMarketOpen_' + localStorage.getItem('user_profile'));

    //判断如果是“参与”市场则判断是否要进行弹框提示
    if (value && !dialogShow) {

      const initialState = {};
      this.bsModalRef = this.modalService.show(
        DialogMarketOpen, Object.assign({}, { class: 'dialog-market-open', initialState })
      );

      this.bsModalRef.content.onClose.subscribe(
        result => {
          if (result) {
            // 当前选中不再显示按钮
            if (!result.IsShow) {
              localStorage.setItem('dialogMarketOpen_' + localStorage.getItem('user_profile'), "noshow");
            }
            // 判断当前选择是参与还是取消
            if (!result.IsConfirm) {
              this.market.isParticipation = value ? 0 : 1;
            } else {
              this._setParticipation(value);
            }
          }
        })

    } else {
      this._setParticipation(value);
    }
  }
}
