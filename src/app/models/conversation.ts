import { Type } from "@angular/core";

export class Conversation {
    constructor(public direction: string, public component: Type<any>, public data: any) { }
}
