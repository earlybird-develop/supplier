import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Alias, Model } from 'tsmodels';

const MAKE_URL = "/service/make_enquiry";
const DROPDOWN_URL = "/service/get_dropdown";

@Injectable()
export class EnquiryService {
    constructor(private _http: HttpClient) {

    }

    public get_dropdown(): Observable<any> {

        return Observable.create((observer: Observer<any>) => {
            this._http
                .get(DROPDOWN_URL)
                .subscribe(
                    resp => {
                        observer.next( resp['data'] ) ;
                        observer.complete();
                    },
                    error => observer.error(error)
                );
        });
    }

    public make(httpParams: Object): Observable<boolean> {

        const data = {
            'firstname'  : httpParams['firstname'],
            'lastname': httpParams['lastname'],
            'company': httpParams['company'],
            'workrole': httpParams['workrole'],
            'email': httpParams['email'],
            'phonenumber': httpParams['phonenumber'],
            'region': httpParams['region'],
            'interested': httpParams['interested'],
            'memo': httpParams['memo']
        };


        return Observable.create((observer: Observer<boolean>) => {
            this._http
                .post(MAKE_URL, data )
               // .get(MAKE_URL, { params })
                .subscribe(
                resp => {
                    observer.next(true);
                    observer.complete();
                },
                error => observer.error(error)
                ); 
        });
    }
}

export class Enquiry_Dropdown extends Model{
    public region : Dictionary[];
    public role: Dictionary[];
    public interest: Dictionary[];


    constructor(data?) {
        super();

        if (data) {
            this._fromJSON(data);
        }
    }

}

export class Dictionary  {
    public id: number;
    public value: any;
}