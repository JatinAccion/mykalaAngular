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
      this.myalerts.loadReviews(this.userData.emailId).subscribe((res) => {
        this.reviews = res;
      }, (err) => {
        console.log(err)
      })
    }, (err) => {
      console.log(err)
    })
  }

  goToPage(offer, from) {
    if (from == 'offer') {
      this.myalerts.updateOffer(offer.offerID).subscribe((res) => {
        this.route.navigateByUrl('/myoffer');
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