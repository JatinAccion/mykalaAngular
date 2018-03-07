import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class CheckoutService {
    private BASE_URL_ORDER: string = environment.checkout;
    private BASE_URL_CARD: string = environment.card;
    private BASE_URL_RETAILER: string = environment.shippingMethod;
    constructor(private http: Http) { }

    addCard(stripeAddCard) {
        const url: string = `${this.BASE_URL_CARD}/${environment.apis.consumerCheckout.addCard}`;
        return this.http.post(url, stripeAddCard).map((res) => res.json());
    }

    getShippingAddress(emailId) {
        const BASE_URL: string = environment.profileInterest;
        const url: string = `${BASE_URL}/email/${emailId}`;
        return this.http.get(url).map(res => res.json());
    }

    getCards(userId) {
        const url: string = `${this.BASE_URL_CARD}/${userId}/${environment.apis.consumerCheckout.getCards}`;
        return this.http.get(url).map((res) => res.json());
    }

    updateCard(stripeAddCard) {
        const url: string = `${this.BASE_URL_CARD}/${environment.apis.consumerCheckout.updateCard}`;
        return this.http.post(url, stripeAddCard).map((res) => res.json());
    }

    deleteCard(customerId, cardId) {
        const url: string = `${this.BASE_URL_CARD}/${customerId}/${cardId}/${environment.apis.consumerCheckout.deleteCard}`;
        return this.http.delete(url).map((res) => res.text());
    }

    chargeAmount(productCheckout) {
        const url: string = `${this.BASE_URL_ORDER}/${environment.apis.consumerCheckout.orderPayment}`;
        return this.http.post(url, productCheckout).map((res) => res.text());
    }

    getShippingMethods(shippingProfileState, shippingProfileId) {
        const BASE_URL: string = environment.shippingMethod;
        const url: string = `${BASE_URL}/${environment.apis.shippingMethod.method}/shippingMethods?locationName=${shippingProfileState}&shippingProfileId=${shippingProfileId}`;
        return this.http.get(url).map((res) => res.json());
    }

    addEditShippingAddress(AddressModel) {
        const BASE_URL: string = environment.profileInterest;
        const url: string = `${BASE_URL}/${environment.apis.profileInterest.myAccountLocation}`;
        return this.http.post(url, AddressModel).map((res) => res.json());
    }

    getTax(avalarataxModel) {
        const url: string = `${this.BASE_URL_RETAILER}/${environment.apis.shippingMethod.getTax}`;
        return this.http.post(url, avalarataxModel).map((res) => res.json());
    }
}