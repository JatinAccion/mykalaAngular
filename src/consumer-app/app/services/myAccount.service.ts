import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyAccountService {
    private BASE_URL: string = environment.profileInterest;
    constructor(private http: Http) { }

    getUserDetails(emailId) {
        const url: string = `${this.BASE_URL}/email/${emailId}`;
        return this.http.get(url).map(res => res.json());
    }

    getLocation(term: string) {
        const url: string = `${environment.geoCode}?address=${term}${environment.apis.geoCode.key}`;
        return this.http.get(url).map(res => res.json());
    }

    getCards(userId) {
        const BASE_URL: string = environment.card;
        const url: string = `${BASE_URL}/${userId}/${environment.apis.consumerCheckout.getCards}`;
        return this.http.get(url).map((res) => res.json());
    }

    addCard(stripeAddCard) {
        const BASE_URL: string = environment.card;
        const url: string = `${BASE_URL}/${environment.apis.consumerCheckout.addCard}`;
        return this.http.post(url, stripeAddCard).map((res) => res.json());
    }

    updateCard(stripeAddCard) {
        const BASE_URL: string = environment.card;
        const url: string = `${BASE_URL}/${environment.apis.consumerCheckout.updateCard}`;
        return this.http.post(url, stripeAddCard).map((res) => res.json());
    }

    deleteCard(customerId, cardId) {
        const BASE_URL: string = environment.card;
        const url: string = `${BASE_URL}/${customerId}/${cardId}/${environment.apis.consumerCheckout.deleteCard}`;
        return this.http.delete(url).map((res) => res.text());
    }

    getInterest() {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.getCatalogue}`;
        return this.http.get(url).map((res) => res.json());
    }

    saveProfileImage(profileImageModel) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountProfileImage}`;
        return this.http.post(url, profileImageModel).map((res) => res.json());
    }

    saveEmail(EmailModel) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountEmailId}`;
        return this.http.post(url, EmailModel).map((res) => res.json());
    }

    savePassword(PasswordModal) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountPassword}`;
        return this.http.post(url, PasswordModal).map((res) => res.text());
    }

    saveDOB(DOBModel) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountDOB}`;
        return this.http.post(url, DOBModel).map((res) => res.json());
    }

    saveAddress(AddressModel) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountLocation}`;
        return this.http.post(url, AddressModel).map((res) => res.json());
    }

    saveInterest(InterestModel) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountInterest}`;
        return this.http.post(url, InterestModel).map((res) => res.json());
    }

    getAllStates() {
        const BASE_URL_RETAILER: string = environment.shippingMethod;
        const url: string = `${BASE_URL_RETAILER}/${environment.apis.shippingMethod.getStates}`;
        return this.http.get(url).map((res) => res.json());
    }

    emailNotification(model) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.emailNotification}`;
        return this.http.post(url, model).map((res) => res.json());
    }

    alertNotification(model) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.alertNotification}`;
        return this.http.post(url, model).map((res) => res.json());
    }

    closeAccount(model) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.closeAccount}`;
        return this.http.post(url, model).map((res) => res.json());
    }
}
