import { Attribute, Component, Inject, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'eb-home-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public translate: TranslateService,
              private _renderer: Renderer2,
              private _router: Router,
              @Inject(DOCUMENT) private _document: Document,
              @Attribute('blackMenu') public blackMenu: string) {}

  public selectLang(lang: string): void {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  public menuOpen(): void {
    this._renderer.addClass(this._document.body, 'menu-open');
  }

  public menuClose(): void {
    this._renderer.removeClass(this._document.body, 'menu-open');
  }

  public goToHome(): void {
    this._router.navigate(['/']);
  }
}
