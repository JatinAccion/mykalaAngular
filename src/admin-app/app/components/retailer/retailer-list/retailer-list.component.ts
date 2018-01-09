import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Retailers, RetailerReports } from '../../../../../models/retailer';
import { RetialerService } from '../retialer.service';
import { CoreService } from '../../../services/core.service';
import { Alert } from '../../../../../models/IAlert';
import { Observable } from 'rxjs/Observable';
import { userMessages } from './messages';

@Component({
  selector: 'app-retailer-list',
  templateUrl: './retailer-list.component.html',
  styleUrls: ['./retailer-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerListComponent implements OnInit {
  retailerName: string;
  loading: boolean;
  retailers: Retailers;
  asyncRetailers: Observable<Retailers>;

  constructor(private retialerService: RetialerService, private core: CoreService) {
    this.retailers = new Retailers();
  }

  ngOnInit() {
    this.getPage(1);
  }
  getData(event) {
    this.retialerService.get({
      page: 0, size: 10, sortOrder: 'asc', elementType: 'createdDate', retailerName: this.retailerName
    }).subscribe(res => {
      this.retailers = res;
    });
  }
  getPage(page: number) {
    this.loading = true;
    this.retialerService.get({
      page: page - 1, size: 10, sortOrder: 'asc', elementType: 'createdDate', retailerName: this.retailerName
    }).subscribe(res => {
      this.retailers = res;
      this.loading = false;
    });
  }
  deactivate(retailerId: number) {
    const msg = new Alert(userMessages.deactivate, 'Confirmation');
    this.core.showDialog(msg).then(res => {
      if (res === 'yes') {
        this.retialerService.changeStatus(retailerId, true).subscribe(p => {
          this.core.message.success(userMessages.deactivateSuccess);
        });
      }
    });
  }
}

