import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { AddToCart } from '../../../../models/addToCart';
import { Router, RouterOutlet } from '@angular/router';
import { ViewProductService } from '../../services/viewProduct.service';
import { ReadReviewModel } from '../../../../models/readReviews';
import { environment } from '../../../environments/environment';
import animateScrollTo from 'animated-scroll-to';
import { BrowseProductsModal } from '../../../../models/browse-products';

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
  @ViewChild('viewProductModal') viewProductModal: ElementRef;
  confirmValidationMsg = { label: '', message: '' };
  dynamicColorData: any;
  dynamicSizeData: any;
  productListingModal = new BrowseProductsModal();
  unitValue: string;
  dynamicAttributeSize: Array<any>;
  dynamicAttributeColor: Array<any>;
  totalReviewSummary: any;
  retailerPolicy: string;

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
      this.loadProductInfo(undefined);
    }
    if (window.localStorage['existingItemsInCart'] != undefined) this.itemsInCart();
    this.selectedProduct.product.productImages.sort(function (x, y) {
      return (x.mainImage === y.mainImage) ? 0 : x.mainImage ? -1 : 1;
    });
  }

  loadProductInfo(fromInternalAPI?: any) {
    this.selectedProduct = JSON.parse(window.localStorage['selectedProduct']);
    this.loadReviewsSummary(this.selectedProduct.product.kalaUniqueId);
    this.loadRetailerPolicy(this.selectedProduct.product.retailerId);
    this.filterIamgeURL();
    this.getMainImage();
    this.getStockNumber();
    this.getReviews(this.selectedProduct.product.kalaUniqueId);
    if (this.selectedProduct.product.attributes != undefined && this.selectedProduct.product.attributes != {}) {
      if (this.selectedProduct.product.attributes.Color != undefined && this.selectedProduct.product.attributes.Size != {}) {
        this.loadAttributes(this.selectedProduct.product.attributes, fromInternalAPI);
      }
      else {
        this.loadAttributes(this.selectedProduct.product.attributes, undefined);
      }
    }
  }

  loadReviewsSummary(productId) {
    this.viewProduct.getReviewsSummary(productId).subscribe((res) => {
      if (res.length > 0) {
        this.totalReviewSummary = res[0];
        this.totalReviewSummary.average = parseInt(this.totalReviewSummary.avg);
      }
    }, (err) => {
      console.log(err);
    })
  }

  loadRetailerPolicy(retailerId) {
    this.viewProduct.getRetailerPolicy(retailerId).subscribe((res) => {
      this.retailerPolicy = res.returnPolicy;
    }, (err) => {
      console.log(err);
    })
  }

  loadAttributes(attributesData, fromInternalAPI?: any) {
    this.filterAttributes(attributesData);
    if (fromInternalAPI == undefined) {
      if (this.selectedProduct.product.attributes.Color != undefined && this.selectedProduct.product.attributes.Size != undefined) {
        this.viewProduct.getDynamicAttributes(this.selectedProduct, this.selectedProduct.product.attributes.Color, "").subscribe((res) => {
          this.dynamicColorData = res.allColors;
          this.dynamicSizeData = res.allSizes;
        }, (err) => {
          console.log(err)
        })
      }
    }
  }

  filterAttributes(attributesData) {
    let attributes = [];
    for (var key in attributesData) {
      if (key == 'Unit') { this.unitValue = attributesData[key] }
      else {
        attributes.push({
          key: key,
          value: attributesData[key]
        })
      }
    }
    attributes.filter((x) => {
      if (x.key == 'Size') { x.key = x.key + ' ' + '(' + this.unitValue + ')' }
    })
    this.selectedProduct.product.filteredAttr = attributes;
  }

  loadSimilarItems(e, data, from) {
    let element;
    let selectionMade = from;
    let lastColor;
    let lastSize;
    let sendOnlyColor = false;
    let sendOnlySize = false;
    if (from == 'color') element = document.getElementsByClassName('data_color');
    else element = document.getElementsByClassName('data_size');
    let colorElem = document.getElementsByClassName('data_color');
    let sizeElem = document.getElementsByClassName('data_size');
    for (var i = 0; i < colorElem.length; i++) {
      if (colorElem[i].classList.contains('categ_outline_red')) lastColor = colorElem[i].innerHTML
    }
    for (var i = 0; i < sizeElem.length; i++) {
      if (sizeElem[i].classList.contains('categ_outline_red')) lastSize = sizeElem[i].innerHTML
    }
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("categ_outline_red");
      element[i].classList.remove("unavailable");
      element[i].classList.add("categ_outline_gray");
    }
    e.currentTarget.classList.remove("categ_outline_gray");
    e.currentTarget.classList.add("categ_outline_red");
    if (this.dynamicAttributeSize != undefined && this.dynamicAttributeColor != undefined) {
      if (from == 'color') {
        if (this.dynamicAttributeColor.indexOf(data) === -1) {
          sendOnlyColor = true;
          sendOnlySize = false;
        }
      }
      else {
        if (this.dynamicAttributeSize.indexOf(data) === -1) {
          sendOnlyColor = false;
          sendOnlySize = true;
        }
      }
    }
    //Get Product
    this.viewProduct.getProductDetails(this.selectedProduct, data, from, lastColor, lastSize, sendOnlyColor, sendOnlySize).subscribe((res) => {
      this.productListingModal = new BrowseProductsModal(res);
      window.localStorage['selectedProduct'] = JSON.stringify(this.productListingModal);
      this.loadProductInfo('fromInternalAPI');
      if (window.localStorage['existingItemsInCart'] != undefined) this.itemsInCart();
      this.selectedProduct.product.productImages.sort(function (x, y) {
        return (x.mainImage === y.mainImage) ? 0 : x.mainImage ? -1 : 1;
      });
    }, (err) => {
      console.log(err)
    })
    //Get Color and Sizes
    this.viewProduct.getDynamicAttributes(this.selectedProduct, data, from).subscribe((res) => {
      if (selectionMade == 'color') {
        this.dynamicColorData = res.allColors;
        this.dynamicSizeData = res.allSizes;
        let element = document.getElementsByClassName('data_color');
        let allSize = document.getElementsByClassName('data_size');
        let selectedColor = res.selectedColor[0];
        let availableSizes = res.selectedSizes;
        this.dynamicAttributeSize = res.selectedSizes;
        let data = [];
        this.filterAttribute(element, selectedColor, allSize, availableSizes, data);
      }
      else {
        this.dynamicColorData = res.allColors;
        this.dynamicSizeData = res.allSizes;
        let element = document.getElementsByClassName('data_size');
        let allColor = document.getElementsByClassName('data_color');
        let selectedSize = res.selectedSizes[0];
        let availableColors = res.selectedColor;
        this.dynamicAttributeColor = res.selectedColor;
        let data = [];
        this.filterAttribute(element, selectedSize, allColor, availableColors, data);
      }
    }, (err) => {
      console.log(err)
    })
  }

  filterAttribute(element, selectedData, currentData, availableData, data) {
    for (var i = 0; i < element.length; i++) {
      if (element[i].innerHTML != selectedData) element[i].classList.add('unavailable');
    }
    for (var i = 0; i < currentData.length; i++) {
      data.push(currentData[i].innerHTML);
      currentData[i].classList.add('unavailable');
      currentData[i].classList.remove('categ_outline_red');
      currentData[i].classList.add('categ_outline_gray');
    }
    let notAvailabe = data.filter(val => availableData.includes(val));
    for (var i = 0; i < notAvailabe.length; i++) {
      for (var j = 0; j < currentData.length; j++) {
        if (notAvailabe[i] == currentData[j].innerHTML) {
          currentData[j].classList.remove('unavailable');
          currentData[j].classList.remove('categ_outline_red');
        }
      }
    }
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

  animateToTiles(from) {
    if (from == 'retailer') {
      var scroll = document.querySelector('.returnPolicy') as HTMLElement
    }
    else {
      var scroll = document.querySelector('.consumerReviews') as HTMLElement;
    }
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

  confirmUser() {
    window.localStorage['tbnAfterLogin'] = window.location.hash.split("#")[1];
    this.route.navigateByUrl('/login');
  }

  addToCart(to) {
    if (window.localStorage['token'] == undefined) {
      this.confirmValidationMsg.label = 'login';
      this.confirmValidationMsg.message = "You must be logged in to add items in the cart! Do you want to login now ?"
      this.core.openModal(this.viewProductModal);
    }
    else {
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
      for (var i = 0; i < this.selectedProduct.product.productImages.length; i++) {
        let image = this.selectedProduct.product.productImages[i]
        if (image.mainImage == true) this.addToCartModal.productImage = image.location;
      }
      window.localStorage['addedInCart'] = JSON.stringify(this.addToCartModal);
      window.localStorage['callSaveCart'] = true;
      this.route.navigateByUrl('/mycart');
    }
  }

}
