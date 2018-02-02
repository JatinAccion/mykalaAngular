// #region imports
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { nameValue } from '../../../../../models/nameValue';
import { RetialerService } from '../retialer.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';
import { environment } from '../../../../environments/environment';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { RetailerPaymentInfo } from '../../../../../models/retailer-payment-info';
import { RetialerShippingProfile } from '../../../../../models/retailer-shipping-profile';
import { RetailerProductInfo } from '../../../../../models/retailer-product-info';
import { RetailerReturnPolicy, RetailerNotification } from '../../../../../models/retailer';
import { CoreService } from '../../../services/core.service';
import { userMessages } from './messages';
// #endregion imports

@Component({
  selector: 'app-retailer-add',
  templateUrl: './retailer-add.component.html',
  styleUrls: ['./../retailer.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddComponent implements OnInit {
  // #region declarations
  currentOrientation = 'vertial';
  currentJustify = 'end';
  profileData = new RetailerProfileInfo();
  paymentData = new RetailerPaymentInfo();
  productData = new RetailerProductInfo();
  shippingsData = new Array<RetialerShippingProfile>();
  returnData = new RetailerReturnPolicy();
  notificationData = new RetailerNotification();
  retailerId = '1';
  userMsgs = userMessages;
  @ViewChild('tabs') ngbTabSet: NgbTabset;

  status = {
    Profile: false,
    Payment: false,
    Product: false,
    Shipping: false,
    Return: false,
    Notifications: false
  };
  // #endregion declaration
  // tslint:disable-next-line:whitespace
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    route: ActivatedRoute,
    private retialerService: RetialerService,
    private validatorExt: ValidatorExt,
    private core: CoreService
  ) {
    this.retailerId = route.snapshot.params['id'];
  }
  ngOnInit() {
    this.retialerService.reset();
    this.retialerService.profileData.subscribe(p =>
      this.status.Profile = p.retailerId ? true : false
    );
    this.retialerService.paymentData.subscribe(p => this.status.Payment = p.retailerBankPaymentId ? true : false);
    this.retialerService.productData.subscribe(p => this.status.Product = p.status);
    // this.retialerService.shippingsData.subscribe(p => this.status.Shipping = p[0].retailerId ? true : false);
    this.retialerService.returnData.subscribe(p => this.status.Return = p.shippingReturnId ? true : false);
    this.retialerService.notificationData.subscribe(p => this.status.Notifications = p.shippingNotificationsId ? true : false);
    this.setActiveTab({ nextId: 'tab-Profile' });
    if (this.retailerId) {
      this.retialerService.loadRetailer(this.retailerId);
    }
  }
  setActiveTab(event) {
    if (!this.retailerId && event.nextId !== 'tab-Profile') {
      this.core.message.info('Please save profile');
      event.preventDefault();
      return;
    }
  }
  showNextTab(prevTab) {
    if (this.retailerId) {
      switch (prevTab) {
        case 'tab-Profile': this.ngbTabSet.select('tab-Payment'); break;
        case 'tab-Payment': this.ngbTabSet.select('tab-Product'); break;
        case 'tab-Product': this.ngbTabSet.select('tab-Shipping'); break;
        case 'tab-Shipping': this.status.Shipping = true;
          // this.ngbTabSet.select('tab-Return');
          break;
        case 'tab-Return': this.ngbTabSet.select('tab-Notifications'); break;
        case 'tab-Notifications': switch (false) {
          case this.status.Profile: this.ngbTabSet.select('tab-Profile'); break;
          case this.status.Payment: this.ngbTabSet.select('tab-Payment'); break;
          case this.status.Product: this.ngbTabSet.select('tab-Product'); break;
          case this.status.Shipping: this.ngbTabSet.select('tab-Shipping'); break;
          case this.status.Return: this.ngbTabSet.select('tab-Return'); break;
          default:
            this.core.message.success(this.userMsgs.success);
            this.router.navigateByUrl('/retailer-list'); break;
        }
          break;
      }
    }
  }
}
