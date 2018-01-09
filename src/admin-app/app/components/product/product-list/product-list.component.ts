import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Products } from '../../../../../models/Product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  productName: any;
  loading: boolean;
  products: Products;
  isCollapsed = true;
  constructor(private productService: ProductService) {
    this.products = new Products();
  }

  ngOnInit() {
    this.getPage(1);

  }
  getPage(page: number) {
    this.loading = true;
    this.productService.get({
      page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate', retailerName: this.productName
    }).subscribe(res => {
      this.products = res;
      this.loading = false;
    });
  }
}
