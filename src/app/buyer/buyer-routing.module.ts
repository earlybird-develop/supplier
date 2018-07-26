import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  WrapperPage,
  MarketsPage,
  MarketPage,
  MarketSupplierManagePage,
  MarketInvoicesManagePage,
  MarketHistoryPage,
  MarketCurrentPage,
  SigninPage
} from './pages';

import {
  AccountPage,
  ChangePasswordPage,
  ProfilePage
} from './pages';

const routes: Routes = [
  {
    path: 'buyer',
    children: [
      {
        path: 'signin',
        component: SigninPage
      },
      {
        path: '',
        component: WrapperPage,
        children: [
          { path: '', redirectTo: 'markets', pathMatch: 'full' },
          {
            path: 'account',
            component: AccountPage,
            children: [
              { path: 'profile', component: ProfilePage },
              { path: 'change-password', component: ChangePasswordPage }
            ]
          },
          {
            path: 'markets',
            children: [
              { path: '', component: MarketsPage },
              {
                path: ':id',
                component: MarketPage,
                children: [
                  { path: 'supplier-manage', component: MarketSupplierManagePage },
                  { path: 'invoice-manage', component: MarketInvoicesManagePage },
                  { path: 'history', component: MarketHistoryPage },
                  { path: 'current', component: MarketCurrentPage }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerRoutingModule { }
