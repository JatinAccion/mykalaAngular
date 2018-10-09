import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class ViewOfferService {
    private BASE_URL: string = environment.profileInterestPublic;
    private token: string = JSON.parse(JSON.parse(window.localStorage['token']).value);
    private headers: Headers = new Headers({
        Authorization: `Bearer ${this.token}`
    })
    constructor(private http: Http) { }

    getReviews(productId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.getProductReviews}?page=0&size=10&sortOrder=asc&elementType=createdDate&productId=${productId}`;
        return this.http.get(url).map((res) => res.json());
    }

    getReviewsSummary(productId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.review}/${environment.apis.profileInterest.productReviewSummary}/${productId}`;
        return this.http.get(url).map((res) => res.json());
    }

    getRetailerPolicy(retailerId) {
        const BASE_URL: string = environment.shippingMethod;
        const url: string = `${BASE_URL}/retailer/v1/${retailerId}/${environment.apis.shippingMethod.retailerPolicy}`;
        return this.http.get(url).map((res) => res.json());
    }

    getItBy(shippingProfileId) {
        const BASE_URL: string = environment.shippingMethod;
        const url: string = `${BASE_URL}/retailer/v1/${shippingProfileId}/${environment.apis.shippingMethod.latestShipMethodName}`;
        return this.http.get(url).map((res) => res.text());
    }

    declineOffer(offerId, productId) {
        const BASE_URL: string = environment.profileInterest;
        const url: string = `${BASE_URL}/offers/${offerId}/products/${productId}`;
        return this.http.delete(url, { headers: this.headers }).map((res) => res.text())
    }
}