import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyOffersService {
    private BASE_URL: string = environment.productList;

    constructor(private http: Http) { }

    loadOffers(emailId) {
        const url: string = `${this.BASE_URL}/email/${emailId}`;
        return this.http.get(url).map((res) => res.json())
    }
}
