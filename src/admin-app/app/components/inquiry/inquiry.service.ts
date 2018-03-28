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
import { Inquiry, Inquirys } from '../../../../models/inquiry';

@Injectable()
export class InquiryService {
  private BASE_URL: string = environment.InquiryApi;
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
    private httpc: HttpClient
  ) {
    this.seedStaticData();
  }
  seedStaticData() {
    // this.shippingProfiles.push(new nameValue('1', 'Furniture delivery'));
    // this.shippingProfiles.push(new nameValue('2', 'Small item delivery'));
    // this.shippingProfiles.push(new nameValue('3', '1-5 business days shipping'));
  }
  get(query: any): Observable<Inquirys> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.inquiry.get}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => p.json())
      .map(p => new Inquirys(p))
      .catch(this.handleError);
  }
  getInquiryDetails(inquiryId): Observable<Inquiry> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.inquiry.getInquiryDetails}`.replace('{supportId}', inquiryId);
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .map(p => new Inquiry(p))
      .catch(this.handleError);
  }
  deleteInquiry(inquiryId): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.inquiry.delete}`.replace('{supportId}', inquiryId);
    return this.http
      .delete(url, { headers: this.headers })
      .map(p => p.text())
      .catch(this.handleError);
  }
  save(inquiry: Inquiry): Observable<any> {
    this.headers = this.getHttpHeraders();
    let url = `${this.BASE_URL}/${environment.apis.inquiry.save}`;
    const requestOptions = { body: inquiry, method: RequestMethod.Post, headers: this.headers };
    if (inquiry.supportId) {
      url = `${this.BASE_URL}/${environment.apis.inquiry.update}`;
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          inquiry.supportId = res.json().retailerId;
          return new Inquiry(inquiry);
        }
      }).catch(this.handleError);
  }

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
