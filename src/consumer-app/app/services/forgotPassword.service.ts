import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ForgotPasswordService {
    url: string;
    constructor(private http: Http) { }

    forgotPassword(fpModal) {
        this.url = 'http://dev-user-signup.us-east-2.elasticbeanstalk.com/login/user/forgotPassword';
        return this.http.post(this.url, fpModal).map((res) => res.json())
    }
}
