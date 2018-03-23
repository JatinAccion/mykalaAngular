import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportConsumer } from '../../../../../models/report-order';
import { OrderService } from '../../order/order.service';


@Component({
  selector: 'app-tile-member',
  templateUrl: './member.component.html',
  styleUrls: ['./../tile.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberTileComponent implements OnInit {
  @Input() id: string;
  consumer: ReportConsumer;
  constructor(private orderService: OrderService) { }
  ngOnInit(): void {
    this.getConsumer(this.id);
  }
  getConsumer(id: string) {
    this.orderService
      .getConsumer(id)
      .subscribe((res: ReportConsumer) => {
        this.consumer = res;
      });
  }
}
