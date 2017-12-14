import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrums',
  templateUrl: './breadcrums.component.html',
  styleUrls: ['./breadcrums.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumsComponent implements OnInit {
  @Input() breadCrums: Array<any>;
  constructor() { }

  ngOnInit() {
  }

}
