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
import { Product } from '../../../../models/Product';
import { ProductPlace, ProductType, ProductSubCategory, ProductCategory } from '../../../../models/product-info';

@Injectable()
export class ProductService {
  private BASE_URL: string = environment.productApi;
  headers: Headers;

  shippingProfiles = new Array<nameValue>();
  productPlaces = new Array<ProductPlace>();
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
  saveProductImages(images: any): Promise<any> {
    this.headers = this.getHttpHeraders();
    const url = `${this.BASE_URL}/${environment.apis.product.saveImage}`;

    const formData = this.objectToFormData(images);
    const headers = new Headers({
      'Content-Type': 'multipart/form-data'
      //  Authorization: token //`Bearer ${token}`
    });
    return this.http
      .post(url, formData, { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

  // saveProductImages(images: any): Observable<any> {
  //   // const formdata: FormData = new FormData();
  //   // formdata.append('images', images.Images.productImages[0].imageurl);
  //   const formdata = this.objectToFormData(images);
  //   const url = `${this.BASE_URL}/${environment.apis.product.saveImage}`;
  //   const req = new HttpRequest('POST', url, formdata, {
  //     reportProgress: true,
  //     responseType: 'text'
  //   });

  //   return this.httpc.request(req);
  // }
  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  // check formdata
  //   for (var pair of formData.entries()) {
  //     console.log(pair[0]+ ', ' + pair[1]);
  // }
  objectToFormData = function (obj, form?, namespace?) {

    const fd = form || new FormData();
    let formKey;
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {

        if (namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }

        // if the property is an object, but not a File,
        // use recursivity.
        if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {

          this.objectToFormData(obj[property], fd, property);

        } else {

          // if it's a string or a File object
          fd.append(formKey, obj[property]);
        }

      }
    }

    return fd;

  };

  getProductPlaces(): Observable<Array<ProductPlace>> {
    if (this.productPlaces != null && this.productPlaces.length !== 0) {
      return Observable.of(this.productPlaces);
    } else {
      const url = `${this.BASE_URL}/${environment.apis.product.places}`;
      return this.http
        .get(`${url}`, { headers: this.headers })
        .map(res => {
          const resArr = <Array<any>>res.json();
          resArr.forEach(obj => this.productPlaces.push(new ProductPlace(obj)));
          return this.productPlaces;
        })
        .catch(this.handleError);
    }
  }
  getProductCategories(placeIds: string[]): Observable<Array<ProductCategory>> {
    const url = `${this.BASE_URL}/${environment.apis.product.categories}`;
    return this.http
      .post(`${url}`, { fieldValues: placeIds }, { headers: this.headers })
      .map(res => <Array<any>>res.json().map(obj => new ProductCategory(obj)))
      .catch(this.handleError);
  }
  getProductSubCategories(categoryIds: string[]): Observable<Array<ProductSubCategory>> {
    const url = `${this.BASE_URL}/${environment.apis.product.subCategories}`;
    return this.http
      .post(`${url}`, { fieldValues: categoryIds }, { headers: this.headers })
      .map(res => <Array<any>>res.json().map(obj => new ProductSubCategory(obj)))
      .catch(this.handleError);
  }
  getProductTypes(subCategoryIds: string[]): Observable<Array<ProductType>> {
    const url = `${this.BASE_URL}/${environment.apis.product.types}`;
    return this.http
      .post(`${url}`, { fieldValues: subCategoryIds }, { headers: this.headers })
      .map(res => <Array<any>>res.json().map(obj => new ProductType(obj)))
      .catch(this.handleError);
  }
}
