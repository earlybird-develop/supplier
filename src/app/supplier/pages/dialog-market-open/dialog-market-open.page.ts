// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs/Subject';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-market-open',
  templateUrl: 'dialog-market-open.page.html',
  styleUrls: ['./dialog-market-open.page.scss']
})
export class DialogMarketOpen implements OnInit,OnDestroy {

  // 返回是否继续显示本弹框
  private isShow = true;
  // 返回是否为“确定”
  private isConfirm = false;

  constructor(public bsModalRef: BsModalRef) {}

  public onClose: Subject<any>;

  ngOnInit() {

    // 创建一个Rxjs Subject
    this.onClose = new Subject();
  }

  ngOnDestroy(){
      this.onClose.next({ IsConfirm: this.isConfirm, IsShow: this.isShow });
  }

  // 参与市场
  public doConfirm() {

    this.isConfirm = true;
    this.bsModalRef.hide();

  }

  // 取消参与市场
  public doCancel() {
    this.bsModalRef.hide();
  }

  // 判断不在显示信息单选框是否被选择
  public setCheckbox() {
    
    if (this.isShow === false) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }


}
