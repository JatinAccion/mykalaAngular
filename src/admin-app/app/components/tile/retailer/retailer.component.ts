import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportConsumer } from '../../../../../models/report-order';
import { OrderService } from '../../order/order.service';
import { RetialerService } from '../../retailer/retialer.service';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';
import { InquiryService } from '../../inquiry/inquiry.service';
import { InquiryCount } from '../../../../../models/inquiry';
import { formatPhoneNumber } from '../../../../../common/formatters';


@Component({
  selector: 'app-tile-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./../tile.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerTileComponent implements OnInit {
  @Input() id: string;
  inquiryCount = new InquiryCount();
  seller: RetailerProfileInfo;
  constructor(public retialerService: RetialerService, private inquiryService: InquiryService) { }
  ngOnInit(): void {
    this.getProfileInfo(this.id);
    this.getInquiryCounts(this.id);
  }
  formatPhoneNumber(phone) { return formatPhoneNumber(phone); }
  getInquiryCounts(id: string) {
    this.inquiryService
      .getInquiryCounts(id, id)
      .subscribe((res: InquiryCount) => {
        this.inquiryCount = res || new InquiryCount();
      });
  }
  getProfileInfo(retailerId: string) {
    this.retialerService
      .profileInfoGet(retailerId)
      .subscribe((res: RetailerProfileInfo) => {
        this.seller = res;
      });
  }
}
