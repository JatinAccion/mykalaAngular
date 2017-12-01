import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { environment } from './../../../environments/environment';
import { RetailerProfileInfo } from '../../../../models/retailer-profile-info';
import { Observable } from 'rxjs/Observable';
import { Retailer } from '../../../../models/retailer';


@Injectable()
export class RetialerService {
  private BASE_URL: string = environment.authApi;
  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  constructor(private http: Http) { }

  get(query: any): Observable<Retailer> {
    const url = `${this.BASE_URL}/${environment.apis.retailers.get}`;
    return this.http.get(url, { search: query, headers: this.headers })
      .map(p => {
        const obj = p.json();
        return new Retailer(
          obj.imageUrl,
          obj.name,
          obj.address,
          obj.reviews,
          obj.productsCount,
          obj.transactionsCount,
          obj.returnsCount,
          obj.offersCount,
          obj.complaintsCount);
      });
  }
  profileInfoSave(retailerProfileInfo: RetailerProfileInfo): Promise<any> {
    const url = `${this.BASE_URL}/${environment.apis.retailerProfileInfo.add}`;
    return this.http.post(url, retailerProfileInfo, { headers: this.headers }).toPromise();
  }
}
