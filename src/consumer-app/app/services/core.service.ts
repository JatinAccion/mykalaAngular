import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { User, UserProfile, BasicAuth } from '../../../models/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import animateScrollTo from 'animated-scroll-to';
import { Subject } from 'rxjs/Subject';
import { BrowseProductsModal } from '../../../models/browse-products';
import { Location } from '@angular/common';
import { SuggestionList } from '../../../models/suggestionList';
import { LocalStorageService } from './LocalStorage.service';

@Injectable()
export class CoreService {
  loader: boolean;
  tilesData: any[];
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
  esKey = new Subject<any[]>();
  states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tenneccssee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  suggesstionList: Array<any>;
  arrowkeyLocation = 0;
  resetToDefault: number;
  showHeaderSuggestion: boolean = false;
  searchBar: string;
  stripe = Stripe(environment.stripePK);
  loader_suggestion: boolean = false;
  session: any;
  esSizeCounter: number = 30;
  esFromCounter: number = 0;
  isSearchWithoutSuggestion: boolean = false;
  refreshingSession: boolean = false;
  isWithSpecialCharacter: boolean = false;
  productNotFound: boolean = false;

  constructor(
    private http: Http,
    private route: Router,
    private modalService: NgbModal,
    private location: Location,
    private localStorageService: LocalStorageService
  ) {
    if (window.localStorage['token'] != undefined) this.startTokenValidation()
  }

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

