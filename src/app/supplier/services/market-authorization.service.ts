import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

const GET_ACTIVATE_LIST = '/activate/list';
const VERIFY_VERDOR_CODE = '/activate/verify_code';
const GET_SUPPLIER_INFO = '/activate/get_template';
const SET_SUPPLIER_INFO = '/activate/license';
const UPLOAD_FILE = '/activate/upload';


@Injectable()
export class MarketAuthorizationService {

  constructor(private _http: HttpClient) { }
  public loadMarketsList(): Observable<Object> {

    return Observable.create((observer: Observer<Object>) => {
      this._http.get(GET_ACTIVATE_LIST).subscribe(
        resp => {
          observer.next(resp);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      )
    });
  }

  public verifyVendorCode(httpParams: Object): Observable<boolean> {
    const params = new HttpParams()
      .set('market_id', httpParams['market_id']);
    console.log(httpParams);
    return Observable.create((observer: Observer<boolean>) => {
      this._http.post(VERIFY_VERDOR_CODE, { vendorcode: httpParams['vendorcode'] }, { params }).subscribe(
        resp => {
          console.log(resp);
          if(resp['code'] ==1 ){
            observer.next(true);
          }else{
            observer.next(false);
          }
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      )
    })
  }

  public getSupplierInfo(httpParams: Object): Observable<Object> {
    const params = new HttpParams()
      .set('market_id', httpParams['market_id']);

    return Observable.create((observer: Observer<Object>) => {
      this._http.get(GET_SUPPLIER_INFO, { params }).subscribe(
        resp => {
          observer.next(resp);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      )
    })
  }

  public setSupplierInfo(httpParams: Object): Observable<Object> {
    const params = new HttpParams()
      .set('market_id', httpParams['market_id']);
    return Observable.create((observer: Observer<Object>) => {
      this._http.post(SET_SUPPLIER_INFO, httpParams, { params }).subscribe(
        resp => {
          observer.next(resp);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      )
    })
  }

  public uploadAuthFile(httpParams: Object, file: File): Observable<Object> {
    const params = new HttpParams()
      .set('market_id', httpParams['market_id'])
      .set('file_type', httpParams['file_type']);

    let formData = new FormData();
    formData.append('attach', file, file.name);
    return Observable.create((observer: Observer<Object>) => {
      this._http.post(UPLOAD_FILE, formData,{params}).subscribe(
        resp => {
          observer.next(resp);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      )
    })
  }

  public uploadRegisterFile(httpParams: Object, file: File): Observable<Object> {
    const params = new HttpParams()
      .set('market_id', httpParams['market_id'])
      .set('file_type', httpParams['file_type']);

    let formData: FormData = new FormData();
    formData.append('attach', file, file.name);

    return Observable.create((observer: Observer<Object>) => {
      this._http.post(UPLOAD_FILE, formData,{params}).subscribe(
        resp => {
          observer.next(resp);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      )
    })
  }

}
