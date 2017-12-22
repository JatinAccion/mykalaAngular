import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { environment } from './../../../environments/environment';
import { RetailerProfileInfo } from '../../../../models/retailer-profile-info';
import { Observable } from 'rxjs/Observable';
import { Retailer, RetailerReports, RetailerNotification, RetailerReturnPolicy } from '../../../../models/retailer';
import { LocalStorageService } from '../../services/LocalStorage.service';
import { nameValue, IdNameParent } from '../../../../models/nameValue';
import { RetailerPaymentInfo } from '../../../../models/retailer-payment-info';
import { RetialerShippingProfile } from '../../../../models/retailer-shipping-profile';

@Injectable()
export class RetialerService {
  private BASE_URL: string = environment.AdminApi;
  headers: Headers;

  paymentMethods = new Array<nameValue>();
  paymentVehicles = new Array<nameValue>();
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
    private localStorageService: LocalStorageService
  ) {
    this.seedStaticData();
  }
  seedStaticData() {
    this.paymentMethods.push(new nameValue('1', 'Manual'));
    this.paymentMethods.push(new nameValue('2', 'Automated'));

    this.paymentVehicles.push(new nameValue('1', 'Stripe', '2'));
    this.paymentVehicles.push(new nameValue('2', 'Invoice', '1'));
    this.paymentVehicles.push(new nameValue('3', 'Credit Card', '1'));
  }
  get(query: any): Observable<any[]> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailers.get}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);

  }
  profileInfoGet(retailerId: number): Observable<RetailerProfileInfo> {
    const url = `${this.BASE_URL}/${environment.apis.retailerProfileInfo.get}`;
    return this.http
      .get(`${url}/${retailerId}`, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  profileInfoSave(retailerProfileInfo: RetailerProfileInfo): Promise<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerProfileInfo.save}`;
    return this.http
      .post(url, retailerProfileInfo, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }
  getSellerTypes(): Observable<nameValue[]> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailers.sellerTypes}`;
    return this.http
      .get(url, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  paymentInfoGet(retailerId: number): Observable<RetailerPaymentInfo> {
    const url = `${this.BASE_URL}/${environment.apis.retailerPaymentInfo.get}`;
    return this.http
      .get(`${url}/${retailerId}`, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  paymentInfoSave(paymentInfo: RetailerPaymentInfo): Promise<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerPaymentInfo.save}`;
    return this.http
      .post(url, paymentInfo, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }

  public getPaymentMethods(): Observable<nameValue[]> {
    if (this.paymentMethods != null) {
      return Observable.of(this.paymentMethods);
    } else {
      return this.http
        .get('')
        .map(res => <nameValue[]>res.json())
        .do(res => (this.paymentMethods = res))
        .catch(this.handleError);
    }
  }
  public getPaymentVehicles(): Observable<nameValue[]> {
    if (this.paymentVehicles != null) {
      return Observable.of(this.paymentVehicles);
    } else {
      return this.http
        .get('')
        .map(res => <nameValue[]>res.json())
        .do(res => (this.paymentVehicles = res))
        .catch(this.handleError);
    }
  }
  shippingProfileGet(retailerId: number): Observable<RetialerShippingProfile> {
    const url = `${this.BASE_URL}/${environment.apis.retailerProfileInfo.get}`;
    return this.http
      .get(`${url}/${retailerId}`, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  saveShipping(shippingProfile: RetialerShippingProfile): Promise<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerShippingInfo.save}`;
    return this.http
      .post(url, shippingProfile, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }
  notificationGet(retailerId: number): Observable<RetailerNotification> {
    const url = `${this.BASE_URL}/${environment.apis.retailerShippingNotification.get}`;
    return this.http
      .get(`${url}/${retailerId}`, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  saveNotifications(notification: RetailerNotification): Promise<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerShippingNotification.save}`;
    return this.http
      .post(url, notification, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }
  returnPolicyGet(retailerId: number): Observable<RetailerReturnPolicy> {
    const url = `${this.BASE_URL}/${environment.apis.retailerShippingReturnPolicy.get}`;
    return this.http
      .get(`${url}/${retailerId}`, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  saveReturnPolicy(returnPolicy: RetailerReturnPolicy): Promise<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerShippingReturnPolicy.save}`;
    return this.http
      .post(url, returnPolicy, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }

  getPlaces(): Observable<Array<IdNameParent>> {
    const url = `${this.BASE_URL}/${environment.apis.retailerProduct.getPlaces}`;
    return this.http
      .get(`${url}`, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  getCatagories(ids: string[]): Observable<Array<IdNameParent>> {
    const url = `${this.BASE_URL}/${environment.apis.retailerProduct.getCategories}`;
    return this.http
      .post(`${url}`, ids, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  getSubCatagories(ids: string[]): Observable<Array<IdNameParent>> {
    const url = `${this.BASE_URL}/${environment.apis.retailerProduct.getSubCategories}`;
    return this.http
      .post(`${url}`, ids, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }
  getTypes(ids: string[]): Observable<Array<IdNameParent>> {
    const url = `${this.BASE_URL}/${environment.apis.retailerProduct.getTypes}`;
    return this.http
      .post(`${url}`, ids, { headers: this.headers })
      .map(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
