import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ForgotPasswordService {
    private BASE_URL: string = environment.userService;
    constructor(private http: Http) { }

    forgotPassword(fpModal) {
        const url: string = `${this.BASE_URL}/${environment.apis.userService.forgotPassword}`;
        return this.http.post(url, fpModal).map((res) => res.json())
    }
}
