import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { UserProfile } from '../models';

const GET_ACCESS_TOKEN_PATH = '/buyer/oauth/get_access_token';
const GET_PROFILE_PATH = '/buyer/account/get_profile';
const UPDATE_PROFILE_PATH = '/buyer/account/update_profile';

@Injectable()
export class AccountService {

  constructor(private _http: HttpClient) { }

  public getAccessToken(httpParams: Object): Observable<boolean> {
    const params = new HttpParams()
      .set('username', httpParams['email'])
      .set('password', httpParams['password'])
      .set('authkey', '');

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .get(GET_ACCESS_TOKEN_PATH, { params })
        .subscribe(
          resp => {
            localStorage.setItem('buyer_token', resp['access_token']);
            observer.next(true);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }

  public getProfile(): Observable<UserProfile> {
    return Observable.create((observer: Observer<UserProfile>) => {
      this._http
        .get(GET_PROFILE_PATH)
        .subscribe(
          resp => {
            observer.next(UserProfile.new(UserProfile, resp['data']));
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public updateProfile(profile: UserProfile): Observable<UserProfile> {
    return Observable.create((observer: Observer<UserProfile>) => {
      this._http
        .post(UPDATE_PROFILE_PATH, { data: profile._toJSON() })
        .subscribe(
          resp => {
            observer.next(<UserProfile>{});
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }
}
