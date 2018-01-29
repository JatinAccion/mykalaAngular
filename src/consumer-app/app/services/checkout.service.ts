import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class CheckoutService {
    private BASE_URL: string = environment.checkout;
    constructor(private http: Http) { }

    addCard(stripeAddCard) {
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.addCard}`;
        return this.http.post(url, stripeAddCard).map((res) => res.json());
    }

    chargeAmount(customerId, amount) {
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.chargeCustomer}?customerId=${customerId}&amount=${amount}`;
        return this.http.get(url).map((res) => res.json());
    }
}
