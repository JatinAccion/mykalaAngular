import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GetOfferService {
    url: string;
    constructor(private http: Http) { }

    getLocation(term: string) {
        this.url = 'https://maps.googleapis.com/maps/api/geocode/json?address= ' + term + '&key=AIzaSyDPSk91ksjR47kqdFbElVwL7eM8FgIZEHw';
        return this.http.get(this.url).map(res => res.json());
    };

    getExistingLocations() {
        this.url = '/consumer-app/assets/zipcode.json';
        return this.http.get(this.url).map(res => res.json());
    }
}