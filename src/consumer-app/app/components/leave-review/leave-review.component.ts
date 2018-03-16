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
  uploadFile: any;
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
    this.requestReviewModel.consumerId = "";
    this.requestReviewModel.emailId = this.userData.emailId;
    this.requestReviewModel.userId = this.userData.userId;
    this.requestReviewModel.retailerId = this.productForReview.order.retailerId;
    this.requestReviewModel.retailerName = this.productForReview.order.retailerName;
    this.requestReviewModel.productId = this.productForReview.order.productId;
    this.requestReviewModel.productName = this.productForReview.order.productName;
    this.requestReviewModel.firstName = this.userData.firstName;
    this.requestReviewModel.lastName = this.userData.lastName;
  }

  callUpload() {
    this.uploadFile = document.getElementsByClassName('uploadImage');
    this.uploadFile[0].click();
  };

  fileChangeEvent(fileInput: any) {
    let image;
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e: any) {
        image = e.target.result;
        window.localStorage['image'] = image;
      }

      reader.readAsDataURL(fileInput.target.files[0]);
      setTimeout(() => {
        this.requestReviewModel.reviewImages = window.localStorage['image'];
        localStorage.removeItem('image');
      }, 500)
    }
  };

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
    let regex = /\S+\s+\S+\s+\S+\s+\S+\s+\S+/
    this.requestReviewModel.reviewDescription = this.reviewContent;
    if (regex.test(this.requestReviewModel.reviewDescription) != true || this.requestReviewModel.reviewDescription == undefined) alert("Please provide a minimum of 5 words");
    else if (this.requestReviewModel.rating == "" || this.requestReviewModel.rating == undefined) alert("Please select a rating");
    else {
      this.loader = true;
      this.review.postReview(this.requestReviewModel).subscribe((res) => {
        this.loader = false;
        alert("Your reviews has been saved successfully");
        localStorage.removeItem("forReview");
        this.route.navigateByUrl("/myorder")
      })
    }
  }

}