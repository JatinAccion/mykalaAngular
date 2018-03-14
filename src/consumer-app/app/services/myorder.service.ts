import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyOrdersService {
    private BASE_URL: string = environment.checkout;

    constructor(private http: Http) { }

    getOrders(userId) {
        const url: string = `${this.BASE_URL}/${userId}/myOrders`;
        return this.http.get(url).map(res => res.json());
    }

    cancelOrder(cancelOrderModel) {
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.cancelOrder}`;
        return this.http.post(url, cancelOrderModel).map(res => res.text());
    }

    trackOrder(orderId) {
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.trackOrderShipment}/${orderId}`;
        return this.http.get(url).map(res => res.json());
    }

}
