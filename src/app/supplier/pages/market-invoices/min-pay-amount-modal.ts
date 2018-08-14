import {Component, OnInit, Input} from '@angular/core';
import { Market } from '../../models';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
@Component({
  selector: 'min-pay-amount',
  templateUrl: 'min-pay-amount-modal.html',
  styleUrls: ['./market-invoices.page.scss']
})

export class MinPayAmountModal implements OnInit {
  public paymentValue : any;
  public marketValue : any;
  public call: any;
  public values: any;
  @Input() public market: Market;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.marketValue = {};
    this.marketValue.showConfirmPage = false;
    if(this.market){
      this.marketValue.offer_value = this.market && this.market.offerApr ? this.market.offerApr : "0";
      if(this.market.minPayment > 0){
        this.marketValue.showFixedLine = true;
        this.paymentValue = this.market.minPayment
      }else{
        this.marketValue.showFixedLine = false;
        this.paymentValue = "0";
      }
    }
  }

  onSelectValue(event){
    if(event.target.value == "1"){
      this.marketValue.showFixedLine = true;
    }else{
      this.marketValue.showFixedLine = false;
    }
  }

  onChangeMinPayment(event){
    let regex = new RegExp('^[0-9\.]+$');
    if(!regex.test(event.target.value)){
      this.paymentValue = "";
    }else{
      return;
    }
  }

  onSet(){
    this.marketValue.showConfirmPage = true;
  }

  goBack(){
    this.marketValue.showConfirmPage = false;
  }
  onSubmitValue(){
    this.values = {};
    this.values.offer_value = this.marketValue.offer_value;
    if(this.marketValue.showFixedLine){
      this.values.min_payment = this.paymentValue;
    }else{
      this.values.min_payment = "-1";
    }
    this.call(this.values);
  }
}