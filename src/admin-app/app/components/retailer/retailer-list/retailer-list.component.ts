import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';

@Component({
  selector: 'app-retailer-list',
  templateUrl: './retailer-list.component.html',
  styleUrls: ['./retailer-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerListComponent implements OnInit {
retailers: Array<Retailer>;
  constructor() { }

  ngOnInit() {
  }

}
