import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {
  url: string = '../consumer-app/assets/tiles.json';
  constructor(private http: Http) { }

  getTiles(tilename) {
    return this.http.get(this.url).map((res) => res.json());
  }
}
