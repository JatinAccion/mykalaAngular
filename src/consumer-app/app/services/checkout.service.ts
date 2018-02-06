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

    getCards(userId) {
        const url: string = `${this.BASE_URL}/${userId}/${environment.apis.consumerCheckout.getCards}`;
        return this.http.get(url).map((res) => res.json());
    }

    updateCard(userId) {
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.updateCard}`;
        return this.http.post(url, userId).map((res) => res.json());
    }

    chargeAmount(stripeCheckout) {
        const url: string = `${this.BASE_URL}/${environment.apis.consumerCheckout.chargeCustomer}`;
        return this.http.post(url, stripeCheckout).map((res) => res.json());
    }
}