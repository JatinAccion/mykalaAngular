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
    });
  }

}
