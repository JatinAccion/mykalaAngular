import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CuiComponent } from './cui.interface';

@Component({
  selector: 'cmsg',
  template: '{{data.message}}',
  encapsulation: ViewEncapsulation.None
})
export class cmsgComponent implements OnInit, CuiComponent {
    @Input() data: any;
  constructor() { }

  ngOnInit() {
  }

}
