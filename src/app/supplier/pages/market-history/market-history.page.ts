import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Award, HistoryMarket } from '../../models';
import { MarketHeaderComponent } from '../../components';
import { SubheaderService, MarketHistoryService } from '../../services';
import { Angular2Csv } from 'angular2-csv';

@Component({
  selector: 'eb-market-history',
  templateUrl: './market-history.page.html',
  styleUrls: ['./market-history.page.scss']
})
export class MarketHistoryPage implements OnInit {
  public buyId: string;
  public fromDays = 7;
  public filter: { startdate: string; enddate: string };
  public isCustomRange = false;
  public awards: Award[] = [];
  public market: HistoryMarket;
  public customFrom: string;
  public customTo: string;
  public checkbox = false;

  constructor(
    private _marketHistory: MarketHistoryService,
    private _subheader: SubheaderService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buyId = this._route.parent.snapshot.params.id;
    const subhHeader = this._subheader.show(MarketHeaderComponent);
    subhHeader.buyId = this.buyId;
    this.setDays(7);
    this.load();
  }

  public load(): void {
    this._marketHistory
      .get(this.buyId, this.filter)
      .subscribe(x => (this.market = x));
    this._marketHistory
      .getAwardedList(this.buyId, this.filter)
      .subscribe(x => (this.awards = x));
  }

  public downloadAwardedDetailsCsv(id: string): void {
    this._marketHistory.downloadAwardedDetailsCsv(id).subscribe(awards => {
      const params = { useBom: false };
      const csv = new Angular2Csv(awards, 'Invoices', params);
    });
  }

  public downloadAwardedDetailsExcel(id: string): void {
    this._marketHistory.downloadAwardedDetailsExcel(id).subscribe(binData => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      const blob = new Blob([binData], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'history.xls';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // public chartHandler(data: Object[]): void {
  //   this.graphData = data;
  //   this.barChartLabels = this.graphData.map(x => x['date']);

  //   this.barChartData = [
  //     {
  //       data: this.graphData.map(x => x['awarded_amount']),
  //       label: 'Amount',
  //       hoverBackgroundColor: '#4f7dc9'
  //     },
  //     {
  //       data: this.graphData.map(x => x['awarded_discount']),
  //       label: 'Discount',
  //       hoverBackgroundColor: '#e6f0ff'
  //     }
  //   ];

  //   setTimeout(() => this._chart['refresh'](), 0);
  // }

  public setDays(days: number): void {
    this.isCustomRange = false;
    this.fromDays = days;
    const toDate = new Date();
    const fromDate = new Date().setDate(toDate.getDate() - days);
    this.filter = {
      startdate: this._dateFormat(fromDate),
      enddate: this._dateFormat(toDate)
    };
    this.load();
  }

  public setCustomRange(): void {
    this.isCustomRange = true;
    this.fromDays = 0;
  }

  public goCustomRange(): void {
    const pipe = new DatePipe('EN');
    this.filter.startdate = pipe.transform(this.customFrom, 'yyyy-MM-dd');
    this.filter.enddate = pipe.transform(this.customTo, 'yyyy-MM-dd');
    this.load();
  }

  public exportToCsv(): void {
    const invoices = this.awards.map(x => x._toJSON());
    const params = { useBom: false };
    const csv = new Angular2Csv(invoices, 'History', params);
  }

  private _dateFormat(date: Date | number): string {
    const pipe = new DatePipe('EN');
    return pipe.transform(date, 'yyyy-MM-dd');
  }

  // 全选按钮
  public setCheckedHistory(e: Event): void {
    // this.awards.map(x => (x = e.target['checked']));
    // console.log(this.awards);
  }
}
