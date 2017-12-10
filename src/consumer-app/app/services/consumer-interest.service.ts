import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConsumerInterestService {
  url: string = '../consumer-app/assets/interest.json';

  constructor(private http: Http) { }

  getInterest() {
    return this.http.get(this.url).map((res) => res.json())
  }
}
