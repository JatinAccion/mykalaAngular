import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ReportConsumer } from '../../../../../models/report-order';
import { OrderService } from '../../order/order.service';
import { RetialerService } from '../../retailer/retialer.service';
import { RetailerProfileInfo } from '../../../../../models/retailer-profile-info';


@Component({
  selector: 'app-tile-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./../tile.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerTileComponent implements OnInit {
  @Input() id: string;
  seller: RetailerProfileInfo;
  constructor(public retialerService: RetialerService) { }
  ngOnInit(): void {
    this.getProfileInfo(this.id);
  }
  getProfileInfo(retailerId: string) {
    this.retialerService
      .profileInfoGet(retailerId)
      .subscribe((res: RetailerProfileInfo) => {
        this.seller = res;
      });
  }
}
