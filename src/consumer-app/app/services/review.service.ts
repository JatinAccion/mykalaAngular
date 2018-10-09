import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyReviewService {
    private BASE_URL: string = environment.profileInterest;
    private token: string = JSON.parse(JSON.parse(window.localStorage['token']).value);
    private headers: Headers = new Headers({
        Authorization: `Bearer ${this.token}`
    })
    constructor(private http: Http) { }

    postReview(requestReviewModel) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.review}`;
        return this.http.post(url, requestReviewModel, { headers: this.headers }).map((res) => res.json());
    }
}