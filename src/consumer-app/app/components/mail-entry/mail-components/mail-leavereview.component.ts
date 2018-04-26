import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { userMessages } from './messages';
import { CoreService } from '../../../services/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/LocalStorage.service';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../../../models/user';
import { MyOrdersService } from '../../../services/myorder.service';

@Component({
  selector: 'app-mail-leavereview',
  template: '<div class="header bgimage"><div>',
  encapsulation: ViewEncapsulation.None
})
export class MailLeaveReviewComponent implements OnInit {
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
    this.myOrdersService.getById(orderId).subscribe(order => {
      if (order.orderItems.filter(p => p.productId === productId).length > 0) {
        window.localStorage['forReview'] = JSON.stringify({ modal: order, order: order.orderItems.filter(p => p.productId === productId)[0] });
        this.core.redirectTo('leave-review');
      }
    });
  }
}
