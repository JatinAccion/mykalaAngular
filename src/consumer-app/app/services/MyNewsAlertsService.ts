import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyAlertsService {
    private BASE_URL: string = environment.profileInterest;
    private token: string = JSON.parse(JSON.parse(window.localStorage['token']).value);
    private headers: Headers = new Headers({
        Authorization: `Bearer ${this.token}`
    })
    constructor(private http: Http) { }

    checkSubscription(userId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.checkAlertSubscription}/${userId}`;
        return this.http.get(url, { headers: this.headers }).map((res) => res.text());
    }

    loadAllAlerts(userId, page, size) {
        const url: string = `${this.BASE_URL}/user/${userId}/${environment.apis.profileInterest.getAllAlerts}?page=${page}&size=${size}&sortOrder=desc&sort=alertDate,DESC`;
        return this.http.get(url, { headers: this.headers }).map((res) => res.json())
    }

    trackOrder(carrier, shippingTrackId, productId) {
        const BASE_URL: string = environment.checkout;
        const url: string = `${BASE_URL}/${environment.apis.consumerCheckout.trackOrderShipment}/${carrier}/${shippingTrackId}/${productId}`;
        return this.http.get(url, { headers: this.headers }).map(res => res.json());
    }

    updateAlerts(alert) {
        const BASE_URL: string = environment.profileInterestPublic;
        const url: string = `${BASE_URL}/${environment.apis.profileInterest.getAllAlerts}/${'read'}`;
        return this.http.post(url, alert).map((res) => res.json());
    }
}
