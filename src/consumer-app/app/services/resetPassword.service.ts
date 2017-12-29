import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ResetPasswordService {
    url: string;
    constructor(private http: Http) { }

    resetPassword(rpModal) {
        this.url = 'http://dev-user-signup.us-east-2.elasticbeanstalk.com/login/user/resetPassword';
        return this.http.post(this.url, rpModal).map((res) => res.text());
    }
}
