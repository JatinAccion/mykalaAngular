import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class HomeService {
  private BASE_URL: string = environment.productList;
  constructor(private http: Http) { }

  getTilesPlace() {
    const url: string = `${this.BASE_URL}/${environment.apis.products.getPlaces}`;
    return this.http.get(url).map((res) => res.json());
  }

  getTilesCategory(placeId) {
    const url: string = `${this.BASE_URL}/places/${placeId}/${environment.apis.products.getCategories}`;
    return this.http.get(url).map((res) => res.json());
  }

  getTilesSubCategory(categoryId) {
    const url: string = `${this.BASE_URL}/category/${categoryId}/${environment.apis.products.getSubCategories}`;
    return this.http.get(url).map((res) => res.json());
  }

  getProductList(placeName, categoryName, subCategory) {
    const url: string = `${this.BASE_URL}/subCategory?page=1&size=2&sortOrder=asc&elementType=createdDate&PlaceName=${placeName}&productCategoryName=${categoryName}&productSubCategoryName=${subCategory}`;
    return this.http.get(url).map((res) => res.json());
  }

  getTilesType(subCategoryId) {
    const url: string = `${this.BASE_URL}/subCategory/${subCategoryId}/${environment.apis.products.getTypes}`;
    return this.http.get(url).map((res) => res.json());
  }
}
