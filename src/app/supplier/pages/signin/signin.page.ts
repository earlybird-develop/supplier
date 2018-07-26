import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


import {
  AccountService
} from '../../services';



@Component({
  selector: 'eb-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss']
})
export class SigninPage {

  constructor(private router: Router,
              private _accountService: AccountService,
              private _toastr: ToastrService) {

  }

  ngOnInit() {


  }

  public login(form: NgForm): void {
    this._accountService
      .getAccessToken(form.value)
      .subscribe(
        () => this.router.navigate(['/supplier']),
        () => this._toastr.error('Login error')
      );
  }
}
