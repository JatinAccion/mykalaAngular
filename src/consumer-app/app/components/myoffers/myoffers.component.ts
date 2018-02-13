import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MyOffersService } from '../../services/myOffer.service';

@Component({
  selector: 'app-myoffers',
  templateUrl: './myoffers.component.html',
  styleUrls: ['./myoffers.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyoffersComponent implements OnInit {
  userData: any;
  myOffersDetails: any;
  startDate: {};

  constructor(
    private core: CoreService,
    private myOffer: MyOffersService
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.userData = JSON.parse(window.localStorage['userInfo']);
    this.getOffers();
  }

  getOffers() {
    let emailId = this.userData.emailId
    this.myOffer.loadOffers(emailId).subscribe((res) => {
      this.myOffersDetails = res;
      for (var i = 0; i < this.myOffersDetails.length; i++) {
        let objDate = new Date(this.myOffersDetails[i].getOffersRequestDTO.startDate), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
        this.myOffersDetails[i].getOffersRequestDTO.startDate = objDate.toLocaleString(locale, { month: "short" }) + ' ' + objDate.getDate() + ', ' + this.formatAMPM(objDate);
        console.log('Start Date:::::::::::::', this.myOffersDetails[i].getOffersRequestDTO.startDate);
        this.myOffersDetails[i].getOffersRequestDTO.endDate = this.calculateTimeLeft(this.myOffersDetails[i].getOffersRequestDTO.endDate)
      }
    });
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

  calculateTimeLeft(date) {
    var deadline = new Date(date).getTime();
    var x = setInterval(function () {
      var now = new Date().getTime();
      var t = deadline - now;
      var days = Math.floor(t / (1000 * 60 * 60 * 24));
      var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((t % (1000 * 60)) / 1000);
      let remainingTime = document.getElementsByClassName("remainingTime");
      for (var i = 0; i < remainingTime.length; i++) {
        remainingTime[i].innerHTML = days + "d "
          + hours + "h " + minutes + "m " + seconds + "s ";
        if (t < 0) {
          clearInterval(x);
          remainingTime[i].innerHTML = "EXPIRED";
        }
      }

    }, 1000);
  }

}
