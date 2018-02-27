import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { AddToCart } from '../../../../models/addToCart';
import { Router, RouterOutlet } from '@angular/router';
import { ViewProductService } from '../../services/viewProduct.service';
import { ReadReviewModel } from '../../../../models/readReviews';

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
  quantity: any;
  inStock = [];
  productReviews = [];
  alreadyAddedInCart: boolean = false;
  constructor(
    public core: CoreService,
    private route: Router,
    private viewProduct: ViewProductService
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    localStorage.removeItem("addedInCart");
    if (window.localStorage['selectedProduct'] != undefined) {
      this.selectedProduct = JSON.parse(window.localStorage['selectedProduct']);
      this.getStockNumber();
      this.getReviews(this.selectedProduct.product.kalaUniqueId);
    }
    if (window.localStorage['existingItemsInCart'] != undefined) this.itemsInCart();
    setTimeout(function () {
      var carouselItem = document.getElementsByClassName("carousel-item")[0] as HTMLElement;
      var listInlineItem = document.getElementsByClassName("list-inline-item")[0] as HTMLElement;
      carouselItem.classList.add("active");
      listInlineItem.classList.add("active");
    }, 1000);
  }

  getReviews(productId) {
    this.viewProduct.getReviews(productId).subscribe((res) => {
      this.productReviews = [];
      for (var i = 0; i < res.content.length; i++) {
        let review = res.content[i]
        this.productReviews.push(new ReadReviewModel(review.consumerId, review.consumerReviewId, review.productName, parseFloat(review.rating), review.retailerName, review.reviewDescription, review.reviewImages, review.firstName, review.lastName))
      }
    }, (err) => {
      console.log(err)
    });
  }

  getRating(rate) {
    return Array(rate).fill(rate)
  }

  getStockNumber() {
    for (var i = 0; i < this.selectedProduct.product.quantity; i++) {
      this.inStock.push(i + 1);
    }
  }

  itemsInCart() {
    let itemsInCart = JSON.parse(window.localStorage['existingItemsInCart']);
    for (var i = 0; i < itemsInCart.length; i++) {
      if (this.selectedProduct.product.kalaUniqueId == itemsInCart[i].productId) {
        this.alreadyAddedInCart = true;
      }
    }
  }

  addToCart(to) {
    this.addToCartModal.retailerId = this.selectedProduct.product.retailerId;
    this.addToCartModal.retailerName = this.selectedProduct.retailerName;
    this.addToCartModal.productId = this.selectedProduct.product.kalaUniqueId;
    this.addToCartModal.productName = this.selectedProduct.product.productName;
    this.addToCartModal.price = this.selectedProduct.product.kalaPrice;
    this.addToCartModal.quantity = parseFloat(this.quantity);
    this.addToCartModal.inStock = this.selectedProduct.product.quantity;
    this.addToCartModal.retailerReturns = this.selectedProduct.retailerReturns;
    this.addToCartModal.shipProfileId = this.selectedProduct.product.shipProfileId;
    this.addToCartModal.productDescription = this.selectedProduct.product.productDescription;
    if (to === 'toCart') window.localStorage['addedInCart'] = JSON.stringify(this.addToCartModal);
    else {
      if (window.localStorage['existingItemsInWishList'] != undefined) {
        let wishListItems = JSON.parse(window.localStorage['existingItemsInWishList']);
        for (var i = 0; i < wishListItems.length; i++) {
          if (this.addToCartModal.productId == wishListItems[i].productId) {
            if (eval(`${this.addToCartModal.quantity + wishListItems[i].quantity}`) > wishListItems[i].inStock) {
              alert("Can't proceed");
              localStorage.removeItem('savedForLater');
              return false;
            }
            else window.localStorage['savedForLater'] = JSON.stringify(this.addToCartModal);
          }
          else window.localStorage['savedForLater'] = JSON.stringify(this.addToCartModal);
        }
      }
      else window.localStorage['savedForLater'] = JSON.stringify(this.addToCartModal);
    }
    this.route.navigateByUrl('/mycart');
  }

}
