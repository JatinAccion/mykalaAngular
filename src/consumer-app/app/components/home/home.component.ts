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
    this.core.searchMsgToggle();
    setTimeout(function () {
      var header = document.getElementsByClassName("header_sub")[0];
      var searchBox = document.getElementsByClassName("searchBox")[0];
      var logoContainer = document.getElementsByClassName("logo")[0];
      searchBox.classList.add("invisible");
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
    localStorage.removeItem('GetOfferStep_2Request');
    localStorage.removeItem('GetOfferPrice');
    localStorage.removeItem("getOffers");
    localStorage.removeItem('fromES');
    localStorage.removeItem('esKeyword');
    localStorage.removeItem("offerIdForEdit");
    this.core.hide();
    this.core.pageLabel();
    /*Product Availability*/
    this.productAvailabilityModal = { levelName: null, levelId: null, levelCount: this.selectionLevel };
    this.availableProducts = await this.homeService.checkProductAvailability(this.productAvailabilityModal);
    this.availableProducts = this.availableProducts.filter(item => item.level = this.selectionLevel);
    /*Product Availability*/
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

  async checkProductAvailability() {
    this.availableProducts = await this.homeService.checkProductAvailability(this.productAvailabilityModal);
    this.availableProducts = this.availableProducts.filter(item => item.level = this.selectionLevel);
  }

  getPlace() {
    this.loader = true;
    this.homeService.getTilesPlace().subscribe(res => {
      this.loader = false;
      for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].placeId, res[i].placeName, res[i].placeName, "1", `${this.s3}${this.placeImageUrl}${res[i].placeName}.png`, `${this.s3}${this.placeIconsUrl}${res[i].placeName}.png`));
      this.modifySearchData();
      let carosal = document.getElementsByClassName('carousel-item');
      carosal[0].classList.add("active");
      carosal[1].classList.remove("active");
      this.carousalItems = this.searchData;
      this.tiles = this.searchData;
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
      this.productAvailabilityModal = { levelName: tile.name, levelId: tile.id, levelCount: this.selectionLevel };
      this.checkProductAvailability();
      this.homeService.getTilesCategory(tile.id).subscribe((res) => {
        this.loader = false;
        for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2", `${this.s3}${this.categoryImageUrl}${tile.name}/${res[i].categoryName}.jpg`));
        this.modifySearchData();
        this.tiles = this.searchData;
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
      this.productAvailabilityModal = { levelName: null, levelId: null, levelCount: this.selectionLevel };
      this.checkProductAvailability();
      this.getPlace();
    }
  }
}
