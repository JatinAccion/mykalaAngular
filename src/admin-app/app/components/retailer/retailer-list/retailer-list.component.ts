import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';
import { RetialerService } from '../retialer.service';

@Component({
  selector: 'app-retailer-list',
  templateUrl: './retailer-list.component.html',
  styleUrls: ['./retailer-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerListComponent implements OnInit {
  retailers: Array<Retailer>;
  constructor(private retialerService: RetialerService) { }

  ngOnInit() {
    this.getData();
  }
  getData() {
    this.retialerService.get(null).subscribe(res => {
      this.retailers.push(res);
    });
  }

}
