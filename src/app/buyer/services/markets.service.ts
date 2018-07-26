import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

import { Market } from '../models';
import { Model } from 'tsmodels';
import { DialogService } from '../../shared/dialog';


const MARKETS_PATH = '/buyer/market/get_market_list';
const GET_MARKET_SETTINGS_PATH = '/buyer/market/get_market_setting';
const SET_MARKET_SETTINGS_PATH = '/buyer/market/set_market_setting';
const SET_MARKET_ACTIVE_PATH = '/buyer/market/set_market_active';
const SET_MARKET_ACTION_PATH = '/buyer/market/confirm_market_action';

@Injectable()
export class MarketsService {

  // Hack : I'm so sorry :_(
  public popoverClose: EventEmitter<any> = new EventEmitter();

  constructor(private _http: HttpClient,
              private _dialog: DialogService) { }

  public getList(): Observable<Market[]> {
    return Observable.create((observer: Observer<Market[]>) => {
      this._http
        .get(MARKETS_PATH)
        .subscribe(
          response => {
            observer.next(
              Model.newCollection<Market>(Market, response['data']['list'])
            );
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public getSettings(id: string): Observable<Market> {
    const params = new HttpParams().set('market-id', id);

    return Observable.create((observer: Observer<Market>) => {
      this._http
        .get(GET_MARKET_SETTINGS_PATH, { params })
        .subscribe(
          resp => {
            observer.next(Model.new<Market>(Market, resp['data']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public setSettings(market: Market): Observable<Market> {
    const params = new HttpParams().set('market-id', market.id);

    const fields = [
      'market_cash', 'expect_apr', 'min_apr', 'paydate', 'reserve_percentage',
      'reconcilation_date'
    ];

    return Observable.create((observer: Observer<Market>) => {
      this._http
        .post(
          SET_MARKET_SETTINGS_PATH,
          market._toJSON(fields),
          { params: params }
        )
        .subscribe(
          resp => {
            if (resp['code'] === 0) {
              this._dialog
                .confirm(resp['data']['message'] + '. Confirm the action?')
                .subscribe(
                  () => {
                    this.confirmMarketAction(
                      market.id,
                      resp['data']['confirm-id']
                    ).subscribe(
                      () => { observer.next(market); observer.complete(); },
                      errors => observer.error(errors)
                    );
                  },
                  () => observer.error(false)
                );
            } else {
              observer.next(market);
              observer.complete();
            }
          },
          errors => observer.error(errors)
        );
    });
  }

  public setMarketActive(marketId: string, status: boolean)
  : Observable<boolean> {
    const params = new HttpParams().set('market-id', marketId);

    const body = {
      active_status: status ? 1 : -1
    };

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .post(SET_MARKET_ACTIVE_PATH, body, { params })
        .subscribe(
          resp => {
            if (resp['code'] === 0) {
              this._dialog
                .confirm(resp['data']['message'] + '. Confirm the action?')
                .subscribe(
                  () => {
                    this.confirmMarketAction(
                      marketId,
                      resp['data']['confirm-id']
                    ).subscribe(
                      () => { observer.next(true); observer.complete(); },
                      errors => observer.error(errors)
                    );
                  },
                  () => observer.error(false)
                );
            } else {
              observer.next(true);
              observer.complete();
            }
          },
          errors => observer.error(errors)
        );
    });
  }

  public confirmMarketAction(marketId: string, confirmId: string)
  : Observable<boolean> {
    const params = new HttpParams().set('market-id', marketId);

    const body = {
      'confirm-id': confirmId
    };

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .post(SET_MARKET_ACTION_PATH, body, { params: params })
        .subscribe(
          resp => {
            observer.next(true);
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }
}
