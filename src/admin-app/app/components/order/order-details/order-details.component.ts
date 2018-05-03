
// #region imports
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportOrders, ReportOrder, ReportConsumer, SellerPayment, RetailerOrder, OrderStatus } from '../../../../../models/report-order';
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
// #endregion imports


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./../order.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailsComponent implements OnInit {
  users: any[];
  inquirys = new Inquirys();
  consumer: ReportConsumer;
  products: Product[];
  seller: RetailerProfileInfo;
  search: any;
  loading: boolean;
  isCollapsed = true;
  @Input() order: ReportOrder;
  @Input() retailerOrder: RetailerOrder;
  
  orderStatus= OrderStatus;
  constructor(private orderService: OrderService, public retialerService: RetialerService, private core: CoreService, private inquiryService: InquiryService, private userService: UserService) {

  }

  async ngOnInit() {
    this.order = this.order || new ReportOrder();
    if (this.retailerOrder && !this.order.orderId) {
      this.order = await this.getOrderDetails(this.retailerOrder.orderId);
    }
    this.getData();
  }
  getOrderDetails(orderId) {
    return this.orderService.getById(orderId).toPromise().then(p => { this.order = p; return p; });
  }
  getData() {
    this.loading = true;
    this.getProfileInfo(this.order.orderItems[0].retailerId);
    this.getProductInfo(this.retailerOrder.products.map(p => p.productId));
    this.getConsumer(this.order.userId);
    this.getSellerPaymentStatus(this.order.orderId, this.order.orderItems[0].retailerId);
    this.getInquiryList(this.order.orderId);
    this.getUsers();
  }
  getProfileInfo(retailerId: string) {
    this.retialerService
      .profileInfoGet(retailerId)
      .subscribe((res: RetailerProfileInfo) => {
        this.seller = res;
      });
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
    const sellerPayment = { orderId: orderId, retailerId: retailerId, paymentStatus: status, paymentType: 'MANUAL', retailerName: this.seller.businessName, paymentDate: this.toDate(new Date()) };
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
}
