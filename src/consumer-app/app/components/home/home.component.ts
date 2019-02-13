import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, HostListener } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { CoreService } from '../../services/core.service';
import { SearchDataModal } from '../../../../models/searchData.modal';
import { Router, RouterOutlet } from '@angular/router';
import animateScrollTo from 'animated-scroll-to';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  loader: boolean;
  tiles: any;
  emailKala: boolean = false;
  contactKala: boolean = false;
  carousalItems = [];
  searchData = [];
  s3 = environment.s3;
  placeIconsUrl: string = "mykala-dev-images/product/Places/icon_";
  placeImageUrl: string = "mykala-dev-images/product/Places/";
  categoryImageUrl: string = "mykala-dev-images/product/Places/";
  userResponse = { place: [], type: [], category: [], subcategory: [], subType: {} };
  response: any;
  breadCrums = [];
  customers: any = [];
  productAvailabilityModal = {};
  availableProducts = [];
  selectionLevel: number = 1;
  constructor(private routerOutlet: RouterOutlet, private router: Router, private homeService: HomeService, public core: CoreService) { }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    var header = document.getElementsByClassName("header_sub")[0];
    var searchBox = document.getElementsByClassName("searchBox")[0];
    var logoContainer = document.getElementsByClassName("logo")[0];
    if (window.pageYOffset > 600) {
      header.classList.add("header_Scroll");
      searchBox.classList.remove("invisible");
      logoContainer.classList.remove("d-none");
      logoContainer.nextElementSibling.classList.add("d-none");
    }
    else {
      searchBox.classList.add("invisible");
      header.classList.remove("header_Scroll");
      logoContainer.classList.add("d-none");
      logoContainer.nextElementSibling.classList.remove("d-none");
    }
  }

  async ngOnInit() {
    this.core.hideSearchField = true;
    this.core.searchMsgToggle();
    setTimeout(function () {
      var header = document.getElementsByClassName("header_sub")[0];
      var searchBox = document.getElementsByClassName("searchBox")[0];
      var logoContainer = document.getElementsByClassName("logo")[0];
      searchBox !=undefined? searchBox.classList.add("invisible"):{};
      if (header.classList.contains("header_Scroll")) header.classList.remove("header_Scroll");
      if (!logoContainer.classList.contains("d-none")) {
        logoContainer.classList.add("d-none");
        logoContainer.nextElementSibling.classList.remove("d-none");
      }
    }, 100);
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    localStorage.removeItem('GetOfferStep_1');
    localStorage.removeItem('GetOfferStep_2');
    localStorage.removeItem('GetOfferStep_3');
    localStorage.removeItem('GetOfferStep_4');
    localStorage.removeItem('changeBackFn');
    localStorage.removeItem('GetOfferStep_2Request');
    localStorage.removeItem('GetOfferPrice');
    localStorage.removeItem("getOffers");
    localStorage.removeItem('fromES');
    localStorage.removeItem('esKeyword');
    localStorage.removeItem("offerIdForEdit");
    this.core.hide();
    this.core.pageLabel();
    this.getPlace();
  }

  prevSlide() {
    var carosal = document.getElementsByClassName('carousel-item');
    carosal[1].setAttribute("class", "carousel-item")
    carosal[0].setAttribute("class", "carousel-item active");
  }

  nextSlide() {
    var carosal = document.getElementsByClassName('carousel-item');
    carosal[0].setAttribute("class", "carousel-item");
    carosal[1].setAttribute("class", "carousel-item active");
  }

  emailKalaBtn() {
    this.contactKala = false;
    this.emailKala = true;
  }

  contactKalaBtn() {
    this.emailKala = false;
    this.contactKala = true;
  }

  getPlace() {
    this.loader = true;
    this.homeService.getTilesPlace().subscribe(res => {
      this.loader = false;
      for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].placeId, res[i].placeName, res[i].placeName, "1", `${this.s3}${this.placeImageUrl}${res[i].placeName}.png`, `${this.s3}${this.placeIconsUrl}${res[i].placeName}.png`));
      let carosal = document.getElementsByClassName('carousel-item');
      carosal[0].classList.add("active");
      carosal[1].classList.remove("active");
      this.carousalItems = this.searchData;
      this.tiles = this.searchData;
      this.searchData.forEach((item) => {
        if (item.name == 'Home & Garden') item.orderNo = 1;
        else if (item.name == 'Pets') item.orderNo = 2;
        else if (item.name == 'Sports & Fitness') item.orderNo = 3;
        else if (item.name == 'Electronics') item.orderNo = 4;
        else if (item.name == 'Travel') item.orderNo = 5;
        else if (item.name == 'Kids') item.orderNo = 6;
        else if (item.name == 'Health & Beauty') item.orderNo = 7;
        else if (item.name == 'Fashion & Apparel') item.orderNo = 8;
        else if (item.name == 'Tools & Hardware') item.orderNo = 9;
        else item.orderNo = 10;
      });
      this.searchData.sort((a, b) => a.orderNo - b.orderNo);
      /*Product Availability*/
      this.productAvailabilityModal = { levelName: null, levelId: null, levelCount: this.selectionLevel };
      this.homeService.productAvailability(this.productAvailabilityModal).subscribe((res) => {
        this.availableProducts = res.filter(item => item.level = this.selectionLevel);
        this.modifySearchData();
      }, (err) => {
        console.log("Error From Product Availability");
      });
      /*Product Availability*/
    });
  }

  modifySearchData() {
    let getLevelBasedData = this.availableProducts.filter(item => item.level == this.selectionLevel);
    for (let i = 0; i < getLevelBasedData.length; i++) {
      for (let j = 0; j < this.searchData.length; j++) {
        if (getLevelBasedData[i].name == this.searchData[j].name && getLevelBasedData[i].level === parseInt(this.searchData[j].level)) {
          this.searchData[j].isProductAvailable = true;
          break;
        }
      }
    }
  }

  animateToTiles() {
    var scroll = document.querySelector('.homegarden') as HTMLElement
    animateScrollTo(scroll);
    this.breadCrums = [];
  }

  tileSelected(tile, IsBc) {
    if (tile.hasOwnProperty("tile") == true) var tile = tile['tile'];
    else var tile = tile;
    if (tile == undefined) this.breadCrums = [];
    for (var i = 0; i < this.breadCrums.length; i++) {
      let bc = this.breadCrums[i];
      if (bc.id == tile.id) this.breadCrums.splice(i + 1, 1);
    }
    if (IsBc == undefined) this.breadCrums.push(tile);
    this.searchData = [];

    //Get Category
    if (tile && tile.level == "1") {
      this.selectionLevel = 2;
      this.loader = true;
      this.userResponse.place = tile;
      this.homeService.getTilesCategory(tile.id).subscribe((res) => {
        this.loader = false;
        for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2", `${this.s3}${this.categoryImageUrl}${tile.name}/${res[i].categoryName}.jpg`));
        this.tiles = this.searchData;
        /*Product Availability*/
        this.productAvailabilityModal = { levelName: tile.name, levelId: tile.id, levelCount: this.selectionLevel };
        this.homeService.productAvailability(this.productAvailabilityModal).subscribe((res) => {
          this.availableProducts = res.filter(item => item.level = this.selectionLevel);
          this.modifySearchData();
        }, (err) => {
          console.log("Error From Product Availability");
        });
        /*Product Availability*/
      });
    }
    //Get Sub Category
    else if (tile && tile.level == "2") {
      this.userResponse.category = tile;
      window.localStorage['levelSelections'] = JSON.stringify(this.userResponse);
      if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
      this.router.navigateByUrl('/browse-product');
    }
    //Get Type
    else if (tile && tile.level == "3") {
      this.userResponse.subcategory = tile;
      window.localStorage['levelSelections'] = JSON.stringify(this.userResponse);
      if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
      this.router.navigateByUrl('/browse-product');
    }
    //Get Place
    else {
      this.selectionLevel = 1;
      this.getPlace();
    }
  }
}
