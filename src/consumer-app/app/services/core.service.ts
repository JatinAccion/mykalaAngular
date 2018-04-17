import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../../../models/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CoreService {
  private BASE_URL: string = environment.productList;
  hideUser: boolean = true;
  navVisible: boolean = true;
  logoutVisible: boolean = false;
  showSearch: boolean = true;
  showHeaderMessage: string;
  searchMessage: string;
  user: User;
  pageMsg: string;
  showPageMsg: boolean = false;
  noOfItemsInCart: boolean = false;
  userImg: string;
  loaderSearch: boolean = false;
  constructor(
    private http: Http,
    private route: Router,
    private modalService: NgbModal) { }

  hide() { this.navVisible = false; }

  searchMsgToggle(msg?: any) {
    if (msg != undefined) {
      this.showSearch = false;
      this.searchMessage = msg;
    }
    else this.showSearch = true;
  }

  pageLabel(pageMessage?: any) {
    if (pageMessage == undefined) this.showPageMsg = false;
    else {
      this.showPageMsg = true;
      this.pageMsg = pageMessage;
    }
  }

  showLogout() { return this.user !== null }

  show(msg?: any) { this.navVisible = true; this.showHeaderMessage = msg; }

  toggle() { this.navVisible = !this.navVisible; }

  setUser(usr: User) {
    this.user = usr;
    this.show();
  }

  clearUser() {
    this.user = null;
    this.hide();
  }

  hideUserInfo(showuser: boolean) {
    if (showuser === true) this.hideUser = true;
    else {
      this.hideUser = false;
      this.userImg = JSON.parse(window.localStorage['userInfo']).consumerImagePath;
    }
  }

  checkIfLoggedOut() {
    if (window.localStorage['token'] !== undefined) this.hideUserInfo(false);
    else {
      this.clearUser();
      this.hideUserInfo(true);
    }
  }

  headerScroll() {
    setTimeout(function () {
      var header = document.getElementsByClassName("header_sub")[0];
      var searchBox = document.getElementsByClassName("searchBox")[0];
      var logoContainer = document.getElementsByClassName("logo")[0];
      header.classList.add("header_Scroll");
      searchBox.classList.remove("invisible");
      logoContainer.classList.remove("d-none");
      logoContainer.nextElementSibling.classList.add("d-none");
    }, 100);
  }

  showNoOfItemsInCart() {
    if (window.localStorage['existingItemsInCart'] != undefined) {
      this.noOfItemsInCart = JSON.parse(window.localStorage['existingItemsInCart']).length;
      return true;
    }
    else return false;
  }

  getDetails(productId) {
    const url: string = `${environment.productList}/${environment.apis.products.getProduct}/${productId}`;
    return this.http.get(url).map((res) => res.json());
  }

  getProductDetails(productId) {
    this.getDetails(productId).subscribe((res) => {
      let updateStorage = JSON.parse(window.localStorage['levelSelections']);
      let tile = { deliveryMethod: "", product: res, retailerName: "", retailerReturns: "" }
      updateStorage.subType.id = tile.product.kalaUniqueId;
      updateStorage.subType.name = tile.product.productName;
      updateStorage.subType.text = tile.product.productName;
      updateStorage.subType.level = "5";
      window.localStorage['levelSelections'] = JSON.stringify(updateStorage);
      window.localStorage['selectedProduct'] = JSON.stringify(tile);
      this.route.navigateByUrl("/view-product");
    }, (err) => {
      console.log(err)
    })
  }

  openModal(content, size?: any) {
    this.modalService.open(content, { size: size });
  }

  searchProduct(text) {
    const url: string = `${environment.productList}/${environment.apis.products.search}=${text}`;
    return this.http.get(url).map((res) => res.json());
  }

  search(text) {
    this.loaderSearch = true;
    this.searchProduct(text).subscribe((res) => {
      this.loaderSearch = false;
    }, (err) => {
      this.loaderSearch = false;
    })
  }

}
