import { EventEmitter } from "@angular/core";
import { Conversation } from "../../models/conversation";

export interface CuiComponent {
  data: any;
  clicked: EventEmitter<Conversation>;
}
export enum MsgDirection {
  In = 1,
  Out = 2
}
