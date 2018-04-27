import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User, BasicAuth } from '../../../models/user';

import 'rxjs/add/operator/toPromise';
import { environment } from './../../environments/environment';

@Injectable()
export class AuthService {
  private BASE_URL: string = environment.login;
  basicAuth = new BasicAuth();
  private headers: Headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;',
    Authorization: `Basic ${this.basicAuth.encoded}`
  });

  constructor(private http: Http) { }

  login(user): Promise<any> {
    const data = {
      grant_type: this.basicAuth.grant_type,
      username: user.username,
      password: user.password,
      client_id: this.basicAuth.client_id
    };

    const url = `${this.BASE_URL}/${environment.apis.auth.token}?client_id=${this.basicAuth.client_id}&grant_type=password&username=${user.username}&password=${user.password}`;
    return this.http.post(url, '', { headers: this.headers }).toPromise();
  }

  ensureAuthenticated(token): Promise<any> {
    const url = `${this.BASE_URL}/${environment.apis.auth.status}`;
    const headers: Headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(url, { headers: headers }).toPromise();
  }

  getUserInfo(token) {
    const url = `${this.BASE_URL}/${environment.apis.auth.userInfo}?access_token=${token}`;
    return this.http.get(url).map((res) => res.json());
  }

  verifyAccount(emailId) {
    const BASE_URL = environment.userService;
    const url: string = `${BASE_URL}/${environment.apis.userService.resendVerification}/${emailId}`;
    return this.http.get(url).map((res) => res.json());
  }

  getUserByEmailId(emailId) {
    const BASE_URL: string = environment.userService;
    const url: string = `${BASE_URL}/email/${emailId}`;
    return this.http.get(url).map((res) => res.json())
  }

  /* For Mobile/Conversational UI
  login(user: User): Promise<any> {
    let url: string = `${this.BASE_URL}/login`;
    return this.http.post(url, user, { headers: this.headers }).toPromise();
  }

  register(user: User): Promise<any> {
    let url: string = `${this.BASE_URL}/register`;
    return this.http.post(url, user, { headers: this.headers }).toPromise();
  }
  */
}
