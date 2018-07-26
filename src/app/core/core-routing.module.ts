import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage, SidesPage } from './pages';
import { EnquiryComponent } from './pages/enquiry/enquiry.page';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'sides', component: SidesPage },
  { path: 'enquiry', component: EnquiryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
