import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SubheaderService } from '../../services';
import { AccountService } from '../../services/account.service';


@Component({
  selector: 'eb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('subheader', { read: ViewContainerRef })
  private _subheaderContainer: ViewContainerRef;

  constructor(private _subHeader: SubheaderService,
              public translate: TranslateService,
              private _account: AccountService) { }

  ngOnInit() {
    this._subHeader.setRootViewContainerRef(this._subheaderContainer);
  }

  public selectLang(lang: string): void {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }
  public logout(){
    this._account.logout();
  }
}
