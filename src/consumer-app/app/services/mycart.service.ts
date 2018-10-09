import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MyCartService {
    private BASE_URL: string = environment.checkout;
    private token: string;
    private headers;

    constructor(private http: Http) { }

    getCartItems(userId) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${userId}/${environment.apis.consumerCheckout.getCartItems}`;
        return this.http.get(url, { headers: this.headers }).map(res => res.json());
    }

    saveCartItems(data) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.saveCartItems}`;
        return this.http.put(url, data, { headers: this.headers }).map(res => res.json());
    }

    deleteCartItem(item) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${item.cartId}/${environment.apis.consumerCheckout.deleteCart}`;
        return this.http.delete(url, { headers: this.headers }).map(res => res.text());
    }

    deleteAllCartItem(userId) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${userId}/${environment.apis.consumerCheckout.deleteAllCartItems}`;
        return this.http.delete(url, { headers: this.headers }).map(res => res.text());
    }

    setToken() {
        this.token = window.localStorage['token'] != undefined ? JSON.parse(JSON.parse(window.localStorage['token']).value) : '';
        this.headers = new Headers({
            Authorization: 'Bearer ' + this.token
        })
    }

}
