import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TimerService } from './timer.service';

@Component({
  selector: 'eb-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  private _value = 0;
  public _endtime = 0;
  public isClosed = false;
  public seconds = 0;
  public minutes = 0;
  public hours = 0;
  public timeArr = { hour: 0, minute: 0, second: 0 };
  // @Output() timeNum = new EventEmitter<any>();

  constructor(private _timer: TimerService) {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
  }

  ngOnInit() {

    this._timer
      .getTradingTime()
      .subscribe(
        x => {
          const value = x - Math.floor(+new Date() / 1000);
          if (x < 0 || value < 0) {
            this.isClosed = true;
            return;
          }
          this._endtime = x;
          this._value = value;
          this._convertTimer();
        }
      );
    setInterval(() => this._convertTimer(), 10000);
  }

  private _convertTimer(): void {

    if (this._value > 0) {
      if (this.isClosed) {
        this.isClosed = false;
      }
      this._value = this._endtime - Math.floor(+new Date() / 1000);
      if (this._value < 0) {
        this._value = 0;
      }
      this.hours = Math.floor(this._value / 3600);
      this.minutes = Math.floor((this._value - this.hours * 3600) / 60);
      this.seconds = this._value - this.minutes * 60 - this.hours * 3600;
      // tslint:disable-next-line:max-line-length
      // this.timeArr = { hour: this.hours, minute: this.minutes, second: this.seconds };
      // this.timeNum.emit(this.timeArr);
    } else {
      if (!this.isClosed) {
        this.isClosed = true;
      }
    }
  }
}

