import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConsumerInterestService {
  constructor(private http: Http) { }

  getInterest() {
    const url: string = 'http://dev-consumer-profile.us-east-2.elasticbeanstalk.com/profile/getCatalogs';
    return this.http.get(url).map((res) => res.json());
  }

  postInterest(interest) {
    const url: string = 'http://dev-consumer-profile.us-east-2.elasticbeanstalk.com/profile/addConsumerCatalogs';
    return this.http.post(url, interest).map((res) => res.json());
  }
}
