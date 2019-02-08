import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { CoreService } from './core.service';
@Injectable()
export class SellOnKalaService {
  private BASE_URL: string = environment.userService;

  constructor(private http: Http, private core: CoreService) { }

  postSellOnKalaForm(sellOnKalaModel) {
    const BASE_URL_RETAILER: string = environment.shippingMethod;
    const url: string = `${BASE_URL_RETAILER}/${environment.apis.shippingMethod.sellOnKala}`;
    return this.http.post(url, sellOnKalaModel).map((res) => res.json())
  }

 
  getAllStates() {
    const BASE_URL_RETAILER: string = environment.shippingMethod;
    const url: string = `${BASE_URL_RETAILER}/${environment.apis.shippingMethod.getStates}`;
    return this.http.get(url, { headers: this.core.setHeaders() }).map((res) => res.json());
}

}
