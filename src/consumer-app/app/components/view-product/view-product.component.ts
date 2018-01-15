import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { AddToCart } from '../../../../models/addToCart';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewProductComponent implements OnInit {
  selectedProduct: any;
  loader: boolean = false;
  addToCartModal = new AddToCart();
  quantity: number;
  constructor(
    private core: CoreService,
    private route: Router
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    localStorage.removeItem("addedInCart");
    if (window.localStorage['selectedProduct'] != undefined) this.selectedProduct = JSON.parse(window.localStorage['selectedProduct']);
    setTimeout(function () {
      var carouselItem = document.getElementsByClassName("carousel-item")[0] as HTMLElement;
      var listInlineItem = document.getElementsByClassName("list-inline-item")[0] as HTMLElement;
      carouselItem.classList.add("active");
      listInlineItem.classList.add("active");
    }, 1000);
  }

  addToCart() {
    this.addToCartModal.retailerId = this.selectedProduct.product.retailerId;
    this.addToCartModal.retailerName = this.selectedProduct.retailerName;
    this.addToCartModal.productId = this.selectedProduct.product.kalaUniqueId;
    this.addToCartModal.productName = this.selectedProduct.product.productName;
    this.addToCartModal.price = this.selectedProduct.product.kalaPrice;
    this.addToCartModal.quantity = this.quantity;
    window.localStorage['addedInCart'] = JSON.stringify(this.addToCartModal);
    this.route.navigateByUrl('/mycart');
  }

}
