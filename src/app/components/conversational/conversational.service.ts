import { Injectable } from '@angular/core';
import { Conversation } from '../../models/conversation';
import { cmsgComponent } from './cmsg.component';
import { HomeComponent } from '../home/home.component';

@Injectable()
export class ConversationalService {
  conversations: Array<Conversation>;
  constructor() {
    this.conversations = new Array<Conversation>();
  }
  getGreetings() {
    return "How are you today?";
  }
  addGreetings() {
    if (this.conversations.length === 0) {
      this.conversations.push(new Conversation('out', cmsgComponent, { message: this.getGreetings() }));
      // this.conversations.push(new Conversation('out', cmsgComponent, { message: this.getGreetings() }));
      // this.conversations.push(new Conversation( 'in', HomeComponent, { message: this.getGreetings() }));
      // this.conversations.push(new Conversation( 'in', cmsgComponent, { message: this.getGreetings() }));
    }
  }
  addComponent(msg) {

    this.conversations.push(new Conversation( 'in', cmsgComponent, { message: msg }));
    this.conversations.push(new Conversation( 'out', msg === "home" ? HomeComponent : cmsgComponent, { message: msg }));
  }

}
