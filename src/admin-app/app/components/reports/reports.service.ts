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
import { ReportOrders, ReportRetailerInquirys, ReportPaymentDatas } from '../../../../models/report-order';
import { ReportReviewSummary, ReviewItem } from '../../../../models/report-review';
import { Retailers, RetailerReviews, ReviewRatings } from '../../../../models/retailer';
import { ReportConsumers } from '../../../../models/report-consumer';

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
  getPaymentReports(paymentType: string, summary: string, year: string, month?: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersReportApi}/${environment.apis.orders.paymentReports}`.replace('{paymentType}', paymentType).replace('{summary}', summary).replace('{year}', year).replace('{month}', month || '');
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
      .map(p => this.handleResponse(p, ReportOrders))
      .catch(this.handleError);
  }
  getConsumers(query?: any): Observable<ReportConsumers> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.consumer.getConsumerDetails}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => this.handleResponse(p, ReportConsumers))
      .catch(this.handleError);
  }
  getPaymentDetails(query?: any): Observable<ReportPaymentDatas> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersReportApi}/${environment.apis.orders.getPaymentDetails}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => this.handleResponse(p, ReportPaymentDatas))
      .catch(this.handleError);
  }
  getReviews(query?: any): Observable<RetailerReviews> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.AdminApi}/${environment.apis.orders.getRetailerReviews}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => this.handleResponse(p, RetailerReviews))
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
      .map(p => this.handleResponse(p, ReportReviewSummary))
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
  getConsumerYearlyReport(memberType: string, year: string, month?: string): Observable<ReportReviewSummary> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.orders.consumerYearlyReport}`.replace('{memberType}', memberType).replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => this.handleResponse(p, ReportReviewSummary))
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
      .map(p => this.handleResponse(p, ReportRetailerInquirys))
      .catch(this.handleError);
  }
  getInquiriesSummary(inquiryType: string, inquiryCategory: string, year: string, month?: string): Observable<ReportReviewSummary> {
    this.headers = this.getHttpHeraders();
    let url = `${environment.InquiryApi}/${environment.apis.inquiry.inquiriesSummaryReport}`.replace('{type}', inquiryType).replace('{category}', inquiryCategory).replace('{year}', year).replace('{month}', month || '');
    if (inquiryCategory === '') {
      url = url.replace('&inquiriesCategory=', '');
    }
    if (month === '') {
      url = url.replace('&month=', '');
    }

    return this.http
      .get(url, { headers: this.headers })
      .map(p => this.handleResponse(p, ReportReviewSummary))
      .catch(this.handleError);
  }

  //#region Sales Reports

  srGetWidOneData(year: string, month?: string): Observable<Array<ReviewItem>> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersReportApi}/${environment.apis.salesReport.widOne}`.replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => this.handleArrayResponse(p, ReviewItem))
      .catch(this.handleError);
  }
  srGetWidTwoData(year: string, month?: string): Observable<Array<ReviewItem>> {
   this.headers = this.getHttpHeraders();
    const url = `${environment.ordersReportApi}/${environment.apis.salesReport.widTwo}`.replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => this.handleArrayResponse(p, ReviewItem))
      .catch(this.handleError);
  }

  srGetWidFourData(year: string, month?: string): Observable<Array<ReviewItem>> {
   this.headers = this.getHttpHeraders();
    const url = `${environment.InquiryApi}/${environment.apis.salesReport.widFour}`.replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => this.handleArrayResponse(p, ReviewItem))
      .catch(this.handleError);
  }
  srGetChartData(year: string, month?: string): Observable<Array<ReviewItem>> {
   this.headers = this.getHttpHeraders();
    const url = `${environment.InquiryApi}/${environment.apis.salesReport.chart}`.replace('{year}', year).replace('{month}', month || '');
    return this.http
      .get(url, { headers: this.headers })
      .map(p => this.handleArrayResponse(p, ReviewItem))
      .catch(this.handleError);
  }


  //#endregion


  private handleResponse<T>(response: any, type: (new (any) => T)): T {
    if (response.text() === '') {
      return new type(null);
    } else {
      return new type(response.json());
    }
  }
  private handleArrayResponse<T>(response: any, type: (new (any) => T)): T[] {
    if (response.text() === '') {
      return [];
    } else {
      return response.json().map(p => new type(p));
    }
  }
  private handleError(error: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
  getPrev12Months(year: number, month: number) {
    const reportData = new Array<ReviewItem>();
    let _year = year - 1;
    let _month = month + 1;
    for (let i = 0; i < 12; i++) {
      reportData.push(new ReviewItem({ year: _year, month: _month }));
      if (_month === 12) {
        _month = 1; _year++;
      } else { _month++; }
    }
    return reportData;
  }
  getPrev5Years(year: number) {
    const reportData = new Array<ReviewItem>();
    for (let i = 4; i >= 0; i--) {
      reportData.push(new ReviewItem({ year: year - i, month: 0 }));
    }
    return reportData;
  }
  formatDate(date, format) {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];
    const monthNamesShort = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    switch (format) {
      case 'MM YYYY':
        return monthIndex + ' ' + year;
      case 'MMM YYYY':
        return monthNamesShort[monthIndex] + ' ' + year;
      case 'MMMM YYYY':
        return monthNames[monthIndex] + ' ' + year;
      default:
        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }
  }
}
