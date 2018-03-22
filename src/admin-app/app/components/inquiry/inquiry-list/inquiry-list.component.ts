import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Inquiry, Inquirys } from '../../../../../models/inquiry';
import { InquiryService } from '../inquiry.service';

@Component({
  selector: 'app-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./../inquiry.css'],
  encapsulation: ViewEncapsulation.None
})
export class InquiryListComponent implements OnInit {
  searchType: string;
  search: any;
  loading: boolean;
  inquirys: Inquirys;
  isCollapsed = true;
  constructor(private inquiryService: InquiryService) {
    this.inquirys = new Inquirys();
  }

  ngOnInit() {
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
}
