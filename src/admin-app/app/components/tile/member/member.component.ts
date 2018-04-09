import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportConsumer, ConsumerOffersOrdersCount } from '../../../../../models/report-order';
import { OrderService } from '../../order/order.service';


@Component({
  selector: 'app-tile-member',
  templateUrl: './member.component.html',
  styleUrls: ['./../tile.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberTileComponent implements OnInit {
  @Input() id: string;
  @Input() orderId: string;
  consumer: ReportConsumer;
  consumerOffers: ConsumerOffersOrdersCount;
  constructor(private orderService: OrderService) { }
  ngOnInit(): void {
    this.getConsumer(this.id);
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
