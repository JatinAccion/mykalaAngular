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
    this.conversations.push(new Conversation(this.getGreetings(), 'out', HomeComponent, { message: this.getGreetings() }));
    this.conversations.push(new Conversation(this.getGreetings(), 'in', cmsgComponent, { message: this.getGreetings() }));
    this.conversations.push(new Conversation(this.getGreetings(), 'out', cmsgComponent, { message: this.getGreetings() }));
    this.conversations.push(new Conversation(this.getGreetings(), 'in', HomeComponent, { message: this.getGreetings() }));
    this.conversations.push(new Conversation(this.getGreetings(), 'in', cmsgComponent, { message: this.getGreetings() }));
  }
  addComponent(msg) {
    this.conversations.push(new Conversation(msg, 'In', msg === "home" ? HomeComponent : cmsgComponent, { message: msg }));
  }

}
