import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProfileInfoService {
    url: string;
    constructor(private http: Http) { }

    /*Geocode API Integration*/
    getLocation(term: string) {
        this.url = 'https://maps.googleapis.com/maps/api/geocode/json?address= ' + term + '&key=AIzaSyDPSk91ksjR47kqdFbElVwL7eM8FgIZEHw';
        return this.http.get(this.url).map(res => res.json());
    }

    /*Profile Completion API*/
    completeProfile(profileInformation) {
        this.url = 'http://192.168.169.181:5090/profile/userDetail/';
        return this.http.post(this.url, profileInformation).map((res) => res.text())
    }
}
