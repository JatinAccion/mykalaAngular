import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyAccountService {
    private BASE_URL: string = environment.profileInterest;
    private token: string;
    private headers;
    constructor(private http: Http) { }

    getUserDetails(userId) {
        const BASE_URL: string = environment.profileInterestPublic;
        const url: string = `${BASE_URL}/userId/${userId}`;
        return this.http.get(url).map(res => res.json());
    }

    getLocation(term: string) {
        const url: string = `${environment.geoCode}?address=${term}${environment.apis.geoCode.key}`;
        return this.http.get(url).map(res => res.json());
    }

    getCards(userId) {
        this.setToken();
        const BASE_URL: string = environment.card;
        const url: string = `${BASE_URL}/${userId}/${environment.apis.consumerCheckout.getCards}`;
        return this.http.get(url, { headers: this.headers }).map((res) => res.json());
    }

    addCard(stripeAddCard) {
        this.setToken();
        const BASE_URL: string = environment.card;
        const url: string = `${BASE_URL}/${environment.apis.consumerCheckout.addCard}`;
        return this.http.post(url, stripeAddCard, { headers: this.headers }).map((res) => res.json());
    }

    updateCard(stripeAddCard) {
        this.setToken();
        const BASE_URL: string = environment.card;
        const url: string = `${BASE_URL}/${environment.apis.consumerCheckout.updateCard}`;
        return this.http.post(url, stripeAddCard, { headers: this.headers }).map((res) => res.json());
    }

    deleteCard(customerId, cardId) {
        this.setToken();
        const BASE_URL: string = environment.card;
        const url: string = `${BASE_URL}/${customerId}/${cardId}/${environment.apis.consumerCheckout.deleteCard}`;
        return this.http.delete(url, { headers: this.headers }).map((res) => res.text());
    }

    deleteAddress(addressId, emailId) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${emailId}/${environment.apis.profileInterest.deleteAddress}/${addressId}`;
        return this.http.delete(url, { headers: this.headers }).map((res) => res.json());
    }

    getInterest() {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.getCatalogue}`;
        return this.http.get(url, { headers: this.headers }).map((res) => res.json());
    }

    saveProfileImage(profileImageModel) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountProfileImage}`;
        return this.http.post(url, profileImageModel, { headers: this.headers }).map((res) => res.json());
    }

    saveEmail(EmailModel) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountEmailId}`;
        return this.http.post(url, EmailModel, { headers: this.headers }).map((res) => res.json());
    }

    savePassword(PasswordModal) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountPassword}`;
        return this.http.post(url, PasswordModal, { headers: this.headers }).map((res) => res.text());
    }

    saveDOB(DOBModel) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountDOB}`;
        return this.http.post(url, DOBModel, { headers: this.headers }).map((res) => res.json());
    }

    saveAddress(AddressModel) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountLocation}`;
        return this.http.post(url, AddressModel, { headers: this.headers }).map((res) => res.json());
    }

    saveInterest(InterestModel) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.myAccountInterest}`;
        return this.http.post(url, InterestModel, { headers: this.headers }).map((res) => res.json());
    }

    getAllStates() {
        this.setToken();
        const BASE_URL_RETAILER: string = environment.shippingMethod;
        const url: string = `${BASE_URL_RETAILER}/${environment.apis.shippingMethod.getStates}`;
        return this.http.get(url, { headers: this.headers }).map((res) => res.json());
    }

    emailNotification(model) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.emailNotification}`;
        return this.http.post(url, model, { headers: this.headers }).map((res) => res.json());
    }

    alertNotification(model) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.alertNotification}`;
        return this.http.post(url, model, { headers: this.headers }).map((res) => res.json());
    }

    closeAccount(model) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.closeAccount}`;
        return this.http.post(url, model, { headers: this.headers }).map((res) => res.json());
    }

    setToken() {
        this.token = window.localStorage['token'] != undefined ? JSON.parse(JSON.parse(window.localStorage['token']).value) : '';
        this.headers = new Headers({
            Authorization: 'Bearer ' + this.token
        })
    }
}
