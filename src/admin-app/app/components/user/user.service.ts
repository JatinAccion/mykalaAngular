import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestMethod } from '@angular/http';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { LocalStorageService } from '../../services/LocalStorage.service';
import { environment } from './../../../environments/environment';
import { nameValue } from '../../../../models/nameValue';
import { UserProfile } from '../../../../models/user';
import { CoreService } from '../../services/core.service';

@Injectable()
export class UserService {
  private BASE_URL: string = environment.userApi;
  headers: Headers;

  getHttpHeraders() {
    const token = this.localStorageService.getItem('token');
    const headers = new Headers({
      'Content-Type': 'application/json'
      //  Authorization: token //`Bearer ${token}`
    });
    return headers;
  }
  constructor(
    private http: Http,
    private localStorageService: LocalStorageService,
    private httpc: HttpClient,
    private core: CoreService
  ) {
    this.seedStaticData();
  }
  seedStaticData() {
    // this.shippingProfiles.push(new nameValue('1', 'Furniture delivery'));
    // this.shippingProfiles.push(new nameValue('2', 'Small item delivery'));
    // this.shippingProfiles.push(new nameValue('3', '1-5 business days shipping'));
  }
  get(query: any): Observable<UserProfile[]> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.users.getAdmin}`;
    return this.http
      .get(url, { search: query, headers: this.core.setHeaders() })
      .map(p => p.json().map(q => new UserProfile(q)))
      .catch(this.handleError);
  }
  getUser(userId: string): Observable<any> {
    const url = `${this.BASE_URL}/${environment.apis.users.get}`.replace('{userId}', userId);
    return this.http
      .get(`${url}`, { headers: this.core.setHeaders() })
      .map(res => {
        if (res.text() === '') {
          return 'User Not found';
        } else {
          return new UserProfile(res.json());
        }
      })
      .catch(this.handleError);
  }
  save(user: UserProfile): Promise<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.users.save}`;
    const requestOptions = { body: user, method: RequestMethod.Post, headers: this.core.setHeaders() };
    if (user.userId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions).toPromise()
      .then(res => {
        if (res.text() !== '') {
          return new UserProfile(res.json());
        }
      }).catch(this.handleError);
  }
  delete(userId: string) {
    const url = `${this.BASE_URL}/${environment.apis.users.delete}`.replace('{userId}', userId);
    return this.http
      .delete(`${url}`, { headers: this.core.setHeaders() })
      .map(res => res.text())
      .catch(this.handleError);
  }
  private handleError(error: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
