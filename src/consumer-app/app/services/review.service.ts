import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class MyReviewService {
    private BASE_URL: string = environment.profileInterest;
    private token: string;
    private headers;
    constructor(private http: Http) { }

    postReview(requestReviewModel) {
        this.setToken();
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.review}`;
        return this.http.post(url, requestReviewModel, { headers: this.headers }).map((res) => res.json());
    }

    setToken() {
        this.token = window.localStorage['token'] != undefined ? JSON.parse(JSON.parse(window.localStorage['token']).value) : '';
        this.headers = new Headers({
            Authorization: 'Bearer ' + this.token
        })
    }
}