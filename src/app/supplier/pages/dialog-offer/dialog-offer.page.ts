﻿import {Component, OnInit, Input} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TimerService } from '../../../shared/timer/timer.service';
import { MarketsService } from '../../services';
import { Market } from '../../models';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-offer',
  templateUrl: 'dialog-offer.page.html',
  styleUrls: ['./dialog-offer.page.scss']
})
export class DialogOffer implements OnInit {
  private _value = 0;

  public isClosed = false;
  public seconds = 0;
  public minutes = 0;
  public hours = 0;

  // url的buyerId
  public buyId: string;

  // 下一个付款日期
  public payDate: string;

  // 判断不在显示信息单选框是否被选择
  public checkedClick = false;

  public market: Market = new Market();

  // tslint:disable-next-line:max-line-length
  constructor(
    public bsModalRef: BsModalRef,
    private _timer: TimerService,
    public marketsService: MarketsService
  ) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {}

  ngOnInit() {
    this.marketsService.getStat(this.buyId).subscribe(
      market => {
        this.market = market;
        this.payDate = this.market.nextPaydate;
      },
      errors => console.error(errors)
    );

    this._timer.getTradingTime().subscribe(x => {
      const value = x - Math.floor(+new Date() / 1000);

      if (x < 0 || value < 0) {
        this.isClosed = true;
        return;
      }

      this._value = value;

      this._convertTimer();
    });

    setInterval(() => this._convertTimer(), 10000);
  }

  private _convertTimer(): void {
    if (this._value > 0) {
      if (this.isClosed) {
        this.isClosed = false;
      }
      this._value--;
      this.hours = Math.floor(this._value / 3600);
      this.minutes = Math.floor((this._value - this.hours * 3600) / 60);
      this.seconds = this._value - this.minutes * 60 - this.hours * 3600;
    } else {
      if (!this.isClosed) {
        this.isClosed = true;
      }
    }
    // console.log(this.hours);
    // console.log(this.minutes);
  }

  // 判断不在显示信息单选框是否被选择
  public checkedclick() {
    if (this.checkedClick === false) {
      this.checkedClick = true;
    } else {
      this.checkedClick = false;
    }
  }

  // 设置缓存不在显示消息框
  public getcookie() {
    if (this.checkedClick === true) {
      localStorage.setItem('notOfferBox', 'true');
    }
    this.bsModalRef.hide();
  }
}
