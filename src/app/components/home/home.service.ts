import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HomeService {
  customers = [{ "custID": 1, "orgName": "Arihant", "accOwner": "arihant@abc.com", "feildComment": "This is test", "status": 1, "billingCity": "Bang", "billingPin": "111", "billingCountry": "KA", "billingState": "IN" }, { "custID": 2, "orgName": "Kala", "accOwner": "Kala@abc.com", "feildComment": "This is test two", "status": 2, "billingCity": "Bang", "billingPin": "222", "billingCountry": "KA", "billingState": "IN" }, { "custID": 3, "orgName": "Kala", "accOwner": "Kala@abc.com", "feildComment": "This is test two", "status": 2, "billingCity": "Bang", "billingPin": "222", "billingCountry": "KA", "billingState": "IN" }, { "custID": 4, "orgName": "Kala", "accOwner": "Kala@abc.com", "feildComment": "This is test two", "status": 2, "billingCity": "Bang", "billingPin": "222", "billingCountry": "KA", "billingState": "IN" }, { "custID": 5, "orgName": "Kala", "accOwner": "Kala@abc.com", "feildComment": "This is test two", "status": 2, "billingCity": "Bang", "billingPin": "222", "billingCountry": "KA", "billingState": "IN" }];
  constructor(private http: Http) { }

  getCustomers() {
    return this.http.get('http://awsbootpoc-env.us-east-1.elasticbeanstalk.com/sample/customer/').map(res => res.json());
    // return Observable.create(o => { o.next(this.customers); o.complete(); });
  }

}
