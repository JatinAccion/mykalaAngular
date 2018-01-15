import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';

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
  constructor(private core: CoreService) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.checkItemsInCart();
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

  itemTotal(price, quantity) {
    return eval(`${price * quantity}`)
  }

  totalPayableAmount() {
    let amounts = [];
    let itemPrices = document.getElementsByClassName("itemPrices");
    for (var i = 0; i < itemPrices.length; i++) amounts.push(parseFloat(itemPrices[i].innerHTML));
    return eval(amounts.join("+"));
  }

  deleteItem(item) {
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

}
