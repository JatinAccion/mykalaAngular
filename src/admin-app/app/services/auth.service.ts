import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { User, BasicAuth } from '../../../models/user';
import { environment } from './../../environments/environment';


@Injectable()
export class AuthService {
  private BASE_URL: string = environment.Api;
  basicAuth = new BasicAuth();
  private headers: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;',
    Authorization: `Basic ${this.basicAuth.encoded}`
  });
  constructor(private http: Http) { }

  login(user: User): Promise<any> {
    const data = {
      grant_type: this.basicAuth.grant_type,
      username: user.username,
      password: user.password,
      client_id: this.basicAuth.client_id
    };

    // tslint:disable-next-line:max-line-length
    const url = `${this.BASE_URL}/${environment.apis.Auth.token}?client_id=${this.basicAuth.client_id}&grant_type=password&username=${user.username}&password=${user.password}`;
    return this.http.post(url, '', { headers: this.headers }).toPromise();
  }
  getUserInfo(token) {
    const url = `${this.BASE_URL}/${environment.apis.Auth.userInfo}?access_token=${token}`;
    return this.http.get(url).map((res) => res.json());
  }
  // register(user: User): Promise<any> {
  //   const url = `${this.BASE_URL}/${environment.apis.Auth.register}`;
  //   return this.http.post(url, user, { headers: this.headers }).toPromise();
  // }
  ensureAuthenticated(token): Promise<any> {
    const url = `${this.BASE_URL}/${environment.apis.Auth.status}`;
    const headers: Headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(url, { headers: headers }).toPromise();
  }
  forgotPassword(fpModal) {
    const url = 'http://dev-user-signup.us-east-2.elasticbeanstalk.com/login/user/forgotPassword';
    return this.http.post(url, fpModal).map((res) => res.json())
  }
  resetPassword(rpModal) {
    const url = `${this.BASE_URL}/${environment.apis.users.resetPassword}`;
    return this.http.post(url, rpModal).map((res) => res.text());
  }
}
