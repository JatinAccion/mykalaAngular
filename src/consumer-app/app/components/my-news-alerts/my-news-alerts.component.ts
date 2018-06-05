import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MyAlertsService } from '../../services/MyNewsAlertsService';

@Component({
  selector: 'app-my-news-alerts',
  templateUrl: './my-news-alerts.component.html',
  styleUrls: ['./my-news-alerts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyNewsAlertsComponent implements OnInit {
  userData: any;
  s3: any;
  loader: boolean = false;
  offers: Array<any>;
  reviews: Array<any>;
  orders: Array<any>;
  postReviewAlert: Array<any>;
  showMorePageCounter = 0;
  showMoreSizeCounter = 5;
  hideShowMoreBtn: boolean = true

  constructor(
    public core: CoreService,
    private myalerts: MyAlertsService,
    private route: Router,
    private routerOutlet: RouterOutlet
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.userData = JSON.parse(window.localStorage['userInfo']);
    this.s3 = environment.s3;
    this.loadOffers();
  }

  loadOffers() {
    this.loader = true;
    this.myalerts.loadOffers(this.userData.emailId).subscribe((res) => {
      this.loader = false;
      this.offers = res;
      this.filterImageURL();
      this.getMainImage();
      this.sort(this.offers, 'offer')
      this.myalerts.loadOrders(this.userData.userId).subscribe((res) => {
        this.orders = res;
        this.formatImages(this.orders, 'order');
        this.myalerts.loadReviews(this.userData.emailId).subscribe((res) => {
          this.reviews = res;
          this.formatImages(this.reviews, 'review');
          this.sort(this.offers, 'review')
          this.myalerts.loadPostReviewAlert(this.userData.userId, this.showMorePageCounter, this.showMoreSizeCounter).subscribe((res) => {
            if (res.length > 0) {
              this.hideShowMoreBtn = false;
              this.postReviewAlert = res;
              this.formatImages(this.postReviewAlert, 'postReview');
              this.sort(this.postReviewAlert, 'postReview')
            }
            else this.hideShowMoreBtn = true;
          }, (err) => {
            console.log("Post Reviews::::", err);
          })
        }, (err) => {
          console.log("Reviews::::", err)
        })
      }, (err) => {
        console.log("Orders::::", err)
      })
    }, (err) => {
      console.log("Offers::::", err)
    })
  }

  filterImageURL() {
    for (var i = 0; i < this.offers.length; i++) {
      for (var j = 0; j < this.offers[i].getOffersResponse.length; j++) {
        for (var k = 0; k < this.offers[i].getOffersResponse[j].product.productImages.length; k++) {
          let product = this.offers[i].getOffersResponse[j].product.productImages[k];
          if (product.location.indexOf('data:') === -1 && product.location.indexOf('https:') === -1) {
            this.offers[i].getOffersResponse[j].product.productImages[k].location = this.s3 + product.location;
          }
          if (product.location.indexOf('maxHeight') > -1) {
            this.offers[i].getOffersResponse[j].product.productImages[k].location = product.location.split(";")[0];
          }
        }
      }
    }
  }

  getMainImage() {
    for (var i = 0; i < this.offers.length; i++) {
      for (var j = 0; j < this.offers[i].getOffersResponse.length; j++) {
        for (var k = 0; k < this.offers[i].getOffersResponse[j].product.productImages.length; k++) {
          let product = this.offers[i].getOffersResponse[j].product.productImages[k]
          if (product.mainImage == true) {
            this.offers[i].getOffersResponse[j].product.mainImageSrc = product.location
          }
        }
      }
    }
  }

  sort(data, from) {
    if (from == 'offer') {
      this.offers.sort(function (a, b) {
        var dateA = a.endDate, dateB = b.endDate
        if (dateA < dateB)
          return 1
        if (dateA > dateB)
          return -1
        return 0
      });
    }
    else if (from == 'review') {
      data.sort(function (a, b) {
        var dateA = a.reviewDate, dateB = b.reviewDate
        if (dateA < dateB)
          return 1
        if (dateA > dateB)
          return -1
        return 0
      });
    }
    else {
      data.sort(function (a, b) {
        var dateA = a.purchaseDate, dateB = b.purchaseDate
        if (dateA < dateB)
          return 1
        if (dateA > dateB)
          return -1
        return 0
      });
    }
  }

  formatImages(data, from) {
    if (from == 'order') {
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].orderItems.length; j++) {
          let image = data[i].orderItems[j].productImage;
          if (image.indexOf('maxHeight') > -1) {
            data[i].orderItems[j].productImage = image.split(";")[0]
          }
        }
      }
    }
    else if (from == 'review') {
      for (var i = 0; i < data.length; i++) {
        if (data[i].productImage) {
          let image = data[i].productImage;
          if (image.indexOf('data:') === -1 && image.indexOf('https:') === -1) {
            data[i].productImage = this.s3 + image;
          }
          if (image.indexOf('maxHeight') > -1) {
            data[i].productImage = image.split(";")[0]
          }
        }
      }
    }
    else {
      for (var i = 0; i < data.length; i++) {
        let image = data[i].orderItems.productImage;
        if (image.indexOf('maxHeight') > -1) {
          data[i].orderItems.productImage = image.split(";")[0]
        }
      }
    }
  }

  loadMore() {
    let userId = this.userData.userId;
    this.showMorePageCounter = this.showMorePageCounter + 1;
    this.showMoreSizeCounter = this.showMoreSizeCounter;
    this.myalerts.loadPostReviewAlert(this.userData.userId, this.showMorePageCounter, this.showMoreSizeCounter).subscribe((res) => {
      if (res.length > 0) {
        this.hideShowMoreBtn = false;
        this.postReviewAlert = [...this.postReviewAlert, ...res];
        this.formatImages(this.postReviewAlert, 'postReview');
        this.sort(this.postReviewAlert, 'postReview')
      }
      else this.hideShowMoreBtn = true;
    }, (err) => {
      console.log("Post Reviews::::", err);
    })
  }

  getTotaPrice(priceWithQuantity, productTaxCost, shippingCost) {
    return eval(`${priceWithQuantity + productTaxCost + shippingCost}`);
  }

  goToPage(data, from) {
    //Offers
    if (from == 'offer') {
      this.myalerts.updateOffer(data.offerID).subscribe((res) => {
        this.route.navigateByUrl('/myoffer');
      }, (err) => {
        console.log(err)
      })
    }
    //Reviews
    else if (from == 'review') {
      this.myalerts.updateReview(data.consumerReviewId).subscribe((res) => {
        console.log(res)
      }, (err) => {
        console.log(err)
      })
    }
    else {
      let modal = { purchasedDate: data.purchasedDate, orderId: data._id };
      window.localStorage['forReview'] = JSON.stringify({ modal: modal, order: data.orderItems, from: 'NA' });
      this.route.navigateByUrl("/leave-review");
    }
  }

  loopNumber(number, from) {
    if (from == 'offers') return Array(number).fill(number)
    else return Array(parseFloat(number)).fill(parseFloat(number))
  }

  getFullDate(date) {
    let objDate = new Date(date), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
    return objDate.toLocaleString(locale, { month: "long" }) + ' ' + objDate.getDate() + ', ' + this.formatAMPM(objDate);
  }

  getDeliveryDate(deliveryMethod, purchaseDate) {
    let weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    // Express: 3 to 5 business days Delivery
    if (deliveryMethod == 'Express: 3 to 5 business days') {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 120 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
    // 2 day: 2 business day shipping days Delivery
    else if (deliveryMethod == '2 day: 2 business day shipping') {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 48 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
    // Standard: 5 to 8 business days Delivery
    else if (deliveryMethod == 'Standard: 5 to 8 business days') {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 192 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
    // Next day: 1 business day shipping
    else {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 24 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
  }

  formatAMPM(date) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  trackOrder(modal, order) {
    this.myalerts.trackOrder('SHIPPO_TRANSIT').subscribe((res) => {
      window.localStorage['productForTracking'] = JSON.stringify({ modal: modal, order: order, goShippoRes: res });
      this.route.navigateByUrl("/trackOrder");
    }, (err) => {
      console.log(err);
    })
  }

}
