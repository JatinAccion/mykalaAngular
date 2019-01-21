import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MyOffersService } from '../../services/myOffer.service';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BrowseProductsModal } from '../../../../models/browse-products';
import { SearchDataModal } from '../../../../models/searchData.modal';
import { OfferInfo1, OfferInfo3 } from '../../../../models/steps.modal';

@Component({
  selector: 'app-myoffers',
  templateUrl: './myoffers.component.html',
  styleUrls: ['./myoffers.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyoffersComponent implements OnInit {
  userData: any;
  myOffersDetails = [];
  loader: boolean = false;
  startDate: {};
  s3: any;
  remainingTime = 'Time';
  getOffersData: any;
  getOffersDataAttr = [];

  constructor(
    public core: CoreService,
    private myOffer: MyOffersService,
    private route: Router,
    private routerOutlet: RouterOutlet
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.userData = JSON.parse(window.localStorage['userInfo']);
    localStorage.removeItem("offerIdForEdit");
    if (window.localStorage['getOffers'] != undefined) this.getOffersData = JSON.parse(window.localStorage['getOffers']);
    //this.getOffersDataFn() //Temperaroy based on the confirm result
    this.getOffers(); //Enable once get offers algorithm is implemented
    this.s3 = environment.s3;
  }

  getOffersDataFn() {
    for (var key in this.getOffersData.getOffersRequestDTO.attributes) {
      if (key == "Zipcode" || key == "DeliveryMethod") { }
      else {
        this.getOffersDataAttr.push({
          key: key,
          values: this.getOffersData.getOffersRequestDTO.attributes[key]
        })
      }
    }
    this.getOffersData.getOffersRequestDTO.attributes['getOffersDataAttr'] = [];
    this.getOffersData.getOffersRequestDTO.attributes['getOffersDataAttr'] = this.getOffersDataAttr;
    let objDate = new Date(this.getOffersData.getOffersRequestDTO.startDate), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
    this.getOffersData.getOffersRequestDTO.startDate = objDate.toLocaleString(locale, { month: "short" }) + ' ' + objDate.getDate() + ', ' + this.formatAMPM(objDate);
    this.calculateTimeLeft(this.getOffersData.getOffersRequestDTO);
  }

  getOffers() {
    this.loader = true;
    let userId = this.userData.userId
    this.myOffer.loadOffers(userId).subscribe((res) => {
      this.loader = false;
      let filteredRes = [];
      for (var i = 0; i < res.length; i++) {
        if (res[i].getOffersResponse.length > 0) filteredRes.push(res[i])
      }
      res = filteredRes;
      this.myOffersDetails = res;
      this.filterIamgeURL(res);
      this.getMainImage(res);
      this.refineAttributes();
      for (var i = 0; i < this.myOffersDetails.length; i++) {
        this.myOffersDetails[i].getOffersRequestDTO.startDate = this.myOffersDetails[i].getOffersRequestDTO.startDate.split("+")[0];
        this.myOffersDetails[i].getOffersRequestDTO.endDate = this.myOffersDetails[i].getOffersRequestDTO.endDate.split("+")[0];
        let objDate = new Date(this.myOffersDetails[i].getOffersRequestDTO.startDate), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
        this.myOffersDetails[i].getOffersRequestDTO.startDate = objDate.toLocaleString(locale, { month: "short" }) + ' ' + objDate.getDate() + ', ' + this.formatAMPM(objDate);
        this.calculateTimeLeft(this.myOffersDetails[i].getOffersRequestDTO);
      }
      this.myOffersDetails.sort(function (a, b) {
        var nameA = a.startDate, nameB = b.startDate
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      });
    });
  }

  filterIamgeURL(res) {
    for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < res[i].getOffersResponse.length; j++) {
        if (res[i].getOffersResponse[j].product.productImages) {
          for (var k = 0; k < res[i].getOffersResponse[j].product.productImages.length; k++) {
            let product = res[i].getOffersResponse[j].product.productImages[k];
            if (product.location.indexOf('data:') === -1 && product.location.indexOf('https:') === -1) {
              res[i].getOffersResponse[j].product.productImages[k].location = this.s3 + product.location;
            }
            if (product.location.indexOf('maxHeight') > -1) {
              res[i].getOffersResponse[j].product.productImages[k].location = product.location.split(";")[0];
            }
          }
        }
      }
    }
  }

  getMainImage(res) {
    for (var i = 0; i < res.length; i++) {
      for (var j = 0; j < res[i].getOffersResponse.length; j++) {
        if (res[i].getOffersResponse[j].product.productImages) {
          for (var k = 0; k < res[i].getOffersResponse[j].product.productImages.length; k++) {
            let product = res[i].getOffersResponse[j].product.productImages[k]
            if (product.mainImage == true) res[i].getOffersResponse[j].product.mainImageSrc = product.location
          }
        }
      }
    }
  }

  refineAttributes() {
    for (var i = 0; i < this.myOffersDetails.length; i++) {
      this.getOffersDataAttr = [];
      if (this.myOffersDetails[i].getOffersRequestDTO.attributes != null) {
        for (var key in this.myOffersDetails[i].getOffersRequestDTO.attributes) {
          if (key == "Zipcode" || key == "DeliveryMethod") { }
          else {
            this.getOffersDataAttr.push({
              key: key,
              values: this.myOffersDetails[i].getOffersRequestDTO.attributes[key]
            })
          }
        }
        this.myOffersDetails[i].getOffersRequestDTO.attributes = this.getOffersDataAttr;
      }
    }
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  calculateTimeLeft(Obj) {
    var deadline = new Date(Obj.endDate).getTime();
    var x = setInterval(function () {
      var now = new Date().getTime();
      var t = deadline - now;
      var days = Math.floor(t / (1000 * 60 * 60 * 24));
      var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((t % (1000 * 60)) / 1000);
      if (t < 0) {
        clearInterval(x);
        Obj.remainingTime = "EXPIRED";
      }
      else Obj.remainingTime = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }, 1000);
  }

  editOffer(offer) {
    window.localStorage['offerIdForEdit'] = offer.offerID;
    setTimeout(() => {
      if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
      /** LevelSelection Storage Creation and Step1 Request for Preselected Data */
      let place = [], category = [], subcategory = [], levelSelection;
      place = new Array<SearchDataModal>();
      category = new Array<SearchDataModal>();
      place.push(new SearchDataModal(offer.getOffersRequestDTO.placeId, offer.getOffersRequestDTO.placeName, offer.getOffersRequestDTO.placeName, "1", "", "", "", false, true));
      category.push(new SearchDataModal(offer.getOffersRequestDTO.categoryId, offer.getOffersRequestDTO.categoryName, offer.getOffersRequestDTO.categoryName, "2", "", "", "", false, true));
      subcategory.push(new SearchDataModal(offer.getOffersRequestDTO.subCategoryId, offer.getOffersRequestDTO.subCategoryName, offer.getOffersRequestDTO.subCategoryName, "3", "", "", "", false, true));
      if (window.localStorage['levelSelections'] == undefined) levelSelection = new Object();
      else levelSelection = JSON.parse(window.localStorage['levelSelections']);
      levelSelection.place = place[0];
      levelSelection.category = category[0];
      levelSelection.subcategory = subcategory[0];
      levelSelection.subType = {};
      levelSelection.type = [];
      window.localStorage['levelSelections'] = JSON.stringify(levelSelection);

      let step1Data = new Array<OfferInfo1>();
      step1Data.push(new OfferInfo1(levelSelection.place, levelSelection.category, levelSelection.subcategory, levelSelection.type, false, levelSelection.place.id, levelSelection.category.id, levelSelection.subcategory.id));
      window.localStorage['GetOfferStep_1'] = JSON.stringify(step1Data);
      /** LevelSelection Storage Creation and Step1 Request for Preselected Data */

      /** Creating Get Offer Step 3 Data */
      let step3Data = new Array<OfferInfo3>();
      step3Data.push(new OfferInfo3(offer.getOffersRequestDTO.price, offer.getOffersRequestDTO.deliveryMethod, offer.getOffersRequestDTO.instruction, offer.getOffersRequestDTO.deliveryLocation));
      window.localStorage['GetOfferStep_3'] = JSON.stringify(step3Data);
      /** Creating Get Offer Step 3 Data */
      this.route.navigate(['/getoffer', 'step1']);
    }, 1000);
  }

  endOffer(offer) {
    this.myOffer.endOffer(offer.offerID).subscribe((res) => {
      this.getOffers();
    })
  }

  viewOfferDetails(product, offerID) {
    product.product.kalaPrice = product.offerPrice;
    let selectedProduct = new BrowseProductsModal(product.product);
    window.localStorage['selectedProduct'] = JSON.stringify({ selectedProduct: selectedProduct, offerId: offerID });
    this.route.navigateByUrl("/view-offer")
  }

}
