import { Type } from "@angular/core";
import { MsgDirection } from "../components/conversational/cui.interface";

export class Conversation {
    constructor(public direction: MsgDirection, public data: any) { }
}
export class ConversationInput {
    constructor(public direction: MsgDirection, public component: Type<any>, public data: any) { }
}