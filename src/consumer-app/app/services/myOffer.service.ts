import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyOffersService {
    private BASE_URL: string = environment.profileInterest;
    private token: string = JSON.parse(JSON.parse(window.localStorage['token']).value);
    private headers: Headers = new Headers({
        Authorization: `Bearer ${this.token}`
    })
    constructor(private http: Http) { }

    loadOffers(userId) {
        const url: string = `${this.BASE_URL}/loadMyOffers/${userId}`;
        return this.http.get(url, { headers: this.headers }).map((res) => res.json())
    }

    endOffer(offerId) {
        const url: string = `${this.BASE_URL}/endOffer/${offerId}`;
        return this.http.delete(url, { headers: this.headers }).map((res) => res.text())
    }
}
