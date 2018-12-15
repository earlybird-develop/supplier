// tslint:disable-next-line:max-line-length
import { Component, OnInit} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs/Subject';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-market-open',
  templateUrl: 'dialog-market-open.page.html',
  styleUrls: ['./dialog-market-open.page.scss']
})
export class DialogMarketOpen implements OnInit {

  // 判断不在显示信息单选框是否被选择
  public checkedClick = false;

  constructor(public bsModalRef: BsModalRef) {}

  public active = false;
  public onClose: Subject<any>;

  ngOnInit() {

    // 创建一个Rxjs Subject
    this.onClose = new Subject();
  }

  // 参与市场
  public dialogJoin() {
    if (this.checkedClick === true) {
      this.onClose.next({ name: 'dialogJoin', val: '0' });
      this.bsModalRef.hide();
    } else {
      this.onClose.next({ name: 'dialogJoin', val: '1' });
      this.bsModalRef.hide();
    }
  }

  // 取消参与市场
  public dialogCancel() {
    if (this.checkedClick === true) {
      this.onClose.next({ name: 'dialogCancel', val: '0' });
      this.bsModalRef.hide();
    } else {
      this.onClose.next({ name: 'dialogCancel', val: '1' });
      this.bsModalRef.hide();
    }
  }

  // 判断不在显示信息单选框是否被选择
  public checkedclick() {
    if (this.checkedClick === false) {
      this.checkedClick = true;
    } else {
      this.checkedClick = false;
    }
  }


}
