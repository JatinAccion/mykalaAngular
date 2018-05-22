import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MyOffersService } from '../../services/myOffer.service';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BrowseProductsModal } from '../../../../models/browse-products';

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
    let emailId = this.userData.emailId
    this.myOffer.loadOffers(emailId).subscribe((res) => {
      this.loader = false;
      this.myOffersDetails = res;
      this.filterIamgeURL(res);
      this.getMainImage(res);
      this.refineAttributes();
      for (var i = 0; i < this.myOffersDetails.length; i++) {
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
    for (var i = 0; i < res[i].length; i++) {
      for (var j = 0; j < res[i].getOffersResponse.length; j++) {
        if (res[i].getOffersResponse[j].product.productImages) {
          for (var k = 0; j < res[i].getOffersResponse[j].product.productImages.length; k++) {
            let product = res[i].getOffersResponse[j].product.productImages[k];
            if (product.location.indexOf('data:') === -1 && product.location.indexOf('https:') === -1) {
              res[i].getOffersResponse[j].product.productImages[k].location = this.s3 + product.location;
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
      this.route.navigate(['/getoffer', 'step1']);
    }, 1000);
  }

  endOffer(offer) {
    this.myOffer.endOffer(offer.offerID).subscribe((res) => {
      this.getOffers();
    })
  }

  viewOfferDetails(product) {
    product.product.kalaPrice = product.offerPrice;
    let selectedProduct = new BrowseProductsModal(product.product)
    window.localStorage['selectedProduct'] = JSON.stringify(selectedProduct);
    this.route.navigateByUrl("/view-offer")
  }

}
