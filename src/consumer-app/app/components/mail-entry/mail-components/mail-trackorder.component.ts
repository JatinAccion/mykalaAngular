import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { userMessages } from './messages';
import { CoreService } from '../../../services/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/LocalStorage.service';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../../../models/user';
import { MyOrdersService } from '../../../services/myorder.service';

@Component({
  selector: 'app-mail-trackorder',
  template: '<div class="header bgimage"><div>',
  encapsulation: ViewEncapsulation.None
})
export class MailTrackOrderComponent implements OnInit {
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
      this.router.navigateByUrl('/home');
    } else {
      this.trackOrder(this.orderId, this.productId);
    }
  }
  trackOrder(orderId, productId) {
    this.myOrdersService.getById(orderId).subscribe(order => {
      if (order.orderItems.filter(p => p.productId === productId).length > 0) {
        this.myOrdersService.trackOrder('SHIPPO_TRANSIT').subscribe((res) => {
          window.localStorage['productForTracking'] = JSON.stringify({ modal: order, order: order.orderItems.filter(p => p.productId === productId)[0], goShippoRes: res });
          this.core.redirectTo('trackOrder');
        }, (err) => {
          console.log(err);
        });
      }
    });
  }
}
