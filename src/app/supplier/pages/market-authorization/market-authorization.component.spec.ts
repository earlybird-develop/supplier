import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketAuthorizationComponent } from './market-authorization.component';

describe('MarketAuthorizationComponent', () => {
  let component: MarketAuthorizationComponent;
  let fixture: ComponentFixture<MarketAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
