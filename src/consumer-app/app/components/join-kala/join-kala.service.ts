import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class JoinKalaService {
  signupURL: string = 'http://192.168.169.181:7090/login/user/';

  constructor(private http: Http) { }

  joinKalaStepOne(userModel) {
    return this.http.post(this.signupURL, userModel).map((res) => res.json())
  }
}
