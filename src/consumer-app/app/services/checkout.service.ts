import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { CoreService } from './core.service';

@Injectable()
export class CheckoutService {
    private BASE_URL_ORDER: string = environment.checkout;
    private BASE_URL_CARD: string = environment.card;
    private BASE_URL_RETAILER: string = environment.shippingMethod;
    constructor(private http: Http, private core: CoreService) { }

    addCard(stripeAddCard) {
        const url: string = `${this.BASE_URL_CARD}/${environment.apis.consumerCheckout.addCard}`;
        return this.http.post(url, stripeAddCard, { headers: this.core.setHeaders() }).map((res) => res.json());
    }

    getShippingAddress(emailId) {
        const BASE_URL: string = environment.profileInterestPublic;
        const url: string = `${BASE_URL}/email/${emailId}`;
        return this.http.get(url).map(res => res.json());
    }

    getCards(userId) {
        const url: string = `${this.BASE_URL_CARD}/${userId}/${environment.apis.consumerCheckout.getCards}`;
        return this.http.get(url, { headers: this.core.setHeaders() }).map((res) => res.json());
    }

    updateCard(stripeAddCard) {
        const url: string = `${this.BASE_URL_CARD}/${environment.apis.consumerCheckout.updateCard}`;
        return this.http.post(url, stripeAddCard, { headers: this.core.setHeaders() }).map((res) => res.json());
    }

    deleteCard(customerId, cardId) {
        const url: string = `${this.BASE_URL_CARD}/${customerId}/${cardId}/${environment.apis.consumerCheckout.deleteCard}`;
        return this.http.delete(url, { headers: this.core.setHeaders() }).map((res) => res.text());
    }

    chargeAmount(productCheckout) {
        const url: string = `${this.BASE_URL_ORDER}/${environment.apis.consumerCheckout.orderPayment}`;
        return this.http.post(url, productCheckout, { headers: this.core.setHeaders() }).map((res) => res.text());
    }

    getShippingMethods(shippingProfileState, shippingProfileId, productQuantity, productWeight, productPrice, productLength, productHeight, productWidth) {
        const BASE_URL: string = environment.shippingMethod;
        const url: string = `${BASE_URL}/${environment.apis.shippingMethod.method}/shippingMethods?locationName=${shippingProfileState}&shippingProfileId=${shippingProfileId}&productQuantity=${productQuantity}&productWeight=${productWeight}&productPrice=${productPrice * productQuantity}&productLength=${productLength}&productHeight=${productHeight}&productWidth=${productWidth}`;
        return this.http.get(url, { headers: this.core.setHeaders() }).map((res) => res.json());
    }

    addEditShippingAddress(AddressModel) {
        const BASE_URL: string = environment.profileInterest;
        const url: string = `${BASE_URL}/${environment.apis.profileInterest.myAccountLocation}`;
        return this.http.post(url, AddressModel, { headers: this.core.setHeaders() }).map((res) => res.json());
    }

    getTax(avalarataxModel) {
        const url: string = `${this.BASE_URL_RETAILER}/${environment.apis.shippingMethod.getTax}`;
        return this.http.post(url, avalarataxModel, { headers: this.core.setHeaders() }).map((res) => res.json());
    }

    getAllStates() {
        const url: string = `${this.BASE_URL_RETAILER}/${environment.apis.shippingMethod.getStates}`;
        return this.http.get(url, { headers: this.core.setHeaders() }).map((res) => res.json());
    }

    productAvailability(productId) {
        const url: string = `${environment.productList}/${environment.apis.consumerCheckout.productQuantity}/${productId}`;
        return this.http.get(url).map((res) => res.json());
    }
}