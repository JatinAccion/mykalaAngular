import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { CuiComponent } from '../conversational/cui.interface';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PasswordComponent implements OnInit, CuiComponent {
  @Input() data: any;
  @Output() clicked = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }
  onClick(item: string) {
    this.clicked.emit(item);
  }
}
