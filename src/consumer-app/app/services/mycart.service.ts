import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MyCartService {
    private BASE_URL: string = environment.checkout;

    constructor(private http: Http) { }

    getCartItems(userId) {
        const url: string = `${this.BASE_URL}/${userId}/${environment.apis.consumerCheckout.getCartItems}`;
        return this.http.get(url).map(res => res.json());
    }

    saveCartItems(data) {
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.saveCartItems}`;
        return this.http.post(url, data).map(res => res.json());
    }

}
