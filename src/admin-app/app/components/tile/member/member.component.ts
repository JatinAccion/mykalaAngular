import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportConsumer, ConsumerOffersOrdersCount } from '../../../../../models/report-order';
import { OrderService } from '../../order/order.service';
import { InquiryService } from '../../inquiry/inquiry.service';
import { InquiryCount } from '../../../../../models/inquiry';


@Component({
  selector: 'app-tile-member',
  templateUrl: './member.component.html',
  styleUrls: ['./../tile.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberTileComponent implements OnInit {
  @Input() id: string;
  @Input() orderId: string;
  consumer = new ReportConsumer();
  consumerOffers: ConsumerOffersOrdersCount;
  inquiryCount = new InquiryCount();
  constructor(private orderService: OrderService, private inquiryService: InquiryService) { }
  ngOnInit(): void {
    this.getConsumer(this.id);
    this.getInquiryCounts(this.id);
    this.getConsumerOffersOrders(this.orderId);
  }

  getConsumerOffersOrders(orderId: string) {
    this.orderService
      .getConsumerOffersOrdersCount(orderId)
      .subscribe((res: ConsumerOffersOrdersCount) => {
        this.consumer.offersCount = res.offerTotal;
        this.consumer.ordersCount = res.orderTotal;
        this.consumerOffers = res;
      });
  }
  getInquiryCounts(id: string) {
    this.inquiryService
      .getInquiryCounts(id, id)
      .subscribe((res: InquiryCount) => {
        this.inquiryCount = res || new InquiryCount();
      });
  }

  getConsumer(id: string) {
    this.orderService
      .getConsumer(id)
      .subscribe((res: ReportConsumer) => {
        this.consumer = res;
        if (this.consumerOffers) {
          this.consumer.offersCount = this.consumerOffers.offerTotal;
          this.consumer.ordersCount = this.consumerOffers.orderTotal;
        }
      });
  }
}
