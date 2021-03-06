import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { User, BasicAuth, UserProfile } from '../../../models/user';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { CoreService } from './core.service';


@Injectable()
export class AuthService {
  // private BASE_URL: string = environment.Api;
  basicAuth = new BasicAuth();
  private headers: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;',
    Authorization: `Basic ${this.basicAuth.encoded}`
  });
  constructor(private http: Http, private core: CoreService) { }

  login(user: User): Promise<any> {
    const data = {
      grant_type: this.basicAuth.grant_type,
      username: user.username,
      password: user.password,
      client_id: this.basicAuth.client_id
    };

    // tslint:disable-next-line:max-line-length
    const url = `${environment.Api}/${environment.apis.Auth.token}?client_id=${this.basicAuth.client_id}&grant_type=password&username=${user.username}&password=${encodeURIComponent(user.password)}`;
    return this.http.post(url, '', { headers: this.headers }).toPromise();
  }
  getUserInfo(token): Observable<UserProfile> {
    const url = `${environment.Api}/users/${environment.apis.Auth.userInfo}`;
    return this.http.get(url, { headers: this.core.setHeaders() }).map(res => {
      if (res.text() === '') {
        return new UserProfile();
      } else {
        return new UserProfile(res.json());
      }
    });
  }
  // register(user: User): Promise<any> {
  //   const url = `${this.BASE_URL}/${environment.apis.Auth.register}`;
  //   return this.http.post(url, user, { headers: this.headers }).toPromise();
  // }
  getUserByEmail(email: string): Observable<any> {
    const url = `${environment.userApi}/public/email/${email}`;
    return this.http
      .get(`${url}`)
      .map(res => {
        if (res.text() === '') {
          return 'User Not found';
        } else {
          return new UserProfile(res.json());
        }
      }); // .catch(p => console.log(p.json()));
  }
  ensureAuthenticated(token): Promise<any> {
    const url = `${environment.userApi}/${environment.apis.Auth.status}`;
    const headers: Headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(url, { headers: headers }).toPromise();
  }
  forgotPassword(fpModal) {
    const url = `${environment.userApi}/public/${environment.apis.users.forgetPassword}`;
    return this.http.post(url, fpModal).map((res) => res.json());
  }
  resetPassword(rpModal) {
    const url = `${environment.userApi}/public/${environment.apis.users.resetPassword}`;
    return this.http.post(url, rpModal).map((res) => res.text());
  }
}
