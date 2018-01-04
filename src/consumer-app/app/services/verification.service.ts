import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class VerificationService {
    private BASE_URL: string = environment.userService;
    constructor(private http: Http) { }

    getVerified(token) {
        const url: string = `${this.BASE_URL}/${environment.apis.userService.validateToken}/${token}`;
        return this.http.get(url).map((res) => res.text())
    }
}
