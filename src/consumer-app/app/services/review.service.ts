import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyReviewService {
    private BASE_URL: string = environment.profileInterest;
    constructor(private http: Http) { }

    postReview(requestReviewModel) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.review}`;
        return this.http.post(url, requestReviewModel).map((res) => res.json());
    }
}