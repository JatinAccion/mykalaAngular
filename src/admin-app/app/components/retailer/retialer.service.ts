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


import { Retailers, RetailerNotification, RetailerReturnPolicy, SellerType, RetailerTax } from '../../../../models/retailer';
import { RetailerProfileInfo } from '../../../../models/retailer-profile-info';
import { RetailerPaymentInfo } from '../../../../models/retailer-payment-info';
import { RetialerShippingProfile, RetialerShippingProfiles } from '../../../../models/retailer-shipping-profile';
import { RetailerProductInfo } from '../../../../models/retailer-product-info';
import { Subject } from 'rxjs/Subject';
import { MasterData } from '../../../../models/masterData';
import { StripePayment } from '../../../../models/stripe-payment';

@Injectable()
export class RetialerService {
  private BASE_URL: string = environment.AdminApi;
  headers: Headers;

  profileDataObj = new RetailerProfileInfo();
  paymentDataObj = new RetailerPaymentInfo();
  productDataObj = new RetailerProductInfo();
  shippingsDataObj = new RetialerShippingProfiles();
  returnDataObj = new RetailerReturnPolicy();
  taxDataObj = new RetailerTax();
  notificationDataObj = new RetailerNotification();

  profileData = new Subject<RetailerProfileInfo>();
  paymentData = new Subject<RetailerPaymentInfo>();
  productData = new Subject<RetailerProductInfo>();
  shippingsData = new Subject<RetialerShippingProfiles>();
  returnData = new Subject<RetailerReturnPolicy>();
  taxData = new Subject<RetailerTax>();
  notificationData = new Subject<RetailerNotification>();


  states: MasterData;
  paymentMethods = new Array<nameValue>();
  paymentVehicles = new Array<nameValue>();

