import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User, UserProfile } from '../../../models/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import animateScrollTo from 'animated-scroll-to';

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
  public modalReference: any;

  constructor(
    private http: Http,
    private route: Router,
    private modalService: NgbModal
  ) { }

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

  clearStorageUserInfo() {
    localStorage.removeItem('userInfo');
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

  validateUser(userId) {
    this.clearUser();
    this.hideUserInfo(true);
    if (localStorage.getItem('userInfo')) {
      const usr = new UserProfile(JSON.parse(localStorage.getItem('userInfo')));
      if (usr && usr.isConsumer && usr.userId === userId) {
        this.setUser(usr);
        return true;
      }
    }
    return false;
  }

  redirectTo(pageName: string) {
    if (!localStorage.getItem('userInfo')) {
      window.localStorage['tbnAfterLogin'] = pageName;
      this.route.navigateByUrl('/login');
    } else {
      this.route.navigateByUrl('/' + pageName);
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

  scrollToClass(className: string) {
    if (className) {
      let scroll = document.querySelector(`.${className}`) as HTMLElement
      if (scroll) {
        animateScrollTo(scroll);
      }
    }
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
      const tile = { deliveryMethod: '', product: res, retailerName: '', retailerReturns: '' }
      window.localStorage['selectedProduct'] = JSON.stringify(tile);
      if (window.localStorage['levelSelections']) {
        const updateStorage = JSON.parse(window.localStorage['levelSelections']);
        updateStorage.subType.id = tile.product.kalaUniqueId;
        updateStorage.subType.name = tile.product.productName;
        updateStorage.subType.text = tile.product.productName;
        updateStorage.subType.level = '5';
        window.localStorage['levelSelections'] = JSON.stringify(updateStorage);
      }
      this.route.navigateByUrl('/view-product');
    }, (err) => {
      console.log(err);
    });
  }

  openModal(content, size?: any) {
    this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(
      (result) => { },
      (reason) => {
        this.getDismissReason(reason);
      });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  searchProduct(text) {
    const url: string = `${environment.productList}/${environment.apis.products.search}=${text}`;
    return this.http.get(url).map((res) => res.json());
  }

  search(text) {
    this.loaderSearch = true;
    window.localStorage['esKey'] = text;
    this.searchProduct(text).subscribe((res) => {
      this.loaderSearch = false;
      this.route.navigateByUrl("/elastic-product");
    }, (err) => {
      this.loaderSearch = false;
    })
  }

  allowOnlyNumbers(event) {
    var key = window.event ? event.keyCode : event.which;
    if (event.keyCode == 8 || event.keyCode == 46
      || event.keyCode == 37 || event.keyCode == 39) {
      return true;
    }
    else if (key < 48 || key > 57) return false;
    else return true;
  }

}
