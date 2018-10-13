import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import {
  ISelectOption
} from '../../../shared/custom-select/custom-select.component';

import { EnquiryService } from '../../../supplier/services';
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss']
})
export class EnquiryComponent {
    constructor(private router: Router,
        private _enquiryService: EnquiryService,
        private _toastr: ToastrService,
        private translate: TranslateService) {

    }

  public roles: ISelectOption[] = [
    { id: 1, value: 'Admin 1' },
    { id: 2, value: 'Admin 2' },
    { id: 3, value: 'Admin 3' },
    { id: 4, value: 'Admin 4' },
    { id: 5, value: 'Admin 5' },
    { id: 6, value: 'Admin 6' },
    { id: 7, value: 'Admin 7' }
  ];

  public regions: ISelectOption[] = [
    { id: 1, value: 'Role 1' },
    { id: 2, value: 'Role 2' },
    { id: 3, value: 'Role 3' },
    { id: 4, value: 'Role 4' },
    { id: 5, value: 'Role 5' }
  ];

  public interests: ISelectOption[] = [
    { id: 1, value: 'Interest 1' },
    { id: 2, value: 'Interest 2' },
    { id: 3, value: 'Interest 3' },
    { id: 4, value: 'Interest 4' },
    { id: 5, value: 'Interest 5' }
  ];

  public roleType = this.roles[0];
  public regionType = this.regions[0];
  public interestType = this.interests[0];

  public make(form: NgForm): void {
      form.value["workrole"] = this.roleType.value;
      form.value["region"] = this.regionType.value;
      form.value["interested"] = this.interestType.value;

      this._enquiryService
          .make(form.value)
          .subscribe(
          () => this.translate.get("core.pages.enquiry.success-tip")
              .subscribe(res => {
                  this._toastr.success(res);
              }),
          () => this._toastr.error('Make Error')
          );
  }
}
