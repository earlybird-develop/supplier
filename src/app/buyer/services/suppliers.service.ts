import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Model } from 'tsmodels';
import { RegisteredEvent, Supplier, User } from '../models';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { SuppliersStat } from '../models';


const GET_SUPPLIER_STAT_PATH = '/buyer/supplier/get_supplier_stat';
const GET_SUPPLIERS_LIST = '/buyer/supplier/get_supplier_list';
const GET_SUPPLIER_USER_LIST = '/buyer/supplier/get_supplier_user_list';
const SET_SUPPLIER_ACTION = '/buyer/supplier/set_supplier_action';

@Injectable()
export class SuppliersService {

  constructor(private _http: HttpClient) { }

  public getSuppliers(marketId: string): Observable<Supplier[]> {
    const params = new HttpParams().set('market-id', marketId);

    return Observable.create((observer: Observer<Supplier[]>) => {
      this._http
        .get(GET_SUPPLIERS_LIST, { params: params })
        .subscribe(
          resp => {
            observer.next(
              Model.newCollection<Supplier>(Supplier, resp['data'])
            );
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public getSuppliersStat(marketId: string): Observable<SuppliersStat> {
    const params = new HttpParams().set('market-id', marketId);

    return Observable.create((observer: Observer<SuppliersStat>) => {
      this._http
        .get(GET_SUPPLIER_STAT_PATH, { params: params })
        .subscribe(
          res => {
            observer.next(Model.new<SuppliersStat>(SuppliersStat, res['data']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public getSupplierUsers(supplierId: string, marketId: string)
  : Observable<User[]> {
    const params = new HttpParams()
      .set('market-id', marketId)
      .set('supplier-id', supplierId);

    return Observable.create((observer: Observer<User[]>) => {
      this._http
        .get(GET_SUPPLIER_USER_LIST, { params: params })
        .subscribe(
          resp => {
            observer.next(Model.newCollection<User>(User, resp['data']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public setUserAction(event: RegisteredEvent, id: string)
  : Observable<any> {
    const params = new HttpParams().set('supplier-id', id);

    return Observable.create((observer: Observer<any>) => {
      this._http
        .post(
          SET_SUPPLIER_ACTION,
          event._toJSON(['action_type', 'action_id']),
          { params: params }
        )
        .subscribe(
          resp => {
            if (resp['code'] === 1) {
              observer.next(true);
              observer.complete();
            } else {
              observer.error(resp['data']);
            }
          },
          errors => observer.error(errors)
        );
    });
  }
}
