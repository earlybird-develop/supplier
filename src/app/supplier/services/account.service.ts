import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { UserProfile, ForegtPasswordEmail } from '../models/index';
import { AESService } from './aes.service';

const GET_ACCESS_TOKEN_PATH = '/oauth2/get_access_token';
const REFRESH_ACCESS_TOKEN_PATH = '/oauth2/refresh_access_token';
const GET_PROFILE_PATH = '/account/get_profile';
const UPDATE_PROFILE_PATH = '/account/update_profile';
const CHANGE_PASSWORD = '/account/change_password';
const FORGET_PASSWORD_EMAIL_SEND = '/service/reset_password';

@Injectable()
export class AccountService {

  constructor(private _http: HttpClient, private aesService: AESService) { }

  public getAccessToken(httpParams: Object): Observable<boolean> {
    const params = new HttpParams()
      .set('appid', 'platform')
      .set('secret', '123456')
      .set('grant_type', 'password');
    var encryptPassword = this.aesService.encrypt(httpParams['password']);
    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .post(GET_ACCESS_TOKEN_PATH, { username: httpParams['email'], password: encryptPassword }, { params })
        .subscribe(
          resp => {
            localStorage.setItem('access_token', resp['access_token']);
            localStorage.setItem('expire_time', resp['expire_time']);
            localStorage.setItem('openid', resp['openid']);
            localStorage.setItem('refresh_token', resp['refresh_token']);
            observer.next(true);
            observer.complete();
          },
          error => observer.error(error)
        );
    });
  }

  public refreshAccessToken(httpParams: Object): Observable<boolean> {
    const params = new HttpParams()
      .set('refresh_token', localStorage.getItem('refresh_token'))
      .set('appid', 'xxx-1-xxx')
      .set('secret', '123456')
      .set('grant_type', 'refresh_token');

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .get(REFRESH_ACCESS_TOKEN_PATH, { params })
        .subscribe(
          resp => {
            localStorage.setItem('access_token', resp['access_token']);
            localStorage.setItem('expire_time', resp['expire_time']);
            localStorage.setItem('refresh_token', resp['refresh_token']);

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
        .post(UPDATE_PROFILE_PATH, { data: profile._toJSON()})
        .subscribe(
          resp => {
            observer.next(<UserProfile>{});
            observer.complete();
          },
          errors => observer.error(errors)
        );
    });
  }

  public changePassword(): Observable<boolean> {

    return Observable.create((observer: Observer<boolean>) => {
      this._http
        .get(CHANGE_PASSWORD)
        .subscribe(
          resp => {
            observer.next(true);
            observer.complete();
          },
          error => observer.error(error)
        );
    })
  }

  public postForgetPasswordMail(email): Observable<ForegtPasswordEmail> {
    return Observable.create((observer: Observer<ForegtPasswordEmail>) => {
      this._http
        .post(FORGET_PASSWORD_EMAIL_SEND, email)
        .subscribe(
          resp => {
            observer.next(<ForegtPasswordEmail>{});
            observer.complete();
          },
          errors => observer.error(errors)
        )
    })
  }
}
