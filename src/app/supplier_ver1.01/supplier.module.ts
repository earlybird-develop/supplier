import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

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
  SigninPage
} from './pages';

import {
  AccountService,
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
    BsDropdownModule.forRoot()
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

    HeaderComponent,
    MarketsHeaderComponent,
    MarketHeaderComponent
  ],
  providers: [
    AccountService,
    MarketsService,
    SubheaderService,
    MarketHistoryService
  ],
  entryComponents: [
    MarketsHeaderComponent,
    MarketHeaderComponent
  ]
})
export class SupplierModule { }
