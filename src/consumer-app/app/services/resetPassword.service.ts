import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ResetPasswordService {
    private BASE_URL: string = environment.userService;
    constructor(private http: Http) { }

    resetPassword(rpModal) {
        const url = `${this.BASE_URL}/${environment.apis.userService.resetPassword}`;
        return this.http.post(url, rpModal).map((res) => res.text());
    }
}
