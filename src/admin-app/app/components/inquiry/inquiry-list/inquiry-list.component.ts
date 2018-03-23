import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Inquiry, Inquirys } from '../../../../../models/inquiry';
import { InquiryService } from '../inquiry.service';
import { OrderService } from '../../order/order.service';
import { ReportOrder } from '../../../../../models/report-order';
import { UserService } from '../../user/user.service';
import { UserProfile } from '../../../../../models/user';

@Component({
  selector: 'app-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./../inquiry.css'],
  encapsulation: ViewEncapsulation.None
})
export class InquiryListComponent implements OnInit {
  users: any[];
  searchType: string;
  search: any;
  loading: boolean;
  inquirys: Inquirys;
  isCollapsed = true;
  order: ReportOrder;
  constructor(private inquiryService: InquiryService, private orderService: OrderService, private userService: UserService) {
    this.inquirys = new Inquirys();
  }

  ngOnInit() {
    this.getUsers();
    this.getPage(1);

  }
  getPage(page: number) {
    this.loading = true;
    const searchParams = { page: page - 1, size: 10, sortOrder: 'asc', elementType: 'inquiryDate', retailerName: this.search, customerName: this.search, orderId: this.search };
    if (this.search === '' || this.searchType !== 'Seller') { delete searchParams.retailerName; }
    if (this.search === '' || this.searchType !== 'Member') { delete searchParams.customerName; }
    if (this.search === '' || this.searchType !== 'Order Number') { delete searchParams.orderId; }
    this.inquiryService.get(searchParams).subscribe(res => {
      this.inquirys = res;
      this.loading = false;
    });
  }
  getOrderDetails(inquiry: Inquiry, orderId) {
    inquiry.isCollapsed = !inquiry.isCollapsed;
    if (!inquiry.isCollapsed) {
      return this.orderService.getById(orderId).subscribe(p => {
        this.order = p;
        inquiry.productCost = p.orderItems.map(q => q.totalProductPrice).reduce((a, b) => a + b);
        inquiry.productsCount = p.orderItems.length;
      });
    }
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
}
