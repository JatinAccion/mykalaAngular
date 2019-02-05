import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { CoreService } from './core.service';
@Injectable()
export class SellOnKalaService {
  private BASE_URL: string = environment.userService;

  constructor(private http: Http, private core: CoreService) { }

  joinKalaStepOne(userModel) {
    const url: string = `${this.BASE_URL}/${environment.apis.userService.createAccount}`;
    return this.http.post(url, userModel).map((res) => res.json())
  }

  verifyAccount(emailId) {
    const BASE_URL = environment.userService;
    const url: string = `${BASE_URL}/${environment.apis.userService.resendVerification}/${emailId}`;
    return this.http.get(url).map((res) => res.json());
  }
  getAllStates() {
    const BASE_URL_RETAILER: string = environment.shippingMethod;
    const url: string = `${BASE_URL_RETAILER}/${environment.apis.shippingMethod.getStates}`;
    return this.http.get(url, { headers: this.core.setHeaders() }).map((res) => res.json());
}

}
