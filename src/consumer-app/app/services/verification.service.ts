import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class VerificationService {
    url: string;
    constructor(private http: Http) { }

    getVerified(token) {
        this.url = 'http://dev-user-signup.us-east-2.elasticbeanstalk.com/login/validateToken/' + token;
        return this.http.get(this.url).map((res) => res.text())
    }
}