  show(msg?: any) {
    this.navVisible = true;
    this.showHeaderMessage = msg;
  }

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
      if (this.userImg == "" || this.userImg == undefined || this.userImg == null || this.userImg.indexOf("/assets/images/avatar.jpg") > -1 || this.userImg == "https://s3.us-east-2.amazonaws.com/") {
        this.userImg = "/consumer-app/assets/images/avatar.jpg";
      }
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
      // if (usr && usr.isConsumer && usr.userId === userId) {
      if (usr && usr.userId === userId) {
        this.setUser(usr);
        return true;
      }
      return false;
    }
    return true;
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
      if (searchBox != undefined) searchBox.classList.remove("invisible");
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
      const tile = new BrowseProductsModal(res);
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

  searchProduct(text, parentName, size, from) {
    const url: string = `${environment.productList}/${environment.apis.products.search}=${text}&parentName=${parentName}&size=${size}&from=${from}`;
    return this.http.get(url).toPromise().then((res) => res.json());
  }

  getProductSuggesstion(text) {
    this.isWithSpecialCharacter ? text = text.replace(/[^a-zA-Z0-9 ]/g, "") : text;
    const url: string = `${environment.productList}/${environment.apis.products.typeAhead}/${text}`;
    return this.http.get(url).map((res) => res.json());
  }

  filterIamgeURL() {
    for (var i = 0; i < this.tilesData.length; i++) {
      if (this.tilesData[i].product.productImages) {
        for (var j = 0; j < this.tilesData[i].product.productImages.length; j++) {
          let product = this.tilesData[i].product.productImages[j];
          if (product.location.indexOf('data:') === -1 && product.location.indexOf('https:') === -1) {
            this.tilesData[i].product.productImages[j].location = environment.s3 + product.location;
          }
          if (product.location.indexOf('maxHeight') > -1) {
            this.tilesData[i].product.productImages[j].location = product.location.split(";")[0];
          }
        }
      }
    }
  }

  getMainImage() {
    for (var i = 0; i < this.tilesData.length; i++) {
      if (this.tilesData[i].product.productImages) {
        for (var j = 0; j < this.tilesData[i].product.productImages.length; j++) {
          let product = this.tilesData[i].product.productImages[j]
          if (product.mainImage == true) this.tilesData[i].product.mainImageSrc = product.location;
        }
      }
    }
  }

  async search(text, parentName, parentId) {
    if (text !== '' || text !== undefined) {
      text && parentName && parentId ? this.isSearchWithoutSuggestion = false : this.isSearchWithoutSuggestion = true;
      if (this.isSearchWithoutSuggestion) window.localStorage['searchedWithoutSuggestion'] = true;
      else localStorage.removeItem("searchedWithoutSuggestion");
      this.loaderSearch = true;
      this.tilesData = [];
      this.searchBar = text;
      this.isWithSpecialCharacter ? text = text.replace(/[^a-zA-Z0-9 ]/g, "") : text;
      text = text.replace(/ /g, "%20").replace(/&/g, "%26");
      if (parentName) parentName = parentName.replace(/&/g, "%26").replace(/ /g, "%20");
      var response = await this.searchProduct(text, parentName, this.esSizeCounter, this.esFromCounter);
      if (response.products.length > 0) {
        this.tilesData = response.products.map(p => new BrowseProductsModal(p));
        this.filterIamgeURL();
        this.getMainImage();
        this.esKey.next(this.tilesData);
        this.suggesstionList = [];
        window.localStorage['esKeyword'] = JSON.stringify({ text: text, parentName: parentName, parentId: parentId });
        this.route.navigateByUrl("/elastic-product");
        this.loaderSearch = false;
      }
      else {
        this.loaderSearch = false;
        this.searchBar = '';
        this.productNotFound = true;
      }
    }
  }

  searchSuggestion(text, parentName, parentId, e) {
    let regexCheck = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    this.isWithSpecialCharacter = false;
    if (regexCheck.test(text)) this.isWithSpecialCharacter = true;
    this.loader_suggestion = true;
    if (e.keyCode == 13) {
      this.loader_suggestion = false;
      let keyword = document.getElementsByClassName('activeList')[0];
      this.searchBar = text;
      this.search(this.searchBar, parentName, parentId);
      this.suggesstionList = [];
    }
    else {
      if (e.keyCode != 38 && e.keyCode != 40) this.arrowkeyLocation = 0
      if (text === '') {
        this.loader_suggestion = false;
        this.suggesstionList = [];
      }
      else {
        this.getProductSuggesstion(text).subscribe((res) => {
          if (res.length > 0) {
            this.suggesstionList = new Array<SuggestionList>();
            this.suggesstionList = res.map((item) => new SuggestionList(item.levelId, item.parentId, item.parentName, item.productLevelName, item.productLevelSuggestion, item.type));
            this.resetToDefault = this.suggesstionList.length;
            this.loader_suggestion = false;
          }
          else {
            this.loader_suggestion = false;
            this.suggesstionList = [];
          }
        }, (err) => {
          console.log(err)
        })
      }
    }
  }

  hideSuggesstionList() {
    setTimeout(() => {
      this.suggesstionList = [];
      this.arrowkeyLocation = 0;
    }, 200)
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

  goPrevPage() {
    this.location.back();
  }

  getBearerToken() {
    let token = window.localStorage['token'] != undefined ? JSON.parse(JSON.parse(window.localStorage['token']).value) : '';
    return token;
  }

  setHeaders() {
    let header = new Headers({
      Authorization: 'Bearer ' + this.getBearerToken()
    });

    return header;
  }

  setRefereshToken(token) {
    window.localStorage['rf_Token'] = token;
  }

  startTokenValidation() {
    if (window.localStorage['token'] != undefined) this.session = setInterval(() => this.callRefereshIfExpired(), 1000);
    else clearInterval(this.session);
  }

  clearTokenValidation() {
    clearInterval(this.session);
  }

  callRefereshIfExpired() {
    let loggedInTime = new Date(JSON.parse(JSON.parse(window.localStorage['token']).timestamp));
    let currentTime = new Date();
    if (currentTime > loggedInTime) {
      this.clearTokenValidation();
      let refereshToken = window.localStorage['rf_Token'];
      let basicAuth = new BasicAuth();
      let headers: Headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;',
        Authorization: `Basic ${basicAuth.encoded}`
      });
      const BASE_URL: string = `${environment.login}/${environment.apis.auth.token}?client_id=${basicAuth.client_id}&grant_type=refresh_token&refresh_token=${refereshToken}`;
      return this.http.post(BASE_URL, null, { headers: headers }).map((res) => res.json()).subscribe((res) => {
        this.refreshingSession = true;
        this.localStorageService.setItem('token', res.access_token, res.expires_in);
        this.setRefereshToken(res.refresh_token);
        this.startTokenValidation();
        setTimeout(() => this.refreshingSession = false, 3000);
      }, (err) => {
        this.refreshingSession = true;
        setTimeout(() => {
          this.refreshingSession = false;
          this.route.navigateByUrl("/logout");
        }, 3000);
      });
    }
  }

  disableNtFoundFlag() {
    this.productNotFound = false;
  }

}
