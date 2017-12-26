import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { LocalStorageService } from '../../services/LocalStorage.service';
import { environment } from './../../../environments/environment';
import { nameValue } from '../../../../models/nameValue';
import { Product } from '../../../../models/Product';

@Injectable()
export class ProductService {
  private BASE_URL: string = environment.productApi;
  headers: Headers;

  shippingProfiles = new Array<nameValue>();
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
    this.shippingProfiles.push(new nameValue('1', 'Furniture delivery'));
    this.shippingProfiles.push(new nameValue('2', 'Small item delivery'));
    this.shippingProfiles.push(new nameValue('3', '1-5 business days shipping'));
  }
  get(query: any): Observable<any[]> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.retailers.get}`;
    return this.http
      .get(url, { search: query, headers: this.headers })
      .map(p => p.json())
      .catch(this.handleError);
  } 
  saveProduct(product: Product): Promise<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.product.save}`;
    return this.http
      .post(url, product, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }
 
  public getShippingProfiles(): Observable<nameValue[]> {
    if (this.shippingProfiles != null) {
      return Observable.of(this.shippingProfiles);
    } else {
      return this.http
        .get('')
        .map(res => <nameValue[]>res.json())
        .do(res => (this.shippingProfiles = res))
        .catch(this.handleError);
    }
  }
  
  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
