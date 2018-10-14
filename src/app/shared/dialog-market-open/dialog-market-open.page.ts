import {Component, OnInit, Input} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
@Component({
    selector: 'dialog-market-open',
    templateUrl: 'dialog-market-open.page.html',
    styleUrls: ['./dialog-market-open.page.scss']
})

export class DialogMarketOpen implements OnInit {

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() {

    }
}