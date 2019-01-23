import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ISelectOption } from '../../../shared/custom-select/custom-select.component';
import { EnquiryService } from '../../../supplier/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss']
})
export class EnquiryComponent implements OnInit {
  constructor(private router: Router,
    private _enquiryService: EnquiryService,
    private _toastr: ToastrService,
    private translate: TranslateService) {
  }

  private isObject(item): boolean {
    return Object.prototype.toString.call(item) === '[object Object]';
  }

  ngOnInit() {
    this._enquiryService
      .get_dropdown()
      .subscribe(
        dropdown => {
          let option: ISelectOption;
          if (dropdown.hasOwnProperty('role')) {
            for (const val of dropdown['role']) {
              option = {
                id: val['id'],
                value: val['value']
              };
              this.roles.push(option);
            }
          }

          if (dropdown.hasOwnProperty('region')) {
            for (const val of dropdown['region']) {
              option = {
                id: val['id'],
                value: val['value']
              };
              this.regions.push(option);
            }
          }

          if (dropdown.hasOwnProperty('interest')) {
            for (const val of dropdown['interest']) {
              option = {
                id: val['id'],
                value: val['value']
              };
              this.interests.push(option);
            }
          }
        },
        error => console.error(error)
      );
  }

  public roles: ISelectOption[] = [];
  public regions: ISelectOption[] = [];
  public interests: ISelectOption[] = [];
  public roleType = this.roles[0];
  public regionType = this.regions[0];
  public interestType = this.interests[0];
  public lastNameValid = true; // 姓名有效验证
  public firstNameValid = true;  // 名字有效验证
  public companyValid = true;// 公司有效验证
  public roleValid = true;
  public regionValid = true;
  public interestsValid = true;
  public emailValid = true;  // 邮箱有效验证
  public emailCheck = true;

  onEmail(form: NgForm) {
    if (form) {
      this.emailCheck = form.form.get('email').valid;
      // 判断为邮箱
      const myreg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      const valid = myreg.test(form.value['email']);
      valid ? this.emailCheck = true : this.emailCheck = false;
    }
  }
  // 电话验证
  public phoneValid = true;
  onPhone(form: NgForm) {
    if (form) {
      this.phoneValid = form.form.get('phonenumber').valid;
      // 判断为手机
      const myreg = /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/;
      const valid = myreg.test(form.value['phonenumber']);
      valid ? this.phoneValid = true : this.phoneValid = false;
    }
  }

  public make(form: NgForm): void {
    // 选择角色验证提示
    if (this.roleType) {
      form.value['role'] = this.roleType.value;
      this.roleValid = true;
    } else {
      this.roleValid = false;
    }
    // 联系电话验证提示
    if (this.regionType) {
      this.regionValid = true;
      form.value['region'] = this.regionType.value;
    } else {
      this.regionValid = false;
    }
    // 兴趣验证提示
    if (this.interestType) {
      this.interestsValid = true;
      form.value['interested'] = this.interestType.value;
    } else {
      this.interestsValid = false;
    }
    // 名字有效验证提示
    if (form.value['lastname']) {
      this.lastNameValid = true;
    } else {
      this.lastNameValid = false;
    }
    // 姓名有效验证提示
    if (form.value['firstname']) {
      this.firstNameValid = true;
    } else {
      this.firstNameValid = false;
    }
    // 公司有效验证提示
    if (form.value['company']) {
      this.companyValid = true;
    } else {
      this.companyValid = false;
    }
    // 邮箱有效验证
    if (form.value['email']) {
      this.emailValid = true;
    } else {
      this.emailValid = false;
    }
    // 判断必填项是否错误在决定传值
    if (this.lastNameValid && this.firstNameValid && this.companyValid && this.emailValid && this.interestType && this.roleType && this.regionType && this.phoneValid && this.emailCheck) {
      this._enquiryService
        .make(form.value)
        .subscribe(
          () => this.translate.get('core.pages.enquiry.success-tip')
            .subscribe(res => {
              this._toastr.success(res);
            }),
          () => this._toastr.error('Make Error')
        );
    }
  }
}
