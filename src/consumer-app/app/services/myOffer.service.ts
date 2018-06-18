import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyOffersService {
    private BASE_URL: string = environment.profileInterest;

    constructor(private http: Http) { }

    loadOffers(userId) {
        const url: string = `${this.BASE_URL}/loadMyOffers/${userId}`;
        return this.http.get(url).map((res) => res.json())
    }

    endOffer(offerId) {
        const url: string = `${this.BASE_URL}/endOffer/${offerId}`;
        return this.http.delete(url, offerId).map((res) => res.text())
    }
}