  reset() {
    this.profileData.next(new RetailerProfileInfo());
    this.paymentData.next(new RetailerPaymentInfo());
    this.productData.next(new RetailerProductInfo());
    this.shippingsData.next(new RetialerShippingProfiles());
    this.returnData.next(new RetailerReturnPolicy());
    this.taxData.next(new RetailerTax());
    this.notificationData.next(new RetailerNotification());
  }
  loadRetailer(retailerId: string) {
    this.profileInfoGet(retailerId).subscribe(p => p);
    this.paymentInfoGet(retailerId).subscribe(p => p);
    this.productGet(retailerId).subscribe(p => p);
    this.shippingProfileGet(retailerId).subscribe(p => p);
    this.returnPolicyGet(retailerId).subscribe(p => p);
    this.taxGet(retailerId).subscribe(p => p);
    this.notificationGet(retailerId).subscribe(p => p);
    this.getStates().subscribe(p => p);
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
    this.taxData.subscribe(p => this.taxDataObj = p);
    this.notificationData.subscribe(p => this.notificationDataObj = p);
  }
  seedStaticData() {
    this.paymentMethods.push(new nameValue('Manual', 'Manual'));
    this.paymentMethods.push(new nameValue('Automated', 'Automated'));

    this.paymentVehicles.push(new nameValue('Stripe', 'Stripe', 'Automated'));
    this.paymentVehicles.push(new nameValue('Invoice', 'Invoice', 'Manual'));
    this.paymentVehicles.push(new nameValue('Credit Card', 'Credit Card', 'Manual'));
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
  profileInfoGet(retailerId: string): Observable<RetailerProfileInfo> {
    if (this.profileDataObj && this.profileDataObj.retailerId === retailerId) {
      return Observable.of(this.profileDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerProfileInfo.get}`.replace('{retailerId}', retailerId.toString());
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() === '') {
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
          retailerProfileInfo.retailerId = res.json().retailerId;
          retailerProfileInfo.status = true;
          this.profileData.next(retailerProfileInfo);
          return new RetailerProfileInfo(retailerProfileInfo);
        }
      }).catch(this.handleError);
  }
  getSellerTypes(): Observable<SellerType[]> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailers.sellerTypes}`;
    return this.http
      .get(url, { headers: this.headers })
      .map(res => res.json().map(p => new SellerType(p)))
      .catch(this.handleError);
  }

  paymentInfoGet(retailerId: string): Observable<RetailerPaymentInfo> {
    if (this.paymentDataObj && this.paymentDataObj.retailerId === retailerId) {
      return Observable.of(this.paymentDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerPaymentInfo.get}`.replace('{retailerId}', retailerId.toString());

      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() === '') {
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
    if (paymentInfo.retailerBankPaymentId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          paymentInfo.retailerBankPaymentId = res.json().retailerBankPaymentId;
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
  addSellerAccount(stripePayment: StripePayment, reActivateStripe: boolean): Observable<any> {
    this.headers = this.getHttpHeraders();
    let url = `${environment.paymentApi}/${environment.apis.retailerPaymentInfo.addSellerAccount}`;
    const requestOptions = { body: stripePayment, method: RequestMethod.Post, headers: this.headers };
    if (reActivateStripe) {
      url = `${environment.paymentApi}/${environment.apis.retailerPaymentInfo.updateSellerAccount}`;
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => res.text())
      .catch(this.handleError);
  }

  shippingProfileGet(retailerId: string): Observable<RetialerShippingProfiles> {
    if (this.shippingsDataObj && this.shippingsDataObj.retailerId === retailerId) {
      return Observable.of(this.shippingsDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerShippingInfo.get}`.replace('{retailerId}', retailerId.toString());
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() === '') {
            return this.shippingsDataObj;
          } else {
            this.shippingsData.next(new RetialerShippingProfiles(res.json()));
            return new RetialerShippingProfiles(res.json());
          }
        })
        .catch(this.handleError);
    }
  }
  saveShipping(shippingProfile: RetialerShippingProfile): Observable<RetialerShippingProfile> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerShippingInfo.save}`;
    const requestOptions = { body: shippingProfile, method: RequestMethod.Post, headers: this.headers };
    if (shippingProfile.shippingProfileId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          if (shippingProfile.shippingProfileId) {
            if (this.shippingsDataObj.shippings.filter(p => p.shippingProfileId === shippingProfile.shippingProfileId).length > 0) {
              this.shippingsDataObj.shippings.filter(p => p.shippingProfileId === shippingProfile.shippingProfileId)[0] = shippingProfile;
            } else {
              this.shippingsDataObj.shippings.push(shippingProfile);
            }
          } else {
            shippingProfile.shippingProfileId = res.json().shippingProfileId;
            if (this.shippingsDataObj.shippings.filter(p => p.sequence === shippingProfile.sequence).length > 0) {
              this.shippingsDataObj.shippings.filter(p => p.sequence === shippingProfile.sequence)[0] = shippingProfile;
            } else {
              this.shippingsDataObj.shippings.push(shippingProfile);
            }
          }
          this.shippingsData.next(this.shippingsDataObj);
          return new RetialerShippingProfile(shippingProfile);
        }
      }).catch(this.handleError);
  }
  notificationGet(retailerId: string): Observable<RetailerNotification> {
    if (this.notificationDataObj && this.notificationDataObj.retailerId === retailerId) {
      return Observable.of(this.notificationDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerShippingNotification.get}`.replace('{retailerId}', retailerId.toString());
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() === '') {
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
    if (notification.shippingNotificationsId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          notification.shippingNotificationsId = res.json().shippingNotificationsId;
          this.notificationData.next(notification);
          return new RetailerNotification(notification);
        }
      }).catch(this.handleError);
  }
  returnPolicyGet(retailerId: string): Observable<RetailerReturnPolicy> {

    if (this.returnDataObj && this.returnDataObj.retailerId === retailerId) {
      return Observable.of(this.returnDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerShippingReturnPolicy.get}`.replace('{retailerId}', retailerId.toString());
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() === '') { return this.returnDataObj; } else {
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
    if (returnPolicy.shippingReturnId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          returnPolicy.shippingReturnId = res.json().shippingReturnId;
          this.returnData.next(returnPolicy);
          return new RetailerReturnPolicy(returnPolicy);
        }
      }).catch(this.handleError);
  }
  taxGet(retailerId: string): Observable<RetailerTax> {
    if (this.taxDataObj && this.taxDataObj.retailerId === retailerId) {
      return Observable.of(this.taxDataObj);
    } else {
      const url = `${environment.TaxApi}/${environment.apis.retailerTax.get}`.replace('{retailerId}', retailerId.toString());
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() === '') { return this.taxDataObj; } else {
            this.taxData.next(new RetailerTax(res.json()));
            return new RetailerTax(res.json());
          }
        })
        .catch(this.handleError);
    }
  }
  saveTax(tax: RetailerTax): Observable<any> {
    this.headers = this.getHttpHeraders();
    const url = `${environment.TaxApi}/${environment.apis.retailerTax.save}`;
    const requestOptions = { body: tax, method: RequestMethod.Post, headers: this.headers };
    if (tax.taxNexusId) {
      requestOptions.method = RequestMethod.Put;
    }
    return this.http.request(url, requestOptions)
      .map(res => {
        if (res.text() !== '') {
          tax.taxNexusId = res.json().taxNexusId;
          this.taxData.next(tax);
          return new RetailerReturnPolicy(tax);
        }
      }).catch(this.handleError);
  }
  productGet(retailerId: string): Observable<any> {
    if (this.productDataObj && this.productDataObj.retailerId === retailerId) {
      return Observable.of(this.productDataObj);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailerProduct.get}`.replace('{retailerId}', retailerId.toString());
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          if (res.text() === '') { return this.productDataObj; } else {
            this.productData.next(new RetailerProductInfo(res.json())); return new RetailerProductInfo(res.json());
          }
        })
        .catch(this.handleError);
    }
  }

  saveProduct(obj: RetailerProductInfo) {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailerProduct.save}`;
    return this.http
      .post(url, obj, { headers: this.headers })
      .map(p => {
        obj.productPreferenceId = p.json().productPreferenceId;
        obj.status = true;
        this.productData.next(obj);
        return obj;
      })
      .catch(this.handleError);
  }

  changeStatus(retailerId: string, status: boolean | null = true) {
    const url = `${this.BASE_URL}/${environment.apis.retailers.changeStatus}`;
    return this.http
      .put(`${url}/${retailerId}/${status}`, { headers: this.headers })
      .map(res => res.text())
      .catch(this.handleError);
  }
  checkSellerName(sellerName: string): Promise<boolean> {
    const url = `${this.BASE_URL}/${environment.apis.retailers.duplicateSellerName}`.replace('{sellerName}', sellerName);
    return this.http.get(`${url}`, { headers: this.headers }).toPromise().then(p => p.json());
    // return response.json();
  }
  getStates(): Observable<MasterData> {
    if (this.states != null) {
      return Observable.of(this.states);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.retailers.getStates}`;
      return this.http
        .get(url)
        .map(res => {
          this.states = new MasterData(res.json());
          return this.states;
        })
        .catch(this.handleError);
    }
  }

  private handleError(error: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
