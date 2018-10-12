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
        const params = new HttpParams()
            .set('firstname', httpParams['firstname'])
            .set('lastname', httpParams['lastname'])
            .set('company', httpParams['company'])
            .set('workrole', httpParams['workrole'])
            .set('email', httpParams['email'])
            .set('phonenumber', httpParams['phonenumber'])
            .set('region', httpParams['region'])
            .set('interested', httpParams['interested'])
            .set('memo', httpParams['memo']);


        return Observable.create((observer: Observer<boolean>) => {
            this._http
                .get(MAKE_URL, { params })
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