import {Component, OnInit, Input} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TimerService } from '../timer/timer.service';

@Component({
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


   constructor(public bsModalRef: BsModalRef,private _timer: TimerService) { }



  ngOnChanges(){}

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

          this._value = value;

          this._convertTimer();


        }
      );

    setInterval(() => this._convertTimer(), 10000);

  }

  private _convertTimer(): void {

      if ( this._value > 0 ){
          if( this.isClosed){
              this.isClosed = false;
          }
          this._value--;
          this.hours = Math.floor(this._value / 3600);
          this.minutes = Math.floor((this._value - this.hours * 3600) / 60);
          this.seconds = this._value - this.minutes * 60 - this.hours * 3600;
      }else{
          if(!this.isClosed ){
              this.isClosed = true;
          }
      }
      // console.log(this.hours);
      // console.log(this.minutes);
  }
}
