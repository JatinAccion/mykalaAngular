import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {
  constructor(private http: Http) { }

  getTilesPlace() {
    const url: string = 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api/products/places';
    return this.http.get(url).map((res) => res.json());
  }

  getTilesCategory(placeId) {
    const url: string = 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api/products/places/' + placeId + '/categories';
    return this.http.get(url).map((res) => res.json());
  }

  getTilesSubCategory(categoryId) {
    const url: string = 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api/products/category/' + categoryId + '/subCategories';
    return this.http.get(url).map((res) => res.json());
  }

  getTilesType(subCategoryId) {
    const url: string = 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api/products/subCategory/' + subCategoryId + '/types';
    return this.http.get(url).map((res) => res.json());
  }
}
