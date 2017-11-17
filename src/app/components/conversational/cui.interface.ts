import { EventEmitter } from "@angular/core";

export interface CuiComponent {
  data: any;
  clicked: EventEmitter<string>;
}