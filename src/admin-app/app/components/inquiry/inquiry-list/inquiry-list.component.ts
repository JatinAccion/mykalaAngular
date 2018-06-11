import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Inquiry, Inquirys } from '../../../../../models/inquiry';
import { InquiryService } from '../inquiry.service';
import { OrderService } from '../../order/order.service';
import { ReportOrder } from '../../../../../models/report-order';
import { UserService } from '../../user/user.service';
import { UserProfile } from '../../../../../models/user';
import { userMessages } from './messages';
import { Alert } from '../../../../../models/IAlert';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./../inquiry.css'],
  encapsulation: ViewEncapsulation.None
})
export class InquiryListComponent implements OnInit {
  users: any[];
  searchType = 'Seller';
  search: any;
  loading: boolean;
  inquirys = new Inquirys();
  isCollapsed = true;
  order: ReportOrder;
  page = 1;
  sortColumn = 'createdDate';
  sortDirection = 'desc';
  constructor(private inquiryService: InquiryService, private orderService: OrderService, private userService: UserService, private core: CoreService) {
    this.inquirys = new Inquirys();
  }

  ngOnInit() {
    this.getUsers();
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
    this.inquiryService.get(searchParams).subscribe(res => {
      this.inquirys = res;
      this.loading = false;
    });
  }
  onSorted($event) { // $event = {sortColumn: 'id', sortDirection:'asc'}
    this.sortColumn = $event.sortColumn;
    this.sortDirection = $event.sortDirection;
    this.getPageSorted(this.page, this.sortColumn, this.sortDirection);
  }
  getOrderDetails(inquiry: Inquiry, orderId) {
    inquiry.isCollapsed = !inquiry.isCollapsed;
    if (!inquiry.isCollapsed) {
      return this.orderService.getById(orderId).subscribe(p => {
        this.order = p;
        inquiry.productCost = p.orderItems.map(q => q.totalProductPrice).reduce((a, b) => a + b);
        inquiry.productsCount = p.orderItems.firstOrDefault(q => q.productName === inquiry.productName).productQuantity;
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
  delete(inquiryId) {
    const msg = new Alert(userMessages.delete, 'Confirmation');
    this.core.showDialog(msg).then(res => {
      if (res === 'yes') {
        this.inquiryService.deleteInquiry(inquiryId).subscribe(p => {
          this.core.message.success(userMessages.deleteSuccess);
          this.getPage(this.inquirys.number);
        });
      }
    });
  }
}
