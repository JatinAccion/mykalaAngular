import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { userMessages } from './messages';
import { CoreService } from '../../../services/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/LocalStorage.service';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../../../models/user';
import { MyOrdersService } from '../../../services/myorder.service';

@Component({
  selector: 'app-mail-leavereview',
  template: `
  <div class="header bgimage"><div>
  <ng-template #productAlreadyReviewed let-c="close" let-d="dismiss">
  <div class="modal-header">
    <h4 class="modal-title">Leave Review</h4>
    <button type="button" class="close" aria-label="Close" (click)="d('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p>You have already reviewed this product.</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outer btn_redouter_right" (click)="c('Close click')">Close</button>
  </div>
</ng-template>
  `,
  encapsulation: ViewEncapsulation.None
})
export class MailLeaveReviewComponent implements OnInit {
  @ViewChild('productAlreadyReviewed') productAlreadyReviewed: ElementRef;
  orderId: any;
  unAuthorized: boolean;
  loader: boolean;
  userId: any;
  productId: any;
  constructor(private router: Router,
    route: ActivatedRoute,
    private auth: AuthService,
    public core: CoreService, private myOrdersService: MyOrdersService) {
    this.userId = route.snapshot.params['userId'];
    this.orderId = route.snapshot.params['orderId'];
    this.productId = route.snapshot.params['productId'];
  }

  ngOnInit() {
    if (!this.core.validateUser(this.userId)) {
      // this.core.clearStorageUserInfo();
      this.router.navigateByUrl('/home');
    } else {
      this.leaveReview(this.orderId, this.productId);
    }
  }
  leaveReview(orderId, productId) {
    if (!window.localStorage['token']) {
      this.core.redirectTo(this.router.url);
      this.router.navigateByUrl('/login');
      return false;
    }
    this.myOrdersService.getById(orderId).subscribe(order => {
      if (order.orderItems.filter(p => p.productId === productId).length > 0) {
        this.myOrdersService.getOrderReviewStatus(orderId, productId).subscribe((res) => {
          if (res === '') {
            window.localStorage['forReview'] = JSON.stringify({ modal: order, order: order.orderItems.filter(p => p.productId === productId)[0] });
            this.core.redirectTo('leave-review');
          }
          else {
            this.core.openModal(this.productAlreadyReviewed);
            this.core.getProductDetails(productId);
          }
        }, (err) => console.log(err));
      }
    });
  }
}
