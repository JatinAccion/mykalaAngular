import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { MyOrders } from '../../../models/myOrder';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MyOrdersService {
    private BASE_URL: string = environment.checkout;
    private token: string;
    private headers;
    constructor(private http: Http) { }

    getOrders(userId) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${userId}/myOrders`;
        return this.http.get(url, { headers: this.headers }).map(res => res.json());
    }

    cancelOrder(cancelOrderModel) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.cancelOrder}`;
        return this.http.post(url, cancelOrderModel, { headers: this.headers }).map(res => res.text());
    }

    trackOrder(carrier, shippingTrackId, productId) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.trackOrderShipment}/${carrier}/${shippingTrackId}/${productId}`;
        return this.http.get(url, { headers: this.headers }).map(res => res.json());
    }

    support(model) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.support}`;
        return this.http.post(url, model, { headers: this.headers }).map(res => res.json());
    }
    getById(orderId: any): Observable<MyOrders> {
        this.setToken();
        const url = `${this.BASE_URL}/${orderId}`;
        return this.http
            .get(url, { headers: this.headers })
            .map(res => {
                if (res.text() === '') {
                    return new MyOrders();
                } else {
                    return new MyOrders(res.json());
                }
            });
    }
    setToken() {
        this.token = window.localStorage['token'] != undefined ? JSON.parse(JSON.parse(window.localStorage['token']).value) : '';
        this.headers = new Headers({
            Authorization: 'Bearer ' + this.token
        })
    }

}
