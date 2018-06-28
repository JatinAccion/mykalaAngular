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
  loader_offer: boolean = false;
  loader_order: boolean = false;
  loader_review: boolean = false;
  loader_postReview: boolean = false;
  offers: Array<any>;
  reviews: Array<any>;
  orders: Array<any>;
  postReviewAlert: Array<any>;
  offer_showMorePageCounter = 0;
  offer_showMoreSizeCounter = 5;
  orderShipped_showMorePageCounter = 0;
  orderShipped_showMoreSizeCounter = 5;
  reviewedProduct_showMorePageCounter = 0;
  reviewedProduct_showMoreSizeCounter = 5;
  postReview_showMorePageCounter = 0;
  postReview_showMoreSizeCounter = 5;
  showMoreBtn_offer: boolean = false;
  showMoreBtn_orderShipped: boolean = false;
  showMoreBtn_reviewedProduct: boolean = false;
  showMoreBtn_postReview: boolean = false;

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
    this.myalerts.loadOffers(this.userData.userId, this.offer_showMorePageCounter, this.offer_showMoreSizeCounter).subscribe((res) => {
      this.offers = res.content;
      this.filterImageURL();
      this.getMainImage();
      this.sort(this.offers, 'offer');
      this.showHideShowMoreBtn(this.offers, res, 'offer');
      console.log("offer response::::::", res);
      this.myalerts.loadOrders(this.userData.userId, this.orderShipped_showMorePageCounter, this.orderShipped_showMoreSizeCounter).subscribe((res) => {
        this.orders = res.content;
        for (var i = 0; i < this.orders.length; i++) this.orders[i].orderItems = [this.orders[i].orderItems];
        this.formatImages(this.orders, 'order');
        this.showHideShowMoreBtn(this.orders, res, 'order');
        console.log("order response::::::", res);
        this.myalerts.loadReviews(this.userData.userId, this.reviewedProduct_showMorePageCounter, this.reviewedProduct_showMoreSizeCounter).subscribe((res) => {
          this.reviews = res.content;
          this.formatImages(this.reviews, 'review');
          this.sort(this.offers, 'review');
          this.showHideShowMoreBtn(this.reviews, res, 'review');
          console.log("review response::::::", res);
          this.myalerts.loadPostReviewAlert(this.userData.userId, this.postReview_showMorePageCounter, this.postReview_showMoreSizeCounter).subscribe((res) => {
            this.loader = false;
            this.postReviewAlert = res.content;
            this.formatImages(this.postReviewAlert, 'postReview');
            this.sort(this.postReviewAlert, 'postReview');
            this.showHideShowMoreBtn(this.postReviewAlert, res, 'postReview');
            console.log("postReview response::::::", res)
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

  showHideShowMoreBtn(data, res, from) {
    if (from == 'offer') {
      data.length >= res.totalElements ? this.showMoreBtn_offer = false : this.showMoreBtn_offer = true;
    }
    else if (from == 'order') {
      data.length >= res.totalElements ? this.showMoreBtn_orderShipped = false : this.showMoreBtn_orderShipped = true;
    }
    else if (from == 'review') {
      data.length >= res.totalElements ? this.showMoreBtn_reviewedProduct = false : this.showMoreBtn_reviewedProduct = true;
    }
    else {
      data.length >= res.totalElements ? this.showMoreBtn_postReview = false : this.showMoreBtn_postReview = true;
    }
  }

  loadMore(from) {
    let userId = this.userData.userId;
    /*From Offers Block*/
    if (from == 'offer') {
      this.loader_offer = true;
      this.offer_showMorePageCounter = this.offer_showMorePageCounter + 1;
      this.offer_showMoreSizeCounter = this.offer_showMoreSizeCounter;
      this.myalerts.loadOffers(this.userData.userId, this.offer_showMorePageCounter, this.offer_showMoreSizeCounter).subscribe((res) => {
        this.loader_offer = false;
        this.offers = [...this.offers, ...res.content];
        this.filterImageURL();
        this.getMainImage();
        this.sort(this.offers, 'offer');
        this.showHideShowMoreBtn(this.offers, res, 'offer');
      }, (err) => {
        console.log("Offers::::", err)
      })
    }
    /*From Offers Block*/

    /*From Order Shipped Block*/
    else if (from == 'order') {
      this.loader_order = true;
      this.orderShipped_showMorePageCounter = this.orderShipped_showMorePageCounter + 1;
      this.orderShipped_showMoreSizeCounter = this.orderShipped_showMoreSizeCounter;
      this.myalerts.loadOrders(this.userData.userId, this.orderShipped_showMorePageCounter, this.orderShipped_showMoreSizeCounter).subscribe((res) => {
        this.loader_order = false;
        this.orders = [...this.orders, ...res.content];
        for (var i = 0; i < this.orders.length; i++) {
          if (this.orders[i].orderItems.length == undefined) {
            this.orders[i].orderItems = [this.orders[i].orderItems];
          }
        }
        this.formatImages(this.orders, 'order');
        this.showHideShowMoreBtn(this.orders, res, 'order');
      }, (err) => {
        console.log("Orders::::", err)
      })
    }
    /*From Order Shipped Block*/

    /*From Reviewed Products Block*/
    else if (from == 'review') {
      this.loader_review = true;
      this.reviewedProduct_showMorePageCounter = this.reviewedProduct_showMorePageCounter + 1;
      this.reviewedProduct_showMoreSizeCounter = this.reviewedProduct_showMoreSizeCounter;
      this.myalerts.loadReviews(this.userData.userId, this.reviewedProduct_showMorePageCounter, this.reviewedProduct_showMoreSizeCounter).subscribe((res) => {
        this.loader_review = false;
        this.reviews = [...this.reviews, ...res.content];
        this.formatImages(this.reviews, 'review');
        this.sort(this.reviews, 'review');
        this.showHideShowMoreBtn(this.reviews, res, 'review');
      }, (err) => {
        console.log("Reviews::::", err)
      })
    }
    /*From Reviewed Products Block*/

    /*From Post Review Block*/
    else {
      this.loader_postReview = true;
      this.postReview_showMorePageCounter = this.postReview_showMorePageCounter + 1;
      this.postReview_showMoreSizeCounter = this.postReview_showMoreSizeCounter;
      this.myalerts.loadPostReviewAlert(this.userData.userId, this.postReview_showMorePageCounter, this.postReview_showMoreSizeCounter).subscribe((res) => {
        this.loader_postReview = false;
        this.postReviewAlert = [...this.postReviewAlert, ...res.content];
        this.formatImages(this.postReviewAlert, 'postReview');
        this.sort(this.postReviewAlert, 'postReview');
        this.showHideShowMoreBtn(this.postReviewAlert, res, 'postReview');
      }, (err) => {
        console.log("Post Reviews::::", err);
      })
    }
    /*From Post Review Block*/
  }

  getTotaPrice(priceWithQuantity, productTaxCost, shippingCost) {
    return eval(`${priceWithQuantity + productTaxCost + shippingCost}`);
  }

  goToPage(data, from) {
    /*Offers*/
    if (from == 'offer') {
      this.myalerts.updateOffer(data.offerID).subscribe((res) => {
        this.route.navigateByUrl('/myoffer');
      }, (err) => {
        console.log(err)
      })
    }
    /*Read Reviews*/
    else if (from == 'review') {
      this.myalerts.updateReview(data.consumerReviewId).subscribe((res) => {
        console.log(res)
      }, (err) => {
        console.log(err)
      })
    }
    /*Post Reviews*/
    else {
      let modal = { purchasedDate: data.purchasedDate, orderId: data._id };
      this.myalerts.updateReviewRead(data._id, data.orderItems.productId).subscribe((res) => {
        window.localStorage['forReview'] = JSON.stringify({ modal: modal, order: data.orderItems, from: 'NA' });
        this.route.navigateByUrl("/leave-review");
      })
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
    this.myalerts.updateOrderShipped(modal.orderId, order.productId).subscribe((res) => {
      order.carrier = 'shippo';
      order.shipTrackingId = 'SHIPPO_TRANSIT';
      this.myalerts.trackOrder(order.carrier, order.shipTrackingId).subscribe((res) => {
        window.localStorage['productForTracking'] = JSON.stringify({ modal: modal, order: order, goShippoRes: res });
        this.route.navigateByUrl("/trackOrder");
      }, (err) => {
        console.log(err);
      })
    })
  }

}
