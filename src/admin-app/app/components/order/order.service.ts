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
import { ReportOrders, ReportConsumer, ReportOrder, ConsumerOffersOrdersCount, RetailerOrders, ShippingTracking } from '../../../../models/report-order';
import { Product } from '../../../../models/product';
import { CoreService } from '../../services/core.service';

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
    private httpc: HttpClient,
    private core: CoreService
  ) {
    this.seedStaticData();
  }
  seedStaticData() {
  }
  get(query: any): Observable<ReportOrders> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.orders.get}`;
    return this.http
      .get(url, { search: query, headers: this.core.setHeaders() })
      .map(p => this.handleResponse(p, ReportOrders))
      .catch(this.handleError);
  }
  getRetailerOrders(query: any): Observable<RetailerOrders> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.orders.retailerOrders}`;
    return this.http
      .get(url, { search: query, headers: this.core.setHeaders() })
      .map(p => this.handleResponse(p, RetailerOrders))
      .catch(this.handleError);
  }

  getById(orderId: any): Observable<ReportOrder> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersApi}/${orderId}`;
    return this.http
      .get(url, { headers: this.core.setHeaders() })
      .map(p => this.handleResponse(p, ReportOrder))
      .catch(this.handleError);
  }
  saveShipmentTracking(shippingTracking: ShippingTracking) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersApi}/${environment.apis.orders.saveShipmentTracking}`;
    return this.http
      .post(url, shippingTracking, { headers: this.core.setHeaders() })
      .map(p => p.text())
      .catch(this.handleError);
  }
  getProducts(productIds: string[]): Observable<Product[]> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.productApi}/${environment.apis.product.getProducts}/${productIds}`;
    return this.http
      .get(url)
      .map(p => this.handleArrayResponse(p, Product))
      .catch(this.handleError);
  }
  getProductReviews(productIds: string[]): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.product.getProductReview}/${productIds}`;
    return this.http
      .get(url, { headers: this.core.setHeaders() })
      .map(p => p.json())
      .catch(this.handleError);
  }
  getConsumer(consumerId: string): Observable<ReportConsumer> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.consumerApi}/${environment.apis.consumer.get}/${consumerId}`;
    return this.http
      .get(url, { headers: this.core.setHeaders() })
      .map(p => this.handleResponse(p, ReportConsumer))
      .catch(this.handleError);
  }
  getConsumerOffersOrdersCount(orderId: string): Observable<ConsumerOffersOrdersCount> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersApi}/${environment.apis.consumer.orderOfferNumber}/${orderId}`;
    return this.http
      .get(url, { headers: this.core.setHeaders() })
      .map(p => this.handleResponse(p, ConsumerOffersOrdersCount))
      .catch(this.handleError);
  }
  getSellerReviews(retailerId: string): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.orders.get}/${retailerId}`;
    return this.http
      .get(url, { headers: this.core.setHeaders() })
      .map(p => p.json())
      .catch(this.handleError);
  }
  saveSellerPayment(sellerPayment: any) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersApi}/${environment.apis.orders.sellerPayment}`;
    return this.http
      .post(url, sellerPayment, { headers: this.core.setHeaders() })
      .map(p => p.text())
      .catch(this.handleError);
  }
  getSellerPaymentStatus(orderId: string, retailerId: string) {
    this.headers = this.getHttpHeraders();
    const url = `${environment.ordersApi}/${environment.apis.orders.sellerPaymentStatus}`.replace('{orderId}', orderId).replace('{retailerId}', retailerId);
    return this.http
      .get(url, { headers: this.core.setHeaders() })
      .map(p => {
        if (p.text() === '') {
          return '';
        } else { return p.json(); }
      })
      .catch(this.handleError);
  }

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
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}
