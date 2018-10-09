import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class GetOfferService {
    private token: string = JSON.parse(JSON.parse(window.localStorage['token']).value);
    private headers: Headers = new Headers({
        Authorization: `Bearer ${this.token}`
    })

    constructor(private http: Http) { }

    getLocation(term: string) {
        const url: string = `${environment.geoCode}?address=${term}${environment.apis.geoCode.key}`;
        return this.http.get(url).map(res => res.json());
    };

    getExistingLocations(userId) {
        const url: string = `${environment.profileInterest}/${environment.apis.profileInterest.addressList}/${userId}`;
        return this.http.get(url, { headers: this.headers }).map(res => res.json());
    }

    confirmOffer(step4Modal) {
        const url: string = `${environment.productList}/${environment.apis.getOffers.confirmOffer}`;
        return this.http.post(url, step4Modal, { headers: this.headers }).map(res => res.json());
    }

    getofferSubCategory(gSCM) {
        const url: string = `${environment.productList}/${environment.apis.getOffers.partial}`;
        return this.http.post(url, gSCM, { headers: this.headers }).map((res) => res.json());
    }
}