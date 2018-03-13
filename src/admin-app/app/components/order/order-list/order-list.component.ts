import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../order.service';
import { ReportOrders } from '../../../../../models/report-order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./../order.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListComponent implements OnInit {
  search: any;
  searchType: any;
  loading: boolean;
  orders: ReportOrders;
  isCollapsed = true;
  constructor(private orderService: OrderService) {
    this.orders = new ReportOrders();
  }

  ngOnInit() {
    this.getPage(1);
  }
  getPage(page: number) {
    this.loading = true;
    const searchParams = { page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate', retailerName: this.search, customerName: this.search, orderId: this.search };
    if (this.search === '' || this.searchType !== 'Seller') { delete searchParams.retailerName; }
    if (this.search === '' || this.searchType !== 'Member') { delete searchParams.customerName; }
    if (this.search === '' || this.searchType !== 'Order Number') { delete searchParams.orderId; }
    this.orderService.get(searchParams).subscribe(res => {
      this.orders = res;
      this.loading = false;
    });
  }
}
