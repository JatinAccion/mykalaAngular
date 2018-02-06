import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyAccountService {
    private BASE_URL: string = environment.profileInterest;
    constructor(private http: Http) { }

    getUserDetails() {
        const url: string = '/consumer-app/assets/myAccountGet.json';
        return this.http.get(url).map(res => res.json());
    }

    getLocation(term: string) {
        const url: string = `${environment.geoCode}?address=${term}${environment.apis.geoCode.key}`;
        return this.http.get(url).map(res => res.json());
    }
}
