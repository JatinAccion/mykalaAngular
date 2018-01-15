import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { AddToCart } from '../../../../models/addToCart';

@Component({
  selector: 'app-mycart',
  templateUrl: './mycart.component.html',
  styleUrls: ['./mycart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MycartComponent implements OnInit {
  itemsInCart = [];
  cartEmpty: boolean = false;
  noItemsInCart: boolean = false;
  savedForLater = [];
  addToCartModal = new AddToCart();
  constructor(private core: CoreService) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.checkItemsInCart();
    this.checkItemsInWishlist();
    console.log(this.itemsInCart);
  }

  checkItemsInCart() {
    if (window.localStorage['existingItemsInCart'] == undefined) {
      if (window.localStorage['addedInCart'] != undefined) {
        this.itemsInCart.push(JSON.parse(window.localStorage['addedInCart']));
        window.localStorage['existingItemsInCart'] = JSON.stringify(this.itemsInCart);
      }
      else {
        this.cartEmpty = true;
        this.noItemsInCart = true;
      }
    }
    else {
      let newItem;
      let isThere: boolean;
      let existingItemsInCart = JSON.parse(window.localStorage['existingItemsInCart']);
      for (var i = 0; i < existingItemsInCart.length; i++) this.itemsInCart.push(existingItemsInCart[i]);
      if (window.localStorage['addedInCart'] != undefined) {
        newItem = JSON.parse(window.localStorage['addedInCart']);
        for (var i = 0; i < this.itemsInCart.length; i++) {
          if (newItem.productId == this.itemsInCart[i].productId) {
            this.itemsInCart[i].quantity = eval(`${this.itemsInCart[i].quantity + newItem.quantity}`)
            isThere = true;
            window.localStorage['existingItemsInCart'] = JSON.stringify(this.itemsInCart);
            alert("Item updated in your cart");
          }
          else isThere = false;
        }
      }
      if (isThere == false) {
        this.itemsInCart.push(newItem);
        window.localStorage['existingItemsInCart'] = JSON.stringify(this.itemsInCart);
      }
    }
    localStorage.removeItem("addedInCart");
  }

  checkItemsInWishlist() {
    if (window.localStorage['existingItemsInWishList'] == undefined) {
      if (window.localStorage['savedForLater'] != undefined) {
        this.savedForLater.push(JSON.parse(window.localStorage['savedForLater']));
        window.localStorage['existingItemsInWishList'] = JSON.stringify(this.savedForLater);
      }
    }
    else {
      let newItem;
      let isThere: boolean;
      let existingItemsInWishList = JSON.parse(window.localStorage['existingItemsInWishList']);
      for (var i = 0; i < existingItemsInWishList.length; i++) this.savedForLater.push(existingItemsInWishList[i]);
      if (window.localStorage['savedForLater'] != undefined) {
        newItem = JSON.parse(window.localStorage['savedForLater']);
        for (var i = 0; i < this.savedForLater.length; i++) {
          if (newItem.productId == this.savedForLater[i].productId) {
            this.savedForLater[i].quantity = eval(`${this.savedForLater[i].quantity + newItem.quantity}`)
            isThere = true;
            window.localStorage['existingItemsInWishList'] = JSON.stringify(this.savedForLater);
            alert("Item updated in your wishlist");
          }
          else isThere = false;
        }
      }
      if (isThere == false) {
        this.savedForLater.push(newItem);
        window.localStorage['existingItemsInWishList'] = JSON.stringify(this.savedForLater);
      }
    }
    localStorage.removeItem("savedForLater");
  }

  itemTotal(price, quantity) {
    return eval(`${price * quantity}`)
  }

  totalPayableAmount() {
    let amounts = [];
    let itemPrices = document.getElementsByClassName("itemPrices");
    for (var i = 0; i < itemPrices.length; i++) amounts.push(parseFloat(itemPrices[i].innerHTML));
    return eval(amounts.join("+"));
  }

  move(item, to) {
    this.addToCartModal.retailerId = item.retailerId;
    this.addToCartModal.retailerName = item.retailerName;
    this.addToCartModal.productId = item.productId;
    this.addToCartModal.productName = item.productName;
    this.addToCartModal.price = item.price;
    this.addToCartModal.quantity = item.quantity;
    if (to === 'toCart') {
      window.localStorage['addedInCart'] = JSON.stringify(this.addToCartModal);
      for (var i = 0; i < this.savedForLater.length; i++) {
        if (this.savedForLater[i].productId == this.addToCartModal.productId) {
          this.savedForLater.splice(i, 1);
        }
      }
      window.localStorage['existingItemsInWishList'] = JSON.stringify(this.savedForLater);
      if (this.savedForLater.length == 0) {
        this.noItemsInCart = false;
        this.cartEmpty = false;
        localStorage.removeItem("existingItemsInWishList");
      }
      this.checkItemsInCart();
    }
    else {
      window.localStorage['savedForLater'] = JSON.stringify(this.addToCartModal);
      for (var i = 0; i < this.itemsInCart.length; i++) {
        if (this.itemsInCart[i].productId == this.addToCartModal.productId) {
          this.itemsInCart.splice(i, 1);
        }
      }
      window.localStorage['existingItemsInCart'] = JSON.stringify(this.itemsInCart);
      if (this.itemsInCart.length == 0) {
        this.noItemsInCart = true;
        this.cartEmpty = true;
        localStorage.removeItem("existingItemsInCart");
      }
      this.checkItemsInWishlist();
    }
  }

  deleteItem(item, from) {
    if (from === 'cart') {
      for (var i = 0; i < this.itemsInCart.length; i++) {
        if (this.itemsInCart[i].productId == item.productId) {
          this.itemsInCart.splice(i, 1);
          window.localStorage['existingItemsInCart'] = JSON.stringify(this.itemsInCart);
          this.totalPayableAmount();
        }
      }
      if (this.itemsInCart.length == 0) {
        this.noItemsInCart = true;
        this.cartEmpty = true;
        localStorage.removeItem("existingItemsInCart");
      }
    }
    else {
      for (var i = 0; i < this.savedForLater.length; i++) {
        if (this.savedForLater[i].productId == item.productId) {
          this.savedForLater.splice(i, 1);
          window.localStorage['existingItemsInWishList'] = JSON.stringify(this.savedForLater);
        }
      }
      if (this.savedForLater.length == 0) localStorage.removeItem("existingItemsInWishList");
    }
  }

}
