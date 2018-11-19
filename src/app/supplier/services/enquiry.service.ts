import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

const MAKE_URL = "/service/make_enquiry";
@Injectable()
export class EnquiryService {
    constructor(private _http: HttpClient) {

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