import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyAlertsService {
    private BASE_URL: string = environment.profileInterest;

    constructor(private http: Http) { }

    loadOffers(emailId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.consumerOffer}/${emailId}`;
        return this.http.get(url).map((res) => res.json())
    }

    loadReviews(emailId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.userReviewList}/${emailId}`;
        return this.http.get(url).map((res) => res.json())
    }
}
