import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { CuiComponent } from './cui.interface';
import { Conversation } from '../../models/conversation';

@Component({
  selector: 'cmsg',
  template: '{{data}}',
  encapsulation: ViewEncapsulation.None
})
export class cmsgComponent implements OnInit, CuiComponent {
  @Input() data: any;
  @Output() clicked = new EventEmitter<Conversation>();
  constructor() { }
  ngOnInit() { }

}
