import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ScrollToModule } from 'ng2-scroll-to';

import { SharedModule } from '../shared/shared.module';
import { CoreRoutingModule } from './core-routing.module';
import { HomePage, SidesPage } from './pages';

import {
  HeroComponent,
  HeaderComponent,
  EbcfComponent
} from './components';
import { FreeAccountComponent } from './components/free-account/free-account.component';
import { WhyComponent } from './components/why/why.component';
import { SidesComponent } from './components/sides/sides.component';
import { FaqComponent } from './components/faq/faq.component';
import { FooterComponent } from './components/footer/footer.component';
import { EnquiryComponent } from './pages/enquiry/enquiry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreRoutingModule,
    TranslateModule,
    BsDropdownModule.forRoot(),
    ScrollToModule.forRoot(),
    SharedModule
  ],
  declarations: [
    HomePage,
    SidesPage,
    HeroComponent,
    HeaderComponent,
    EbcfComponent,
    FreeAccountComponent,
    WhyComponent,
    SidesComponent,
    FaqComponent,
    FooterComponent,
    EnquiryComponent
  ]
})
export class CoreModule { }
