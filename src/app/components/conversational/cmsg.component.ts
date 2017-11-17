import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { CuiComponent } from './cui.interface';

@Component({
  selector: 'cmsg',
  template: '{{data.message}}',
  encapsulation: ViewEncapsulation.None
})
export class cmsgComponent implements OnInit, CuiComponent {
    @Input() data: any;
    @Output() clicked = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }

}
