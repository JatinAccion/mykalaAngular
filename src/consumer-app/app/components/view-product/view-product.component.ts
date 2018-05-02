import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { AddToCart } from '../../../../models/addToCart';
import { Router, RouterOutlet } from '@angular/router';
import { ViewProductService } from '../../services/viewProduct.service';
import { ReadReviewModel } from '../../../../models/readReviews';
import { environment } from '../../../environments/environment';
import animateScrollTo from 'animated-scroll-to';

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
  s3 = environment.s3;
  userData: any;
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
    if (window.localStorage['userInfo'] != undefined) this.userData = JSON.parse(window.localStorage['userInfo'])
    if (window.localStorage['selectedProduct'] != undefined) {
      this.selectedProduct = JSON.parse(window.localStorage['selectedProduct']);
      this.getStockNumber();
      this.getReviews(this.selectedProduct.product.kalaUniqueId);
    }
    if (window.localStorage['existingItemsInCart'] != undefined) this.itemsInCart();
    this.selectedProduct.product.productImages.sort(function (x, y) {
      return (x.mainImage === y.mainImage) ? 0 : x.mainImage ? -1 : 1;
    });
  }

  animateToTiles() {
    var scroll = document.querySelector('.returnPolicy') as HTMLElement
    animateScrollTo(scroll);
  }

  getReviews(productId) {
    this.viewProduct.getReviews(productId).subscribe((res) => {
      this.productReviews = [];
      for (var i = 0; i < res.content.length; i++) {
        let review = res.content[i]
        this.productReviews.push(new ReadReviewModel(review.consumerId, review.consumerReviewId, review.productName, review.rating, review.retailerName, review.reviewDescription, review.reviewImages != undefined || review.reviewImages != null ? `${this.s3 + review.reviewImages}` : '', review.firstName, review.lastName))
      }
    }, (err) => {
      console.log(err)
    });
  }

  getRating(rate) {
    return Array(rate).fill(rate)
  }

  getStockNumber() {
    if (this.selectedProduct.product.quantity < 0) this.selectedProduct.product.quantity = 0
    else {
      for (var i = 0; i < this.selectedProduct.product.quantity; i++) {
        this.inStock.push(i + 1);
      }
      this.quantity = 1;
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
    if (this.userData != undefined) this.addToCartModal.userId = this.userData.userId;
    else this.addToCartModal.userId = "";
    this.addToCartModal.label = "cart";
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
    this.addToCartModal.taxCode = this.selectedProduct.product.taxCode;
    this.addToCartModal.productSKUCode = this.selectedProduct.product.productSkuCode;
    this.addToCartModal.productUPCCode = this.selectedProduct.product.productUpcCode;
    this.addToCartModal.width = this.selectedProduct.product.width;
    this.addToCartModal.height = this.selectedProduct.product.height;
    this.addToCartModal.length = this.selectedProduct.product.length;
    this.addToCartModal.weight = this.selectedProduct.product.weight;
    for (var i = 0; i < this.selectedProduct.product.productImages.length; i++) {
      let image = this.selectedProduct.product.productImages[i]
      if (image.mainImage == true) this.addToCartModal.productImage = image.location;
    }
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
