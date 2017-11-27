import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class JoinKalaService {
  joinKalaURL: string = 'http://kaladev-env.us-east-1.elasticbeanstalk.com/login/user/';
  
  constructor(private http: Http) { }

  joinKalaStepOne(singupDetails) {
    return this.http.post(this.joinKalaURL, singupDetails)
  }
}
