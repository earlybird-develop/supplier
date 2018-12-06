import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { CheckboxComponent } from './checkbox/checkbox.component';
import { TimerComponent } from './timer/timer.component';
import { FooterComponent } from './footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';

import { TimerService } from './timer/timer.service';
import {
  SidebarablePageComponent
} from './sidebarable-page/sidebarable-page.component';

import { InlineEditComponent } from './inline-edit/inline-edit.component';
// tslint:disable-next-line:max-line-length
import { DialogMarketOpen } from './dialog-market-open/dialog-market-open.page';
import { DialogOffer } from './dialog-offer/dialog-offer.page';

import {
  SearchFilterPipe,
  CapitalizePipe,
  KeysPipe
} from './pipes';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DialogService, DialogComponent } from './dialog';
import { CustomSelectComponent } from './custom-select/custom-select.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
      PerfectScrollbarModule,
      TranslateModule
  ],
  declarations: [
    CheckboxComponent,
    TimerComponent,
    SidebarablePageComponent,
    InlineEditComponent,
    FooterComponent,
      DialogComponent,
      DialogMarketOpen,
      DialogOffer,

    SearchFilterPipe,
    CapitalizePipe,
    KeysPipe,
    CustomSelectComponent
  ],
  providers: [
    TimerService,
    DialogService
  ],
  exports: [
    CheckboxComponent,
    TimerComponent,
    SidebarablePageComponent,
    InlineEditComponent,
    FooterComponent,
    CustomSelectComponent,

    SearchFilterPipe,
    CapitalizePipe,
    KeysPipe
  ],
  entryComponents: [
      DialogComponent,
      DialogMarketOpen,
      DialogOffer
  ]
})
export class SharedModule { }
