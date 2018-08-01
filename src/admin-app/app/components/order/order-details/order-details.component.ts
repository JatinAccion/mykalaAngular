
// #region imports
import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ReportOrders, ReportOrder, ReportConsumer, SellerPayment, RetailerOrder, OrderStatus, ShippingTracking, ProductOrderStatus } from '../../../../../models/report-order';
import { OrderService } from '../order.service';
import { RetialerService } from '../../retailer/retialer.service';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { Product } from '../../../../../models/product';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { CoreService } from '../../../services/core.service';
import { InquiryService } from '../../inquiry/inquiry.service';
import { Inquirys } from '../../../../../models/inquiry';
import { UserService } from '../../user/user.service';
import { UserProfile } from '../../../../../models/user';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorExt } from '../../../../../common/ValidatorExtensions';
import { userMessages, inputValidations } from './messages';
// #endregion imports


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./../order.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailsComponent implements OnInit {
  saveloader: boolean;
  showTrackingForm: boolean;
  fG1: FormGroup;
  users: any[];
  errorMsgs = inputValidations;
  inquirys = new Inquirys();
  consumer: ReportConsumer;
  products: Product[];
  seller: RetailerProfileInfo;
  search: any;
  loading: boolean;
  isCollapsed = true;
  shippingTracking: ShippingTracking;
  @Input() order: ReportOrder;
  @Input() retailerOrder: RetailerOrder;
  @Output() retailerOrderChange = new EventEmitter<RetailerOrder>();
  processedProducts: ProductOrderStatus[];

  orderStatus = OrderStatus;
  constructor(private orderService: OrderService,
    public retialerService: RetialerService,
    private core: CoreService,
    private inquiryService: InquiryService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    public validatorExt: ValidatorExt) {

  }

  async ngOnInit() {
    this.order = this.order || new ReportOrder();
    this.setFormValidators();
    if (this.retailerOrder && !this.order.orderId) {
      this.order = await this.getOrderDetails(this.retailerOrder.orderId);
      this.getProcessedProducts();
    }
    this.getData();
    this.setShippingTrackingEntry();
  }
  setShippingTrackingEntry() {
    if (this.retailerOrder.orderStatus === 'Processed') {
      this.showTrackingForm = true;
      this.setFormValidators();
    } else {
      this.showTrackingForm = false;
    }
  }
  setFormValidators() {
    this.fG1 = this.formBuilder.group({
      trackingNumber: ['', [Validators.required]],
      carrier: ['', [Validators.required]],
      productSKU: ['', [Validators.required]],
      shipmentDate: ['', [Validators.required]],
    });
  }
  saveShipmentTracking() {
    this.readForm();
    this.validatorExt.validateAllFormFields(this.fG1);
    if (!this.fG1.valid) {
      this.core.message.info(userMessages.requiredFeilds);
    } else {
      this.saveloader = true;
      this.orderService
        .saveShipmentTracking(this.shippingTracking)
        .subscribe(res => {
          this.saveloader = false;
          this.core.message.success(userMessages.success);
          this.retailerOrder.orderShippedDate = new Date(this.shippingTracking.shipmentDate);
          this.shippingTracking.productIds.forEach(p => {
            this.retailerOrder._ProductStatusShipped = p;
            const product = this.retailerOrder.products.firstOrDefault(q => q.productId === p);
            product.trackingNumber = this.shippingTracking.trackingNumber;
            const orderItem = this.order.orderItems.firstOrDefault(q => q.productId === p);
            orderItem.trackingNumber = this.shippingTracking.trackingNumber;
            orderItem.shipTrackingId = this.shippingTracking.trackingNumber;
          });
          this.retailerOrder.orderStatus = this.retailerOrder._OrderStatus;
          this.retailerOrderChange.emit(this.retailerOrder);

          this.setShippingTrackingEntry();
          return true;
        }, err => { this.saveloader = false; this.core.message.error(userMessages.error); }, () => this.saveloader = false);
      return false;
    }
  }
  readForm() {
    const form = this.fG1.value;
    const formControls = this.fG1.controls;
    this.shippingTracking = this.shippingTracking || new ShippingTracking();
    this.shippingTracking.orderId = this.order.orderId;
    this.shippingTracking.retailerOrderId = this.retailerOrder.sellerOrderId;
    this.shippingTracking.retailerName = this.retailerOrder.retailerName;
    this.shippingTracking.trackingNumber = form.trackingNumber;
    this.shippingTracking.carrier = form.carrier;
    this.shippingTracking.shipmentDate = this.toDate(form.shipmentDate);
    this.shippingTracking.productSKU = this.products.filter(p => this.processedProducts.firstOrDefault(q => q.productId === p.kalaUniqueId && q.selected)).map(p => p.productSkuCode);
    this.shippingTracking.productIds = this.products.filter(p => this.processedProducts.firstOrDefault(q => q.productId === p.kalaUniqueId && q.selected)).map(p => p.kalaUniqueId);
  }
  clear() {
    this.fG1.reset();
  }
  getOrderDetails(orderId) {
    return this.orderService.getById(orderId).toPromise().then(p => { this.order = p; return p; });
  }
  getData() {
    this.loading = true;
    this.getProfileInfo(this.retailerOrder.retailerId);
    this.getProductInfo(this.retailerOrder.products.map(p => p.productId));
    this.getConsumer(this.order.userId);
    this.getSellerPaymentStatus(this.retailerOrder.orderId, this.retailerOrder.retailerId);
    this.getInquiryList(this.retailerOrder.orderId);
    this.getUsers();
  }
  getProfileInfo(retailerId: string) {
    this.retialerService
      .profileInfoGet(retailerId)
      .subscribe((res: RetailerProfileInfo) => {
        this.seller = res;
      });
  }
  getProcessedProducts() {
    this.processedProducts = this.retailerOrder.products.filter(p => p.productItemStatus === OrderStatus.ORDERPROCESSED);
    if (this.processedProducts.length === 1) {
      this.fG1.controls.productSKU.patchValue(this.processedProducts[0].productId);
      this.fG1.controls.productSKU.updateValueAndValidity();
      this.processedProducts[0].selected = true;
    }
  }
  getProductInfo(productIds: string[]) {
    const product = this.orderService.getProducts(productIds);
    const productReviews = this.orderService.getProductReviews(productIds);
    this.order.orderItems.removeAll(p => productIds.filter(q => q === p.productId).length === 0);
    this.retailerOrder.shippingCost = this.order.orderItems.map(p => p.shippingCost).reduce((a, b) => a + b);
    forkJoin([product, productReviews])
      .subscribe((res) => {
        this.products = res[0];
        this.products.forEach(p => {
          if (res[1].filter(q => q.productId === p.kalaUniqueId).length > 0) {
            p.reviewCount = res[1].filter(q => q.productId === p.kalaUniqueId)[0].reviewCount;
          }
          const orderItem = this.order.orderItems.firstOrDefault(q => q.productId === p.kalaUniqueId);
          if (orderItem) {
            orderItem.product = p;
          }
        });

      });
  }
  getInquiryList(orderId) {
    this.loading = true;
    const searchParams = { page: 0, size: 10, sortOrder: 'desc', elementType: 'createdDate', orderId: orderId };

    this.inquiryService.get(searchParams).subscribe(res => {
      this.inquirys = res;
      this.loading = false;
    });
  }
  getConsumer(consumerId: string) {
    this.orderService
      .getConsumer(consumerId)
      .subscribe((res: ReportConsumer) => {
        this.consumer = res;
      });
  }
  getSellerPaymentStatus(orderId: string, retailerId: string) {
    this.orderService
      .getSellerPaymentStatus(orderId, retailerId)
      .subscribe((res) => {
        this.order.sellerPayment = new SellerPayment(res);
      });
  }
  sellerPayment(orderId, retailerId, status) {
    //Old Code const sellerPayment = { orderId: orderId, retailerId: retailerId, paymentStatus: status, paymentType: 'MANUAL', retailerName: this.seller.businessName, paymentDate: this.toDate(new Date()) };
    let sellerPayment = {};
    if (status == "PENDING") sellerPayment = { orderId: orderId, retailerId: retailerId, paymentStatus: status, paymentType: 'MANUAL', retailerName: this.seller.businessName, paymentDate: null };
    else sellerPayment = { orderId: orderId, retailerId: retailerId, paymentStatus: status, paymentType: 'MANUAL', retailerName: this.seller.businessName, paymentDate: this.toDate(new Date()) };
    this.orderService
      .saveSellerPayment(sellerPayment)
      .subscribe((res) => {
        this.getSellerPaymentStatus(orderId, retailerId);
        this.core.message.success('Payment Updated');
      });
  }
  getUsers(): any {
    this.userService.get(null).subscribe((res) => {
      this.users = res;
    });
  }
  getUser(id): UserProfile {
    if (this.users && this.users.filter(p => p.userId === id).length > 0) {
      return this.users.filter(p => p.userId === id)[0] as UserProfile;
    } else { return new UserProfile(); }
  }
  toDate(obj) {
    if (obj.year && obj.month && obj.day) {
      return `${obj.year}-${obj.month}-${obj.day}`;
    } else if (new Date(obj)) {
      const date = new Date(obj);
      if (date.getDate() ? true : false) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      } else { return ''; }
    }
  }
  getProcessedDate(orderDate) {
    var processedDate = new Date(orderDate);
    processedDate.setHours(processedDate.getHours() + 1);
    let PDTimeStamp = +processedDate;
    return PDTimeStamp;
  }
}
