import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { User, UserProfile } from '../../../models/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import animateScrollTo from 'animated-scroll-to';
import { Subject } from 'rxjs/Subject';
import { BrowseProductsModal } from '../../../models/browse-products';
import { MyCartService } from './mycart.service';

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

  navigateSL(event: KeyboardEvent) {
    setTimeout(() => {
      switch (event.keyCode) {
        case 38: // this is the ascii of arrow up
          this.arrowkeyLocation--;
          if (this.arrowkeyLocation == -1) this.arrowkeyLocation = this.resetToDefault - 1;
          break;
        case 40: // this is the ascii of arrow down
          this.arrowkeyLocation++;
          if (this.arrowkeyLocation > this.resetToDefault - 1) this.arrowkeyLocation = 0
          break;
      }
    })
  }

  constructor(
    private http: Http,
    private route: Router,
    private modalService: NgbModal,
    private mycart: MyCartService
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

  searchProduct(text) {
    const url: string = `${environment.productList}/${environment.apis.products.search}=${text}`;
    return this.http.get(url).map((res) => res.json());
  }

  getProductSuggesstion(text) {
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

  loadProducts(text) {
    this.tilesData = [];
    this.searchProduct(text).subscribe(res => {
      this.tilesData = res.products.map(p => new BrowseProductsModal(p));
      this.filterIamgeURL();
      this.getMainImage();
      this.esKey.next(this.tilesData);
      this.suggesstionList = [];
    });
  }

  search(text, from?: string) {
    if (text !== '' || text !== undefined) {
      if (from == 'explore' && this.suggesstionList.length > 0) {
        let keyword = document.getElementsByClassName('activeList')[0];
        text = keyword.innerHTML;
      }
      this.searchBar = text;
      localStorage.removeItem('esKeyword');
      this.route.navigateByUrl("/elastic-product");
      this.loadProducts(text);
    }
  }

  searchSuggestion(text, e) {
    //this.suggesstionList = [];
    //If Enter is Pressed
    if (e.keyCode == 13) {
      let keyword = document.getElementsByClassName('activeList')[0];
      this.searchBar = keyword.innerHTML;
      this.search(keyword.innerHTML);
      this.suggesstionList = [];
    }
    //Else
    else {
      if (e.keyCode != 38 && e.keyCode != 40) this.arrowkeyLocation = 0;
      if (text === '') this.suggesstionList = [];
      // else {
      //   this.searchBar = text;
      //   this.suggesstionList = this.states.filter(v => v.toLowerCase().indexOf(text.toLowerCase()) > -1).slice(0, 10)
      //   this.resetToDefault = this.suggesstionList.length;
      // }
      else {
        this.getProductSuggesstion(text).subscribe((res) => {
          if (res.length > 0) {
            this.suggesstionList = res;
            this.resetToDefault = this.suggesstionList.length;
          }
          else this.suggesstionList = [];
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

  getItemsInCart(userId) {
    this.mycart.getCartItems(userId).subscribe((res) => {
      let cartItems = [];
      let wishListItems = []
      for (var i = 0; i < res.length; i++) {
        let items = res[i];
        if (items.label == 'cart') {
          cartItems.push(res[i]);
          window.localStorage['existingItemsInCart'] = JSON.stringify(cartItems);
        }
        else {
          wishListItems.push(res[i]);
          window.localStorage['existingItemsInWishList'] = JSON.stringify(wishListItems);
        }
      }
    }, (err) => {
      console.log('Failed to load cart items')
    })
  }

}
