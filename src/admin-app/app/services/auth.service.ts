import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { User } from '../../../models/user';
import { environment } from './../../environments/environment';


@Injectable()
export class AuthService {
  private BASE_URL: string = environment.authApi;
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http) { }

  login(user: User): Promise<any> {
    const url = `${this.BASE_URL}/${environment.apis.Auth.login}`;
    return this.http.post(url, user, { headers: this.headers }).toPromise();
  }
  register(user: User): Promise<any> {
    const url = `${this.BASE_URL}/${environment.apis.Auth.register}`;
    return this.http.post(url, user, { headers: this.headers }).toPromise();
  }
  ensureAuthenticated(token): Promise<any> {
    const url = `${this.BASE_URL}/${environment.apis.Auth.status}`;
    const headers: Headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(url, { headers: headers }).toPromise();
  }
}
