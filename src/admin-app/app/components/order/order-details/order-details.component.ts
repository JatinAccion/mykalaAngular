
// #region imports
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportOrders, ReportOrder, ReportConsumer } from '../../../../../models/report-order';
import { OrderService } from '../order.service';
import { RetialerService } from '../../retailer/retialer.service';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { Product } from '../../../../../models/Product';
import { forkJoin } from 'rxjs/observable/forkJoin';
// #endregion imports


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./../order.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailsComponent implements OnInit {
  consumer: ReportConsumer;
  products: Product[];
  seller: RetailerProfileInfo;
  search: any;
  loading: boolean;
  isCollapsed = true;
  @Input() order: ReportOrder;
  constructor(private orderService: OrderService, public retialerService: RetialerService) {

  }

  ngOnInit() {
    this.getData();
  }
  getData() {
    this.loading = true;
    this.getProfileInfo(this.order.orderItems[0].retailerId);
    this.getProductInfo(this.order.orderItems.map(p => p.productId));
    this.getConsumer(this.order.userId);
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
    forkJoin([product, productReviews])
      .subscribe((res) => {
        this.products = res[0];
        this.products.forEach(p => {
          if (res[1].filter(q => q.productId === p.kalaUniqueId).length > 0) {
            p.reviewCount = res[1].filter(q => q.productId === p.kalaUniqueId)[0].reviewCount;
          }
          this.order.orderItems.filter(q => q.productId === p.kalaUniqueId)[0].product = p;
        });

      });
  }
  getConsumer(consumerId: string) {
    this.orderService
      .getConsumer(consumerId)
      .subscribe((res: ReportConsumer) => {
        this.consumer = res;
      });
  }
}
