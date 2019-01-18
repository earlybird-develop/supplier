import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Market } from '../../models';
import { MarketsHeaderComponent } from '../../components';
import { ISelectOption } from '../../../shared/custom-select/custom-select.component';
import { MarketsService, SubheaderService } from '../../services';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DialogMarketOpen } from '../dialog-market-open/dialog-market-open.page';

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
  private refresh_time = 5000;
  private _interval: any;
  public bsModalRef: BsModalRef;
  private refresh_data = false;
  private current_hash = [];
  private _code: string;
  public user_profile: string;  // 用户信息
  public rkey = /^[0-9A-Za-z_@-]*$/;  // localStorage读取对象格式安全封装

  constructor(
    private _marketsService: MarketsService,
    private _subheader: SubheaderService,
    private _toastr: ToastrService,
    private modalService: BsModalService,
    private translate: TranslateService,
    private _http: HttpClient
  ) { }

  ngOnInit() {

    this._subheader.show(MarketsHeaderComponent);
    this.load_hash();
    this.load();
    this._interval = setInterval(() => {
      this.load_hash();
      if (this.refresh_data) {
        this.load();
      }
    }, this.refresh_time);
  }

  load_hash() {
    this._marketsService.getHashList([]).subscribe(
      resp => {
        if (resp.code === 1) {
          if (
            resp.data.length !== this.current_hash.length &&
            this.current_hash.length > 0
          ) {
            this.current_hash = [];
          }

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

  ngOnDestroy() {
    this._subheader.dispose();
    clearInterval(this._interval);
  }

  public load(): void {
    this._marketsService.getList().subscribe(
      markets => {
        this.markets = markets;
      },
      error => console.error(error)
    );
  }

  public showProcessing(market: Market): boolean {
    return market.showProcess;
  }

  private _setParticipation(market: Market, value: boolean): void {
    this._marketsService
      .setParticipation(market.id, value)
      .subscribe(
        sucess => {
          market.isParticipation = value ? 1 : 0;
          this._toastr.success('提交成功!');
        },
        error => {
          market.isParticipation = value ? 0 : 1;
          this._toastr.error('提交失败!');
        }
      );
  }

  public setParticipation(market: Market, value: boolean): void {
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
              market.isParticipation = value ? 0 : 1;
            } else {
              this._setParticipation(market, value);
            }
          }
        })

    } else {
      this._setParticipation(market, value);
    }

  }



  public setOfferApr(market, val: number): void {
    market.offerApr = val;
    this._marketsService
      .setOfferApr(market.id, market.minPayment, val)
      .subscribe(
        success => {
          market.offerStatus = 1;
          this._toastr.success('提交成功!');
          this.load();
        },
        error => {
          this._toastr.error('提交失败');
          this.load();
        }
      );
  }

  public configureOffer(market: Market): void {
    market.showProcess = true;
    this._marketsService
      .configureOffer(this.offerType.value, this.offerPercent, 0, market.id)
      .subscribe(() => {
        market.showProcess = false;
        this.load();
      });
  }
}
