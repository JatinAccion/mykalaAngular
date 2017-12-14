import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {
  constructor(private http: Http) { }

  getTilesPlace() {
    const url: string = '../consumer-app/assets/tilesPlace.json';
    return this.http.get(url).map((res) => res.json());
  }

  getTilesCategory(placeId) {
    const url: string = '../consumer-app/assets/tilesCategory.json';
    return this.http.get(url).map((res) => res.json());
  }

  getTilesSubCategory(categoryId) {
    const url: string = '../consumer-app/assets/tilesSubCategory.json';
    return this.http.get(url).map((res) => res.json());
  }
}
