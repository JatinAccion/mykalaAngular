import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product  } from '../../../../../models/Product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./../product.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit {
  products: Array<Product>;
  isCollapsed=true;
  constructor(private retialerService: ProductService) {
    this.products = new Array<Product>();
  }

  ngOnInit() {
    this.getData();

  }
  getData() {
    this.retialerService.get(null).subscribe((res) => {
      return res.forEach(obj => { this.products.push(new Product(obj)); });
    });
  }
}
