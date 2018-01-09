import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Retailers, RetailerReports } from '../../../../../models/retailer';
import { RetialerService } from '../retialer.service';
import { CoreService } from '../../../services/core.service';
import { Alert } from '../../../../../models/IAlert';

@Component({
  selector: 'app-retailer-list',
  templateUrl: './retailer-list.component.html',
  styleUrls: ['./retailer-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerListComponent implements OnInit {
  retailers: Retailers;

  constructor(private retialerService: RetialerService, private core: CoreService) {
    this.retailers = new Retailers();
  }

  ngOnInit() {
    this.getData();
  }
  getData() {
    this.retialerService.get({
      page: 0, size: 10, sortOrder: 'asc', elementType: 'createdDate', retailerName: 'a'
    }).subscribe(res => {
      this.retailers = res;
    });
  }
  deactivate() {
    const msg = new Alert('are you sure you want to remove this seller from system?', 'Confirmation');
    this.core.showDialog(msg).then(res => {
      if (res === 'yes') {
        alert('deleted');
      }
    });
  }
}

