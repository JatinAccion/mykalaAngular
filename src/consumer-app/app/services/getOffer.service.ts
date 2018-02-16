import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class GetOfferService {
    constructor(private http: Http) { }

    getLocation(term: string) {
        const url: string = `${environment.geoCode}?address=${term}${environment.apis.geoCode.key}`;
        return this.http.get(url).map(res => res.json());
    };

    getExistingLocations() {
        const url = '/consumer-app/assets/zipcode.json';
        return this.http.get(url).map(res => res.json());
    }

    confirmOffer(step4Modal) {
        const url: string = `${environment.getOffer}/${environment.apis.getOffers.confirmOffer}`;
        return this.http.post(url, step4Modal).map(res => res.json());
    }
}