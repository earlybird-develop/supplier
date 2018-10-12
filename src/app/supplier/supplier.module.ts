import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MinPayAmountModal } from  './pages/market-invoices/min-pay-amount-modal';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SupplierRoutingModule } from './supplier-routing.module';


import {
  WrapperPage,
  MarketsPage,
  MarketInvoicesPage,
  MarketPage,
  MarketHistoryPage,
  ProfilePage,
  AccountPage,
  ChangePasswordPage,
  SigninPage,
  ForgetPasswordPage,
} from './pages';

import {
    AccountService,
    EnquiryService,
  MarketsService,
  SubheaderService,
  MarketHistoryService
} from './services';

import {
  HeaderComponent,
  MarketsHeaderComponent,
  MarketHeaderComponent
} from './components';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    RouterModule,
    SharedModule,
    NoopAnimationsModule,
    SupplierRoutingModule,
    TranslateModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    WrapperPage,
    MarketsPage,
    MarketInvoicesPage,
    MarketPage,
    MarketHistoryPage,
    ProfilePage,
    AccountPage,
    ChangePasswordPage,
    SigninPage,
    ForgetPasswordPage,

    HeaderComponent,
    MarketsHeaderComponent,
    MarketHeaderComponent,
    MinPayAmountModal
  ],
  providers: [
    AccountService,
    MarketsService,
    SubheaderService,
      MarketHistoryService,
      EnquiryService
  ],
  entryComponents: [
    MarketsHeaderComponent,
    MarketHeaderComponent,
    MinPayAmountModal
  ]
})
export class SupplierModule { }
