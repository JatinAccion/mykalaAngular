import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class ViewOfferService {
    private BASE_URL: string = environment.profileInterest;
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
        const url: string = `${this.BASE_URL}/offer/${offerId}/product/${productId}`;
        return this.http.delete(url, offerId).map((res) => res.text())
    }
}