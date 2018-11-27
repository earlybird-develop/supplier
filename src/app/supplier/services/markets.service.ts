import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Market, Invoice, InvoicesFilter } from '../models';


const MARKETS_PATH = '/market/get_market_list';
const MARKET_STAT_PATH = '/invoice/get_market_stat';
const MARKET_PARTICIPATION_PATH = '/market/set_participation';

const INVOICES_ELIGIBLE_PATH = '/invoice/get_invoices_with_eligible';
const INVOICES_INELIGIBLE_PATH = '/invoice/get_invoices_with_ineligible';
const INVOICES_ADJUST_PATH = '/invoice/get_invoices_with_adjust';
const INVOICES_AWARDED_PATH = '/invoice/get_invoices_with_awarded';
const SET_INVOICES_INCLUDED_PATH = '/invoice/set_invoices_inlcuded';
const SET_OFFER_APR_PATH = '/invoice/offer_apr';

export enum InvoiceType {
  Eligible = 'eligible',
  Ineligible = 'ineligible',
  Adjustments = 'adjustments',
  Awarded = 'awarded'
}

@Injectable()
export class MarketsService {
  public totalAmount = 0;

  constructor(private _http: HttpClient) { }

  public getList(): Observable<Market[]> {
    return Observable.create((observer: Observer<Market[]>) => {

      this._http
        .get(MARKETS_PATH)
        .subscribe(
          response => {
            observer.next(response['data']['list'].map(x => new Market(x)));
            //observer.complete();
          },
            error => observer.error(error)
      );
    });
  }

  public getStat(id: string): Observable<Market> {
    const params = new HttpParams().set('buyer_id', id);

    return Observable.create((observer: Observer<Market>) => {
      this._http
        .get(MARKET_STAT_PATH, { params: params })
        .subscribe(
          response => {

            observer.next(new Market(response['data']));
            observer.complete();
          },
            error => observer.error(error)
        );
    });
  }

  public getInvoices(id: string, filter: InvoicesFilter, type: InvoiceType)
  : Observable<Invoice[]> {

    const sFilter = filter._toJSON();
    let url = '';
    let params = new HttpParams().set('buyer_id', id);

    switch (type) {
      case(InvoiceType.Eligible): url = INVOICES_ELIGIBLE_PATH; break;
      case(InvoiceType.Ineligible): url = INVOICES_INELIGIBLE_PATH; break;
      case(InvoiceType.Adjustments): url = INVOICES_ADJUST_PATH; break;
      case(InvoiceType.Awarded): url = INVOICES_AWARDED_PATH;
    }

    if (type === InvoiceType.Eligible) {
      Object.keys(sFilter)
        .forEach(key => params = params.set(key, sFilter[key]));
    }

    return Observable.create((observer: Observer<Invoice[]>) => {
      this._http
        .get(url, { params: params })
        .subscribe(
          response => {
            this.totalAmount = response['data']['total_amount'];
            observer.next(response['data']['list'].map(x => new Invoice(x)));
            observer.complete();
          },
            error => observer.error(error)
        );
    });
  }

  public setInvoicesInclude(invoicesIds: string[], id: string, isInc = true)
  : Observable<any> {

    const params = new HttpParams().set('buyer_id', id);

    const data = { data: invoicesIds, is_included: isInc ? 1 : -1 };

    return Observable.create((observer: Observer<any>) => {
      this._http
        .post(SET_INVOICES_INCLUDED_PATH, data, { params })
        .subscribe(
          resp => {
            observer.next(true);
            observer.complete();
          },
           error => observer.error(error)
        );
    });
  }

  public  setOfferApr(id: string, minPayment: number, apr: number)
  : Observable<Market> {
    // const data = { async: true, data: { min_payment: minPayment, apr: apr }};
      const data = {
          offer_type : 'apr',
          offer_value : apr,
          min_payment: minPayment
      };
      const params = new HttpParams().set('buyer_id', id);

    return Observable.create((observer: Observer<any>) => {
      this._http
        .post(SET_OFFER_APR_PATH, data, { params: params })
        .subscribe(
          resp => {
            observer.next(resp);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }

  public configureOffer(
    offerType: string,
    offerValue: number,
    minPayment: number,
    buyerId: string
  )
  : Observable<Market> {

    const data = {
        offer_type: offerType,
        offer_value: offerValue,
        min_payment: minPayment
    }

    const params = new HttpParams().set('buyer_id', buyerId);

    return Observable.create((observer: Observer<any>) => {
      this._http
        .post(SET_OFFER_APR_PATH, data, { params })
        .subscribe(
          response => {
            observer.next(response);
            observer.complete();
          },
          error => {
            console.error(error);
          }
        )
    })

  }

  public setParticipation(marketId: string, isParticipation: boolean)
  : Observable<boolean> {
    const data = {
        buyers: [marketId],
        is_participation: isParticipation ? 1 : 0
    };

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .post(MARKET_PARTICIPATION_PATH, data)
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }
}
