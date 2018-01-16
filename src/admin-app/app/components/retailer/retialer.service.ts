import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestMethod } from '@angular/http';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from '../../services/LocalStorage.service';
import { nameValue, IdNameParent } from '../../../../models/nameValue';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';


import { Retailers, RetailerReports, RetailerNotification, RetailerReturnPolicy } from '../../../../models/retailer';
import { RetailerProfileInfo } from '../../../../models/retailer-profile-info';
import { RetailerPaymentInfo } from '../../../../models/retailer-payment-info';
import { RetialerShippingProfile } from '../../../../models/retailer-shipping-profile';
import { RetailerProductInfo } from '../../../../models/retailer-product-info';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RetialerService {
  private BASE_URL: string = environment.AdminApi;
  headers: Headers;

  profileDataObj = new RetailerProfileInfo();
  paymentDataObj = new RetailerPaymentInfo();
  productDataObj = new RetailerProductInfo();
  shippingsDataObj = new Array<RetialerShippingProfile>();
  returnDataObj = new RetailerReturnPolicy();
  notificationDataObj = new RetailerNotification();

  profileData = new Subject<RetailerProfileInfo>();
  paymentData = new Subject<RetailerPaymentInfo>();
  productData = new Subject<RetailerProductInfo>();
  shippingsData = new Subject<Array<RetialerShippingProfile>>();
  returnData = new Subject<RetailerReturnPolicy>();
  notificationData = new Subject<RetailerNotification>();



  paymentMethods = new Array<nameValue>();
  paymentVehicles = new Array<nameValue>();

  reset() {
    this.profileData.next(new RetailerProfileInfo());
    this.paymentData.next(new RetailerPaymentInfo());
    this.productData.next(new RetailerProductInfo());
    this.shippingsData.next(new Array<RetialerShippingProfile>());
    this.returnData.next(new RetailerReturnPolicy());
    this.notificationData.next(new RetailerNotification());
  }
  loadRetailer(retailerId: number) {
    this.profileInfoGet(retailerId).subscribe(p => p);
    this.paymentInfoGet(retailerId).subscribe(p => p);
    this.productGet(retailerId).subscribe(p => p);
    this.shippingProfileGet(retailerId).subscribe(p => p);
    this.returnPolicyGet(retailerId).subscribe(p => p);
    this.notificationGet(retailerId).subscribe(p => p);
  }
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
    this.profileData.subscribe(p => this.profileDataObj = p);
    this.paymentData.subscribe(p => this.paymentDataObj = p);
    this.productData.subscribe(p => this.productDataObj = p);
    this.shippingsData.subscribe(p => this.shippingsDataObj = p);
    this.returnData.subscribe(p => this.returnDataObj = p);
    this.notificationData.subscribe(p => this.notificationDataObj = p);
  }
  seedStaticData() {
    this.paymentMethods.push(new nameValue('1', 'Manual'));
    this.paymentMethods.push(new nameValue('2', 'Automated'));

    this.paymentVehicles.push(new nameValue('1', 'Stripe', '2'));
    this.paymentVehicles.push(new nameValue('2', 'Invoice', '1'));
    this.paymentVehicles.push(new nameValue('3', 'Credit Card', '1'));
  }
  get(query: any): Observable<Retailers> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailers.get}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => p.json())
      .map(p => new Retailers(p))
      .catch(this.handleError);

  }
  profileInfoGet(retailerId: number): Observable<RetailerProfileInfo> {
    if (this.profileDataObj && this.profileDataObj.retailerId == retailerId) {
      return Observable.of(this.profileDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerProfileInfo.get}`.replace('{retailerId}', retailerId.toString());
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() == '') {
            return this.profileDataObj;
          } else {
            this.profileData.next(new RetailerProfileInfo(res.json()));
            return new RetailerProfileInfo(res.json());
          }
        })
        .catch(this.handleError);
    }
  }
  profileInfoSave(retailerProfileInfo: RetailerProfileInfo): Observable<RetailerProfileInfo> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerProfileInfo.save}`;
    const requestOptions = { body: retailerProfileInfo, method: RequestMethod.Post, headers: this.headers };
    if (retailerProfileInfo.retailerId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          retailerProfileInfo.retailerId = res.json();
          retailerProfileInfo.status = true;
          this.profileData.next(retailerProfileInfo);
          return new RetailerProfileInfo(retailerProfileInfo);
        }
      }).catch(this.handleError);
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
    if (this.paymentDataObj && this.paymentDataObj.retailerId == retailerId) {
      return Observable.of(this.paymentDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerPaymentInfo.get}`.replace('{retailerId}', retailerId.toString());

      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() == '') {
            return this.paymentDataObj;
          } else {
            this.paymentData.next(new RetailerPaymentInfo(res.json()));
            return new RetailerPaymentInfo(res.json());
          }
        })
        .catch(this.handleError);
    }
  }
  paymentInfoSave(paymentInfo: RetailerPaymentInfo): Observable<RetailerPaymentInfo> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerPaymentInfo.save}`;
    const requestOptions = { body: paymentInfo, method: RequestMethod.Post, headers: this.headers };
    if (paymentInfo.bankId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          paymentInfo.bankId = res.json();
          paymentInfo.status = true;
          this.paymentData.next(paymentInfo);
          return new RetailerPaymentInfo(paymentInfo);
        }
      }).catch(this.handleError);
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
    if (this.notificationDataObj && this.notificationDataObj.retailerId == retailerId) {
      return Observable.of(this.notificationDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerShippingNotification.get}`.replace('{retailerId}', retailerId.toString());
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() == '') {
            return this.notificationDataObj;
          } else {
            this.notificationData.next(new RetailerNotification(res.json()));
            return new RetailerNotification(res.json());
          }
        })
        .catch(this.handleError);
    }
  }
  saveNotifications(notification: RetailerNotification): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerShippingNotification.save}`;
    const requestOptions = { body: notification, method: RequestMethod.Post, headers: this.headers };
    if (notification.notificationId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          notification.notificationId = res.json();
          this.notificationData.next(notification);
          return new RetailerNotification(notification);
        }
      }).catch(this.handleError);
  }
  returnPolicyGet(retailerId: number): Observable<RetailerReturnPolicy> {

    if (this.returnDataObj && this.returnDataObj.retailerId == retailerId) {
      return Observable.of(this.returnDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerShippingReturnPolicy.get}`.replace('{retailerId}', retailerId.toString());
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() == '') { return this.returnDataObj; } else {
            this.returnData.next(new RetailerReturnPolicy(res.json()));
            return new RetailerReturnPolicy(res.json());
          }
        })
        .catch(this.handleError);
    }
  }
  saveReturnPolicy(returnPolicy: RetailerReturnPolicy): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerShippingReturnPolicy.save}`;
    const requestOptions = { body: returnPolicy, method: RequestMethod.Post, headers: this.headers };
    if (returnPolicy.returnId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          returnPolicy.returnId = res.json();
          this.returnData.next(returnPolicy);
          return new RetailerReturnPolicy(returnPolicy);
        }
      }).catch(this.handleError);
  }
  productGet(retailerId: number): Observable<any> {
    const url = `${this.BASE_URL}/${environment.apis.retailerProduct.get}`.replace('{retailerId}', retailerId.toString());
    return this.http
      .get(`${url}`, { headers: this.headers })
      .map(res => res.json())
      .do(p => { p.status = true; this.productData.next(p); })
      .catch(this.handleError);
  }

  saveProduct(obj: any) {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerProduct.save}`;
    return this.http
      .post(url, obj, { headers: this.headers })
      .map(p => {
        obj.status = true;
        this.productData.next(obj);
        return obj;
      })
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
  changeStatus(retailerId: number, status: boolean | null = true) {
    const url = `${this.BASE_URL}/${environment.apis.retailers.changeStatus}`;
    return this.http
      .get(`${url}/${retailerId}/${status}`, { headers: this.headers })
      .map(res => res.text())
      .catch(this.handleError);
  }
  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
