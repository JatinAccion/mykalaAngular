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
import { ReportOrders, ReportConsumer, ReportOrder, ConsumerOffersOrdersCount } from '../../../../models/report-order';
import { Product } from '../../../../models/Product';

@Injectable()
export class OrderService {
  private BASE_URL: string = environment.ordersReportApi;
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
  }
  get(query: any): Observable<ReportOrders> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.orders.get}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => p.json())
      .map(p => new ReportOrders(p))
      .catch(this.handleError);
  }

  getById(orderId: any): Observable<ReportOrder> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersApi}/${orderId}`;
    return this.http
      .get(url, { headers: this.headers })
      .map(res => {
        if (res.text() === '') {
          return new ReportOrder();
        } else {
          return new ReportOrder(res.json());
        }
      }).catch(this.handleError);
  }

  getProducts(productIds: string[]): Observable<Product[]> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.productApi}/${environment.apis.product.getProducts}/${productIds}`;
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .map(p => p.map(q => new Product(q)))
      .catch(this.handleError);
  }
  getProductReviews(productIds: string[]): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.product.getProductReview}/${productIds}`;
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getConsumer(consumerId: string): Observable<ReportConsumer> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.consumer.get}/${consumerId}`;
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .map(p => new ReportConsumer(p))
      .catch(this.handleError);
  }
  getConsumerOffersOrdersCount(orderId: string): Observable<ConsumerOffersOrdersCount> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersApi}/${environment.apis.consumer.orderOfferNumber}/${orderId}`;
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .map(p => new ConsumerOffersOrdersCount(p))
      .catch(this.handleError);
  }
  getSellerReviews(retailerId: string): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.orders.get}/${retailerId}`;
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }
  saveSellerPayment(sellerPayment: any) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersApi}/${environment.apis.orders.sellerPayment}`;
    return this.http
      .post(url, sellerPayment, { headers: this.headers })
      .map(p => p.text())
      .catch(this.handleError);
  }
  getSellerPaymentStatus(orderId: string, retailerId: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersApi}/${environment.apis.orders.sellerPaymentStatus}`.replace('{orderId}', orderId).replace('{retailerId}', retailerId);
    return this.http
      .get(url, { headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  }


  private handleError(error: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
