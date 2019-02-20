import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
  ResetPasswordComponent,
  ActivationAccountComponent
} from './pages';
import { MarketAuthorizationComponent } from './pages/market-authorization/market-authorization.component';


const routes: Routes = [
  {
    path: 'supplier',
    children: [
      { path: 'signin', component: SigninPage },
      {
        path: 'forget-password',
        component : ForgetPasswordPage
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
                  { path: 'invoices', component: MarketInvoicesPage },
                  { path: 'history', component: MarketHistoryPage }
                ]
              }
            ]
          },
          {
            path:'market-authorization',
            component:MarketAuthorizationComponent
          }
        
        ]
      }
    ]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'activation-account',
    component: ActivationAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
