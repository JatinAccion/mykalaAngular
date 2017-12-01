import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class VerificationService {
    url: string;
    constructor(private http: Http) { }

    getVerified(token) {
        this.url = 'http://192.168.169.181:5090/profile/validateToken';
        return this.http.post(this.url, token).map((res) => res.text())
    }
}
