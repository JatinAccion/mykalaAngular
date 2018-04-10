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
      this.offers.sort(function (a, b) {
        var dateA = a.endDate, dateB = b.endDate
        if (dateA < dateB) //sort string descending
          return 1
        if (dateA > dateB)
          return -1
        return 0 //default return value (no sorting)
      });
      this.myalerts.loadOrders(this.userData.userId).subscribe((res) => {
        this.orders = res;
        this.myalerts.loadReviews(this.userData.emailId).subscribe((res) => {
          this.reviews = res;
          this.reviews.sort(function (a, b) {
            var dateA = a.reviewDate, dateB = b.reviewDate
            if (dateA < dateB) //sort string descending
              return 1
            if (dateA > dateB)
              return -1
            return 0 //default return value (no sorting)
          });
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
    else {
      this.myalerts.updateReview(data.consumerReviewId).subscribe((res) => {
        this.route.navigateByUrl('/view-product');
      }, (err) => {
        console.log(err)
      })
    }
  }

  loopNumber(number, from) {
    if (from == 'offers') return Array(number).fill(number)
    else return Array(parseFloat(number)).fill(parseFloat(number))
  }

  getFullDate(date) {
    let objDate = new Date(date), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
    return objDate.toLocaleString(locale, { month: "short" }) + ' ' + objDate.getDate() + ', ' + this.formatAMPM(objDate);
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

}
