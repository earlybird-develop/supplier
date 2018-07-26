import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BuyerRoutingModule } from './buyer-routing.module';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ChartsModule } from 'ng2-charts';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';

import {
  MarketsService,
  SuppliersService,
  InvoicesService,
  MarketHistoryService,
  CurrentMarketService,
  SubheaderService,
  AccountService
} from './services';

import {
  WrapperPage,
  MarketPage,
  MarketsPage,
  MarketHistoryPage,
  MarketCurrentPage,
  MarketSupplierManagePage,
  MarketInvoicesManagePage,
  AccountPage,
  ChangePasswordPage,
  ProfilePage,
  SigninPage
} from './pages';

import {
  MarketHeaderComponent,
  MarketSettingComponent,
  HeaderComponent
} from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    BuyerRoutingModule,
    ChartsModule,
    TranslateModule,
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [
    MarketsService,
    InvoicesService,
    MarketHistoryService,
    CurrentMarketService,
    SuppliersService,
    SubheaderService,
    AccountService
  ],
  declarations: [
    WrapperPage,
    MarketsPage,
    MarketSettingComponent,
    MarketHeaderComponent,
    HeaderComponent,
    MarketPage,
    MarketSupplierManagePage,
    MarketInvoicesManagePage,
    MarketHistoryPage,
    MarketCurrentPage,
    AccountPage,
    ChangePasswordPage,
    ProfilePage,
    SigninPage
  ],
  entryComponents: [
    MarketHeaderComponent
  ]
})
export class BuyerModule { }
