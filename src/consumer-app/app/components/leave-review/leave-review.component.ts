import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Router, RouterOutlet } from '@angular/router';
import { ReviewModel } from '../../../../models/review';
import { MyReviewService } from '../../services/review.service';

@Component({
  selector: 'app-leave-review',
  templateUrl: './leave-review.component.html',
  styleUrls: ['./leave-review.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LeaveReviewComponent implements OnInit {
  userData: any;
  requestReviewModel = new ReviewModel();
  productForReview: any;
  reviewContent: string;
  loader: boolean = false;

  constructor(
    public core: CoreService,
    private route: Router,
    private routerOutlet: RouterOutlet,
    private review: MyReviewService
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.userData = JSON.parse(window.localStorage['userInfo']);
    this.productForReview = JSON.parse(window.localStorage['forReview']);
    for (var i = 0; i < this.productForReview.modal.orderItems.length; i++) {
      let prodId = this.productForReview.productId;
      let ordr = this.productForReview.modal.orderItems[i];
      if (prodId == ordr.productId) {
        this.requestReviewModel.retailerName = ordr.retailerName;
        this.requestReviewModel.productId = ordr.productId;
        this.requestReviewModel.productName = ordr.productName;
        this.requestReviewModel.retailerId = ordr.retailerId;
      }
    }
    this.requestReviewModel.consumerId = "";
    this.requestReviewModel.emailId = this.userData.emailId;
    this.requestReviewModel.userId = this.userData.userId;
  }

  selectRating(e) {
    this.requestReviewModel.rating = e.currentTarget.dataset.number;
    let reviewIcons = document.getElementsByClassName("starIcon")
    for (var i = 0; i < reviewIcons.length; i++) {
      reviewIcons[i].classList.remove("fa-star");
      reviewIcons[i].classList.add("fa-star-o");
    }
    for (var i = 0; i < reviewIcons.length; i++) {
      reviewIcons[i].classList.remove("fa-star-o");
      reviewIcons[i].classList.add("fa-star");
      if (reviewIcons[i].getAttribute("data-number") == e.currentTarget.dataset.number) return false;
    }
  }

  postReview() {
    this.requestReviewModel.reviewDescription = this.reviewContent;
    if (this.requestReviewModel.reviewDescription == "" || this.requestReviewModel.reviewDescription == undefined) alert("Please enter your reviews");
    else if (this.requestReviewModel.rating == "" || this.requestReviewModel.rating == undefined) alert("Please select a rating");
    else {
      this.loader = true;
      this.review.postReview(this.requestReviewModel).subscribe((res) => {
        this.loader = false;
        alert("Your reviews has been saved successfully")
      })
    }
  }

}
