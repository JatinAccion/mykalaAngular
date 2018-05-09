import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class ViewProductService {
    private BASE_URL: string = environment.profileInterest;
    constructor(private http: Http) { }

    getReviews(productId) {
        const url: string = `${this.BASE_URL}/${environment.apis.profileInterest.getProductReviews}?page=0&size=10&sortOrder=asc&elementType=createdDate&productId=${productId}`;
        return this.http.get(url).map((res) => res.json());
    }

    getDynamicAttributes(selectedProduct, data, from) {
        const BASE_URL: string = environment.productList;
        let url: string;
        if (from == 'color') url = `${BASE_URL}/${environment.apis.products.dynamicAttributes}?retailerName=${selectedProduct.product.retailerName}&productName=${selectedProduct.product.productName}&productPlaceName=${selectedProduct.product.productPlaceName}&productCategoryName=${selectedProduct.product.productCategoryName}&productSubCategoryName=${selectedProduct.product.productSubCategoryName}&selected=Color&value=${data}`;
        else url = `${BASE_URL}/${environment.apis.products.dynamicAttributes}?retailerName=${selectedProduct.product.retailerName}&productName=${selectedProduct.product.productName}&productPlaceName=${selectedProduct.product.productPlaceName}&productCategoryName=${selectedProduct.product.productCategoryName}&productSubCategoryName=${selectedProduct.product.productSubCategoryName}&selected=Size&value=${data}`;
        return this.http.get(url).map((res) => res.json());
    }

    getProductDetails(selectedProduct, data, from, lastColor?: any, lastSize?: any) {
        const BASE_URL: string = environment.productList;
        let url: string;
        if (from == 'color') {
            if (lastSize != undefined) url = `${BASE_URL}/${environment.apis.products.productDetails}?retailerName=${selectedProduct.product.retailerName}&productName=${selectedProduct.product.productName}&productPlaceName=${selectedProduct.product.productPlaceName}&productCategoryName=${selectedProduct.product.productCategoryName}&productSubCategoryName=${selectedProduct.product.productSubCategoryName}&Color=${data}&Size=${lastSize}`;
            else url = `${BASE_URL}/${environment.apis.products.productDetails}?retailerName=${selectedProduct.product.retailerName}&productName=${selectedProduct.product.productName}&productPlaceName=${selectedProduct.product.productPlaceName}&productCategoryName=${selectedProduct.product.productCategoryName}&productSubCategoryName=${selectedProduct.product.productSubCategoryName}&Color=${data}`;
        }
        else {
            if (lastColor != undefined) url = `${BASE_URL}/${environment.apis.products.productDetails}?retailerName=${selectedProduct.product.retailerName}&productName=${selectedProduct.product.productName}&productPlaceName=${selectedProduct.product.productPlaceName}&productCategoryName=${selectedProduct.product.productCategoryName}&productSubCategoryName=${selectedProduct.product.productSubCategoryName}&Size=${data}&Color=${lastColor}`;
            else url = `${BASE_URL}/${environment.apis.products.productDetails}?retailerName=${selectedProduct.product.retailerName}&productName=${selectedProduct.product.productName}&productPlaceName=${selectedProduct.product.productPlaceName}&productCategoryName=${selectedProduct.product.productCategoryName}&productSubCategoryName=${selectedProduct.product.productSubCategoryName}&Size=${data}`;
        }
        return this.http.get(url).map((res) => res.json());
    }
}