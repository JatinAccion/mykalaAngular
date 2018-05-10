import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../order.service';
import { ReportOrders, RetailerOrders, OrderStatus } from '../../../../../models/report-order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./../order.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListComponent implements OnInit {
  search: any;
  searchType = 'Seller';
  loading: boolean;
  orders: RetailerOrders;
  isCollapsed = true;
  page = 1;
  sortColumn = 'orderDate';
  sortDirection = 'desc';
  orderStatus= OrderStatus;
  constructor(private orderService: OrderService) {
    this.orders = new RetailerOrders();
  }

  ngOnInit() {
    this.getPage(1);
  }
  getPage(page: number) {
    this.page = page;
    this.getPageSorted(this.page, this.sortColumn, this.sortDirection);
  }
  getPageSorted(page: number, sortColumn: string, sortDirection: string) {
    this.loading = true;
    const searchParams = { page: page - 1, size: 10, sortOrder: sortDirection, elementType: sortColumn, retailerName: this.search, customerName: this.search, orderId: this.search };
    if (this.search === '' || this.searchType !== 'Seller') { delete searchParams.retailerName; }
    if (this.search === '' || this.searchType !== 'Member') { delete searchParams.customerName; }
    if (this.search === '' || this.searchType !== 'Order Number') { delete searchParams.orderId; }
    this.orderService.getRetailerOrders(searchParams).subscribe(res => {
      this.orders = res;
      this.loading = false;
    });
  }
  onSorted($event) { // $event = {sortColumn: 'id', sortDirection:'asc'}
    this.sortColumn = $event.sortColumn;
    this.sortDirection = $event.sortDirection;
    this.getPageSorted(this.page, this.sortColumn, this.sortDirection);
  }
}
