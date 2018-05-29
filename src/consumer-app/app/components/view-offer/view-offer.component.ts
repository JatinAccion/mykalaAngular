import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { AddToCart } from '../../../../models/addToCart';
import { Router, RouterOutlet } from '@angular/router';
import { ViewOfferService } from '../../services/viewOffer.service';
import { ReadReviewModel } from '../../../../models/readReviews';
import { environment } from '../../../environments/environment';
import animateScrollTo from 'animated-scroll-to';
import { BrowseProductsModal } from '../../../../models/browse-products';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-offer.component.html',
  styleUrls: ['./view-offer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewOfferComponent implements OnInit {
  selectedProduct: any;
  loader: boolean = false;
  addToCartModal = new AddToCart();
  quantity: any;
  inStock = [];
  productReviews = [];
  alreadyAddedInCart: boolean = false;
  s3 = environment.s3;
  userData: any;
  @ViewChild('viewProductModal') viewProductModal: ElementRef;
  confirmValidationMsg = { label: '', message: '' };
  productListingModal = new BrowseProductsModal();
  unitValue: string;
  totalReviewSummary: any;
  retailerPolicy: string;

  constructor(
    public core: CoreService,
    private route: Router,
    private viewOffer: ViewOfferService
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    localStorage.removeItem("addedInCart");
    if (window.localStorage['userInfo'] != undefined) this.userData = JSON.parse(window.localStorage['userInfo'])
    if (window.localStorage['selectedProduct'] != undefined) {
      this.loadProductInfo();
    }
    if (window.localStorage['existingItemsInCart'] != undefined) this.itemsInCart();
    this.selectedProduct.product.productImages.sort(function (x, y) {
      return (x.mainImage === y.mainImage) ? 0 : x.mainImage ? -1 : 1;
    });
  }

  loadProductInfo() {
    this.selectedProduct = JSON.parse(window.localStorage['selectedProduct']).selectedProduct;
    this.loadReviewsSummary(this.selectedProduct.product.kalaUniqueId);
    this.loadRetailerPolicy(this.selectedProduct.product.retailerId);
    this.filterIamgeURL();
    this.getMainImage();
    this.getStockNumber();
    this.getReviews(this.selectedProduct.product.kalaUniqueId);
    if (this.selectedProduct.product.attributes != undefined && this.selectedProduct.product.attributes != {}) {
      this.filterAttributes(this.selectedProduct.product.attributes);
    }
    this.getItBy(this.selectedProduct.product.shipProfileId);
  }

  declineOffer(productId) {
    let offerId = JSON.parse(window.localStorage['selectedProduct']).offerId;
    this.viewOffer.declineOffer(offerId, productId).subscribe((res) => {
      this.route.navigateByUrl('/myoffer');
    }, (err) => {
      console.log(err);
    })
  }

  getItBy(shippingProfileId) {
    this.viewOffer.getItBy(shippingProfileId).subscribe((res) => {
      console.log(res);
      this.selectedProduct.product.deliveryMethod = this.getDeliveryDate(res, new Date())
    }, (err) => {
      console.log(err);
    })
  }

  loadReviewsSummary(productId) {
    this.totalReviewSummary = '';
    this.viewOffer.getReviewsSummary(productId).subscribe((res) => {
      if (res.length > 0) {
        this.totalReviewSummary = res[0];
        this.totalReviewSummary.average = parseInt(this.totalReviewSummary.avg);
        this.totalReviewSummary.left = eval(`${5 - this.totalReviewSummary.average}`)
      }
    }, (err) => {
      console.log(err);
    })
  }

  loadRetailerPolicy(retailerId) {
    this.viewOffer.getRetailerPolicy(retailerId).subscribe((res) => {
      this.retailerPolicy = res.returnPolicy;
    }, (err) => {
      console.log(err);
    })
  }

  filterAttributes(attributesData) {
    let attributes = [];
    for (var key in attributesData) {
      if (key == 'Unit') { this.unitValue = attributesData[key] }
      else {
        if (key == 'Color' && attributesData[key].indexOf(';') > -1) {
          attributesData[key] = attributesData[key].split(";").join(",");
        }
        attributes.push({
          key: key,
          value: attributesData[key]
        })
      }
    }
    attributes.filter((x) => {
      if (x.key == 'Size') {
        if (this.unitValue != undefined) x.key = x.key + ' ' + '(' + this.unitValue + ')'
      }
    })
    this.selectedProduct.product.filteredAttr = attributes;
  }

  filterIamgeURL() {
    for (var i = 0; i < this.selectedProduct.product.productImages.length; i++) {
      let product = this.selectedProduct.product.productImages[i];
      if (product.location.indexOf('data:') === -1 && product.location.indexOf('https:') === -1) {
        this.selectedProduct.product.productImages[i].location = this.s3 + product.location;
      }
    }
  }

  getMainImage() {
    for (var i = 0; i < this.selectedProduct.product.productImages.length; i++) {
      let product = this.selectedProduct.product.productImages[i]
      if (product.mainImage == true) this.selectedProduct.product.mainImageSrc = product.location
    }
  }

  getReviews(productId) {
    this.viewOffer.getReviews(productId).subscribe((res) => {
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

  animateToTiles(from) {
    if (from == 'retailer') var scroll = document.querySelector('.returnPolicy') as HTMLElement
    else var scroll = document.querySelector('.consumerReviews') as HTMLElement;
    animateScrollTo(scroll);
  }

  addToCart(to) {
    this.addToCartModal.userId = this.userData.userId;
    this.addToCartModal.label = "cart";
    this.addToCartModal.retailerId = this.selectedProduct.product.retailerId;
    this.addToCartModal.retailerName = this.selectedProduct.product.retailerName;
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
    this.addToCartModal.orderFrom = "OFFER";
    for (var i = 0; i < this.selectedProduct.product.productImages.length; i++) {
      let image = this.selectedProduct.product.productImages[i]
      if (image.mainImage == true) this.addToCartModal.productImage = image.location;
    }
    window.localStorage['addedInCart'] = JSON.stringify(this.addToCartModal);
    window.localStorage['callSaveCart'] = true;
    this.route.navigateByUrl('/mycart');
  }

  getDeliveryDate(deliveryMethod, currentDate) {
    let weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    // Express: 3 to 5 business days Delivery
    if (deliveryMethod == 'Express: 3 to 5 business days') {
      let date = new Date(currentDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 120 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
    // 2 day: 2 business day shipping days Delivery
    else if (deliveryMethod == '2 day: 2 business day shipping') {
      let date = new Date(currentDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 48 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
    // Standard: 5 to 8 business days Delivery
    else if (deliveryMethod == 'Standard: 5 to 8 business days') {
      let date = new Date(currentDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 192 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
    // Next day: 1 business day shipping
    else {
      let date = new Date(currentDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 24 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
  }

}
