import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../../../models/user';

@Injectable()
export class CoreService {
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
  constructor(private http: Http) { }

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

}
