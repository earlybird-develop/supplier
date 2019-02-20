import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MinPayAmountModal } from './pages/market-invoices/min-pay-amount-modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SupplierRoutingModule } from './supplier-routing.module';
import { DialogMarketOpen } from './pages/dialog-market-open/dialog-market-open.page';
import { DialogOffer } from './pages/dialog-offer/dialog-offer.page';
import { PrivacyModal } from './pages/activation-account/privacy';
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
  ActivationAccountComponent,
  ResetPasswordComponent,
} from './pages';

import {
  AccountService,
  EnquiryService,
  MarketsService,
  SubheaderService,
  MarketHistoryService,
  ResetPasswordService,
  ActivationAccountService,
  AESService,
  MarketAuthorizationService
} from './services';

import {
  HeaderComponent,
  MarketsHeaderComponent,
  MarketHeaderComponent
} from './components';
import { SharedModule } from '../shared/shared.module';
import { MarketAuthorizationComponent } from './pages/market-authorization/market-authorization.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    DialogMarketOpen,
    DialogOffer,
    HeaderComponent,
    MarketsHeaderComponent,
    MarketHeaderComponent,
    MinPayAmountModal,
    PrivacyModal,
    ActivationAccountComponent,
    ResetPasswordComponent,
    MarketAuthorizationComponent

  ],
  providers: [
    AccountService,
    MarketsService,
    SubheaderService,
    MarketHistoryService,
    EnquiryService,
    ResetPasswordService,
    ActivationAccountService,
    AESService,
    MarketAuthorizationService
  ],
  entryComponents: [
    MarketsHeaderComponent,
    MarketHeaderComponent,
    MinPayAmountModal,
    PrivacyModal,
    DialogMarketOpen,
    DialogOffer
  ]
})
export class SupplierModule { }
