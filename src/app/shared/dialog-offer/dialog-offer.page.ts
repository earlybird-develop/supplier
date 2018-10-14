import {Component, OnInit, Input} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
@Component({
    selector: 'dialog-offer',
    templateUrl: 'dialog-offer.page.html',
    styleUrls: ['./dialog-offer.page.scss']
})

export class DialogOffer implements OnInit {

    constructor(public bsModalRef: BsModalRef) { }

    ngOnInit() {

    }
}