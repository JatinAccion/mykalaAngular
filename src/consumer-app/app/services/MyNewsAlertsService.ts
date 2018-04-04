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

    loadOrders(userId) {
        const BASE_URL: string = environment.checkout;
        const url: string = `${BASE_URL}/${environment.apis.consumerCheckout.shippedItems}/${userId}`;
        return this.http.get(url).map((res) => res.json())
    }

    loadReviews(emailId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.userReviewList}/${emailId}`;
        return this.http.get(url).map((res) => res.json())
    }

    updateOffer(offerId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.updateOffer}/${offerId}`;
        return this.http.get(url).map((res) => res.json())
    }

    updateReview(reviewId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.updateReview}/${reviewId}/${false}`;
        return this.http.get(url).map((res) => res.json())
    }
}
