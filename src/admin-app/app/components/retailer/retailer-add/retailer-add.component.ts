import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Retailer } from '../../../../../models/retailer';

@Component({
  selector: 'app-retailer-add',
  templateUrl: './retailer-add.component.html',
  styleUrls: ['./retailer-add.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RetailerAddComponent implements OnInit {
  currentOrientation = 'vertial';
  currentJustify = 'end';
  retailer: Retailer;
  constructor() { }

  ngOnInit() {
  }

}
