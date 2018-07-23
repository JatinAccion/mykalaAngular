import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyAlertsService {
    private BASE_URL: string = environment.profileInterest;

    constructor(private http: Http) { }

    checkSubscription(userId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.checkAlertSubscription}/${userId}`;
        return this.http.get(url).map((res) => res.text())
    }

    loadAllAlerts(userId, page, size) {
        const url: string = `${this.BASE_URL}/user/${userId}/${environment.apis.profileInterest.getAllAlerts}?page=${page}&size=${size}&sortOrder=desc&sort=alertDate,DESC`;
        return this.http.get(url).map((res) => res.json())
    }

    trackOrder(carrier, shippingTrackId) {
        const BASE_URL: string = environment.checkout;
        const url: string = `${BASE_URL}/${environment.apis.consumerCheckout.trackOrderShipment}/${carrier}/${shippingTrackId}`;
        return this.http.get(url).map(res => res.json());
    }

    updateAlerts(alert) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.getAllAlerts}`;
        return this.http.post(url, alert).map((res) => res.json())
    }
}
