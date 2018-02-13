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
  placeIcons = [
    "/consumer-app/assets/images/icon_home.png",
    "/consumer-app/assets/images/icon_fashon.png",
    "/consumer-app/assets/images/icon_electronic.png",
    "/consumer-app/assets/images/icon_HealthBeauty.png",
    "/consumer-app/assets/images/icon_kids.png",
    "/consumer-app/assets/images/icon_travel.png",
    "/consumer-app/assets/images/icon_pets.png",
    "/consumer-app/assets/images/icon_auto.png",
    "/consumer-app/assets/images/icon_fitness.png",
    "/consumer-app/assets/images/icon_ToolsHardware.png"
  ];
  tempArr = [
    "/consumer-app/assets/images/banner_home.png",
    "/consumer-app/assets/images/banner_fashion.png",
    "/consumer-app/assets/images/banner_electronic.png",
    "/consumer-app/assets/images/banner_health.png",
    "/consumer-app/assets/images/banner_kids.png",
    "/consumer-app/assets/images/banner_travel.png",
    "/consumer-app/assets/images/banner_pets.png",
    "/consumer-app/assets/images/banner_auto.png",
    "/consumer-app/assets/images/banner_fitness.png",
    "/consumer-app/assets/images/banner_tools.png"
  ];
  tempArrCategory = [
    "mykala-dev-images/product/Accents+and+Decor.jpg",
    "mykala-dev-images/product/Appliances.jpg",
    "mykala-dev-images/product/Bathroom.jpg",
    "mykala-dev-images/product/Bedding+and+Linens.jpg",
    "mykala-dev-images/product/Furniture+and+Patio.jpg",
    "mykala-dev-images/product/Garage.jpg",
    "mykala-dev-images/product/Kitchen+and+Dining.jpg",
    "mykala-dev-images/product/Lawn+and+Garden.jpg",
    "mykala-dev-images/product/Lighting.jpg",
    "mykala-dev-images/product/Pest+Control.jpg",
    "mykala-dev-images/product/Pool+and+Spa.jpg",
    "mykala-dev-images/product/Safety+and+Security.jpg",
    "mykala-dev-images/product/Supplies.jpg",
  ];

  userResponse = { place: [], type: [], category: [], subcategory: [], subType: {} };
  response: any;
  breadCrums = [];
  customers: any = [];
  constructor(private routerOutlet: RouterOutlet, private router: Router, private homeService: HomeService, private core: CoreService) { }

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

  ngOnInit() {
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
    localStorage.removeItem("getOffers");
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

  //Get All Places
  getPlace() {
    this.loader = true;
    this.homeService.getTilesPlace().subscribe(res => {
      this.loader = false;
      for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].placeId, res[i].placeName, res[i].placeName, "1", ""));
      //Temporary for Image
      for (var i = 0; i < this.tempArr.length && this.placeIcons.length; i++) {
        this.searchData[i].imgUrl = this.tempArr[i];
        this.searchData[i].iconUrl = this.placeIcons[i]
      }
      let carosal = document.getElementsByClassName('carousel-item');
      carosal[0].setAttribute("class", "carousel-item active");
      this.carousalItems = this.searchData;
      //Temporary for Image
      this.tiles = this.searchData;
    });
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
      this.loader = true;
      this.userResponse.place = tile;
      this.homeService.getTilesCategory(tile.id).subscribe((res) => {
        this.loader = false;
        for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].categoryId, res[i].categoryName, res[i].categoryName, "2", ""));
        //Temporary for Image
        if (res[0].placeName === "Home & Garden") {
          for (var i = 0; i < this.tempArrCategory.length; i++) {
            this.searchData[i].imgUrl = environment.s3.concat(this.tempArrCategory[i]);
          }
        }
        else {
          for (var i = 0; i < this.searchData.length; i++) {
            this.searchData[i].imgUrl = '/consumer-app/assets/images/banner_home.png';
          }
        }
        //Temporary for Image
        this.tiles = this.searchData;
      });
    }
    //Get Sub Category
    else if (tile && tile.level == "2") {
      this.loader = true;
      this.userResponse.category = tile;
      this.homeService.getTilesSubCategory(tile.id).subscribe((res) => {
        this.loader = false;
        for (var i = 0; i < res.length; i++) this.searchData.push(new SearchDataModal(res[i].subCategoryId, res[i].subCategoryName, res[i].subCategoryName, "3", ""));
        //Temporary for Image
        for (var i = 0; i < this.searchData.length; i++) {
          this.searchData[i].imgUrl = "/consumer-app/assets/images/banner_home.png";
        }
        //Temporary for Image
        this.tiles = this.searchData;
      });
    }
    //Get Type
    else if (tile && tile.level == "3") {
      this.userResponse.subcategory = tile;
      window.localStorage['levelSelections'] = JSON.stringify(this.userResponse);
      if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
      this.router.navigateByUrl('/browse-product');
    }
    //Get Place
    else this.getPlace();
  }
}
