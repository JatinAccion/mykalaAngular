import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { LocalStorageService } from '../../services/LocalStorage.service';
import { environment } from './../../../environments/environment';
import { nameValue } from '../../../../models/nameValue';
import { ReportOrders, ReportRetailerInquirys } from '../../../../models/report-order';
import { ReportReviewSummary } from '../../../../models/report-review';
import { Retailers, RetailerReviews, ReviewRatings } from '../../../../models/retailer';

@Injectable()
export class ReportsService {
  private BASE_URL: string = environment.productApi;
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
  get(query: any): Observable<any[]> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailers.get}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getPaymentCounts(paymentType: string, year: string, month?: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersReportApi}/${environment.apis.orders.paymentCounts}`.replace('{paymentType}', paymentType).replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getPaymentReports(paymentType: string, year: string, month?: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersReportApi}/${environment.apis.orders.paymentReports}`.replace('{paymentType}', paymentType).replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getconsumerPaymentReports(paymentType: string, year: string, month?: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersReportApi}/${environment.apis.orders.consumerPayment}`.replace('{paymentType}', paymentType).replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getOrders(paymentType: string, year: string, month?: string, query?: any): Observable<ReportOrders> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersReportApi}/${environment.apis.orders.get}`.replace('{paymentType}', paymentType).replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => p.json())
      .map(p => new ReportOrders(p))
      .catch(this.handleError);
  }
  getReviews(query?: any): Observable<RetailerReviews> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.AdminApi}/${environment.apis.orders.getRetailerReviews}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(res => {
        if (res.text() === '') {
          return new RetailerReviews();
        } else {
          return new RetailerReviews(res.json());
        }
      })
      .catch(this.handleError);
  }
  getRetailerReviewRatings(retailerId: string): Observable<ReviewRatings> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.orders.getRetailerReviewRatings}`.replace('{retailerId}', retailerId);
    return this.http
      .get(url, { headers: this.headers })
      .map(res => {
        if (res.text() === '') {
          return '';
        } else {
          return new ReviewRatings(res.json());
        }
      })
      .catch(this.handleError);
  }
  getConsumerCount(memberType: string, year: string, month?: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.orders.consumerCount}`.replace('{memberType}', memberType).replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getCompletedReview(year: string, month?: string): Observable<ReportReviewSummary> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.orders.orderReviewCount}`.replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .map(p => new ReportReviewSummary(p))
      .catch(this.handleError);
  }
  getAvgReview(year: string, month?: string): Observable<ReportReviewSummary> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.orders.avgReviewCount}`.replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(res => {
        if (res.text() === '') {
          return new ReportReviewSummary();
        } else {
          return new ReportReviewSummary(res.json());
        }
      })
      .catch(this.handleError);
  }
  getAvgResponseTime(year: string, month?: string): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.orders.avgResponseTime}`.replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getConsumerYearlyReport(memberType: string, year: string, month?: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.orders.consumerYearlyReport}`.replace('{memberType}', memberType).replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getInquiryReport(type: string, year: string, month?: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.InquiryApi}/${environment.apis.inquiry.inquiriesReport}`.replace('{type}', type).replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getInquiryChartReport(type: string, year: string, month?: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.InquiryApi}/${environment.apis.inquiry.inquiriesCategoryReport}`.replace('{type}', type).replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getRetailerInquiries(inquiryType: string, inquiryCategory: string, query?: any): Observable<ReportRetailerInquirys> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.InquiryApi}/${environment.apis.inquiry.retailerInquiries}`.replace('{type}', inquiryType).replace('{category}', inquiryCategory);
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => p.json())
      .map(p => new ReportRetailerInquirys(p))
      .catch(this.handleError);
  }
  private handleError(error: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
