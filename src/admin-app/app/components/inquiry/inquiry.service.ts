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
import { Inquiry, Inquirys, InquiryCount } from '../../../../models/inquiry';
import { CoreService } from '../../services/core.service';

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
    private httpc: HttpClient,
    private core: CoreService
  ) { }
  get(query: any): Observable<Inquirys> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.inquiry.get}`;
    return this.http
      .get(url, { search: query, headers: this.core.setHeaders() })
      .map(p => p.json())
      .map(p => new Inquirys(p))
      .catch(this.handleError);
  }
  getInquiryDetails(inquiryId): Observable<Inquiry> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.inquiry.getInquiryDetails}`.replace('{supportId}', inquiryId);
    return this.http
      .get(url, { headers: this.core.setHeaders() })
      .map(p => p.json())
      .map(p => new Inquiry(p))
      .catch(this.handleError);
  }
  getInquiryCounts(retailerId, consumerId): Observable<InquiryCount> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.inquiry.getIssueCount}`.replace('{retailerId}', retailerId).replace('{consumerId}', consumerId);
    return this.http
      .get(url, { headers: this.core.setHeaders() })
      .map(p => {
        if (p.text() === '') {
          return new InquiryCount();
        } else {
          return new InquiryCount(p.json());
        }
      })
      .catch(this.handleError);
  }
  deleteInquiry(inquiryId): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.inquiry.delete}`.replace('{supportId}', inquiryId);
    return this.http
      .delete(url, { headers: this.core.setHeaders() })
      .map(p => p.text())
      .catch(this.handleError);
  }
  save(inquiry: Inquiry): Observable<any> {
    this.headers = this.getHttpHeraders();
    let url = `${this.BASE_URL}/${environment.apis.inquiry.save}`;
    const requestOptions = { body: inquiry, method: RequestMethod.Post, headers: this.core.setHeaders() };
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
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
