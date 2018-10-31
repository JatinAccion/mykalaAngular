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

  getProductList(placeName, categoryName, page, size, subCategory?: any) {
    if (subCategory != undefined) var url: string = `${this.BASE_URL}/browseProduct?page=${page}&size=${size}&sortOrder=asc&elementType=createdDate&productPlaceName=${placeName}&productCategoryName=${categoryName}&productSubCategoryName=${subCategory}`;
    else var url: string = `${this.BASE_URL}/browseProduct?page=${page}&size=${size}&sortOrder=asc&elementType=createdDate&productPlaceName=${placeName}&productCategoryName=${categoryName}`;

    return this.http.get(url).map((res) => res.json());
  }

  getTilesType(subCategoryId) {
    const url: string = `${this.BASE_URL}/subCategory/${subCategoryId}/${environment.apis.products.getTypes}`;
    return this.http.get(url).map((res) => res.json());
  }

  productAvailability(data) {
    const url: string = `${this.BASE_URL}/${environment.apis.products.comingSoon}`;
    return this.http.post(url, data).map((res) => res.json());
  }

  checkProductAvailability(data) {
    const url: string = `${this.BASE_URL}/${environment.apis.products.comingSoon}`;
    return this.http.post(url, data).toPromise().then((res) => res.json());
  }

  filterLoadSubcategory(data) {
    const url: string = `${this.BASE_URL}/subCategoriesList`;
    return this.http.post(url, data).map((res) => res.json());
  }

  filterLoadSubcategoryAsync(data) {
    const url: string = `${this.BASE_URL}/subCategoriesList`;
    return this.http.post(url, data).toPromise().then((res) => res.json());
  }

  filterLoadCategories(data) {
    const url: string = `${this.BASE_URL}/categoriesList`;
    return this.http.post(url, data).toPromise().then((res) => res.json());
  }

  filterLoadType(data) {
    const url: string = `${this.BASE_URL}/typesList`;
    return this.http.post(url, data).toPromise().then((res) => res.json());
  }

  loadProductFromFilter(ids) {
    const url: string = `${this.BASE_URL}/dynamicSearch/${ids}?page=0&size=30`;
    return this.http.get(url).toPromise().then((res) => res.json());
  }
}
