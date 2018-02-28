import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { AddToCart } from '../../../../models/addToCart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mycart',
  templateUrl: './mycart.component.html',
  styleUrls: ['./mycart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MycartComponent implements OnInit {
  @ViewChild("TotalAmountPayable") TotalAmountPayable: ElementRef;
  itemsInCart = [];
  cartEmpty: boolean = false;
  noItemsInCart: boolean = false;
  savedForLater = [];
  addToCartModal = new AddToCart();
  fromMoveFunction: boolean = false;
  constructor(
    public core: CoreService,
    private route: Router
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.checkItemsInCart();
    this.checkItemsInWishlist();
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
      for (var i = 0; i < existingItemsInCart.length; i++)
        if (this.fromMoveFunction == true) {
          if (existingItemsInCart[i].productId == this.itemsInCart[i].productId) existingItemsInCart.splice(i, 1);
        }
        else this.itemsInCart.push(existingItemsInCart[i]);
      if (window.localStorage['addedInCart'] != undefined) {
        newItem = JSON.parse(window.localStorage['addedInCart']);
        for (var i = 0; i < this.itemsInCart.length; i++) {
          if (newItem.productId == this.itemsInCart[i].productId) {
            this.itemsInCart[i].quantity = eval(`${this.itemsInCart[i].quantity + newItem.quantity}`)
            isThere = true;
            window.localStorage['existingItemsInCart'] = JSON.stringify(this.itemsInCart);
            alert("Item updated in your cart");
            localStorage.removeItem("addedInCart");
            return false
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
      for (var i = 0; i < existingItemsInWishList.length; i++)
        if (this.fromMoveFunction == true) {
          if (existingItemsInWishList[i].productId == this.savedForLater[i].productId) existingItemsInWishList.splice(i, 1);
        }
        else this.savedForLater.push(existingItemsInWishList[i]);
      if (window.localStorage['savedForLater'] != undefined) {
        newItem = JSON.parse(window.localStorage['savedForLater']);
        for (var i = 0; i < this.savedForLater.length; i++) {
          if (newItem.productId == this.savedForLater[i].productId) {
            this.savedForLater[i].quantity = eval(`${this.savedForLater[i].quantity + newItem.quantity}`)
            isThere = true;
            window.localStorage['existingItemsInWishList'] = JSON.stringify(this.savedForLater);
            alert("Item updated in your wishlist");
            localStorage.removeItem("savedForLater");
            return false
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

  calculateQantity(e, action, item) {
    for (var i = 0; i < this.itemsInCart.length; i++) {
      if (this.itemsInCart[i].productId == item.productId && action === "decrease") {
        if (item.quantity == 1) return false;
        else {
          item.quantity = item.quantity - 1;
          this.itemsInCart[i].quantity = item.quantity;
        }
      }
      else if (this.itemsInCart[i].productId == item.productId && action === "increase") {
        if (item.quantity == item.inStock) return false;
        else {
          item.quantity = item.quantity + 1;
          this.itemsInCart[i].quantity = item.quantity;
        }
      }
      this.itemTotal(item.price, item.quantity);
      this.totalPayableAmount();
    }
    window.localStorage['existingItemsInCart'] = JSON.stringify(this.itemsInCart);
  }

  move(item, to) {
    this.cartEmpty = false;
    this.fromMoveFunction = true;
    this.addToCartModal.retailerId = item.retailerId;
    this.addToCartModal.retailerName = item.retailerName;
    this.addToCartModal.productId = item.productId;
    this.addToCartModal.productName = item.productName;
    this.addToCartModal.price = item.price;
    this.addToCartModal.quantity = item.quantity;
    this.addToCartModal.inStock = item.inStock;
    this.addToCartModal.productImage = item.productImage;
    if (to === 'toCart') {
      let moveToCart: boolean = false;
      let cartItems;
      if (window.localStorage['existingItemsInCart'] != undefined) {
        cartItems = JSON.parse(window.localStorage['existingItemsInCart'])
        for (var i = 0; i < cartItems.length; i++) {
          if (this.addToCartModal.productId == cartItems[i].productId) {
            if (eval(`${this.addToCartModal.quantity + cartItems[i].quantity}`) > cartItems[i].inStock) {
              alert("cannot move to cart");
              moveToCart = false;
              return false;
            }
            else moveToCart = true;
          }
          else if (this.addToCartModal.quantity > this.addToCartModal.inStock) moveToCart = false;
          else moveToCart = true;
        }
      }
      else if (this.addToCartModal.quantity > this.addToCartModal.inStock) {
        alert("cannot move to cart due to unavailability of stock");
        moveToCart = false;
        return false;
      }
      else moveToCart = true;
      if (moveToCart == true) {
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
    }
    else {
      let moveToWishList: boolean = false;
      let wishListItems;
      if (window.localStorage['existingItemsInWishList'] != undefined) {
        wishListItems = JSON.parse(window.localStorage['existingItemsInWishList']);
        for (var i = 0; i < wishListItems.length; i++) {
          if (this.addToCartModal.productId == wishListItems[i].productId) {
            if (eval(`${this.addToCartModal.quantity + wishListItems[i].quantity}`) > wishListItems[i].inStock) {
              alert("cannot move to wishlist");
              moveToWishList = false;
              return false;
            }
            else moveToWishList = true;
          }
          else if (this.addToCartModal.quantity > this.addToCartModal.inStock) moveToWishList = false;
          else moveToWishList = true;
        }
      }
      else if (this.addToCartModal.quantity > this.addToCartModal.inStock) {
        alert("cannot move to wishlist due to unavailability of stock");
        moveToWishList = false;
        return false;
      }
      else moveToWishList = true;
      if (moveToWishList == true) {
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
    this.fromMoveFunction = false;
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

  checkOut() {
    if (window.localStorage['token'] == undefined) {
      let action = confirm("You must be logged in to checkout your cart items!\n\nDo you want to login now ?");
      if (action == true) {
        window.localStorage['tbnAfterLogin'] = window.location.hash.split("#")[1];
        this.route.navigateByUrl('/login')
      }
      else return false;
    }
    else {
      window.localStorage['TotalAmount'] = parseInt(this.TotalAmountPayable.nativeElement.innerText);
      this.route.navigateByUrl("/checkout");
    }
  }
}
