import { Injectable, QueryList } from '@angular/core';
import { Conversation, ConversationInput } from '../../models/conversation';
import { cmsgComponent } from './cmsg.component';
import { HomeComponent } from '../home/home.component';
import { cListComponent } from './cList.component';
import { JoinKalaComponent } from '../join-kala/join-kala.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MsgDirection } from './cui.interface';

@Injectable()
export class ConversationalService {
  conversations: Array<Conversation>;
  inputComponent = new Subject<ConversationInput>();
  isConverstionalUI = true;
  process = 'Greetings';

  getComponent(): Observable<ConversationInput> {
    return this.inputComponent.asObservable();
  }
  constructor() {
    this.conversations = new Array<Conversation>();
    this.isConverstionalUI = true;
  }
  userResponse = { place: '', type: '', category: '', subcategory: '' };
  searchData = [{ 'level': 'place', 'name': 'home', 'parent': '' }, { 'level': 'type', 'name': 'appliences', 'parent': 'home' }, { 'level': 'type', 'name': 'Bedding & Linens', 'parent': 'home' }, { 'level': 'type', 'name': 'Emergency & Safety', 'parent': 'home' }, { 'level': 'type', 'name': 'Furniture & Patio', 'parent': 'home' }, { 'level': 'type', 'name': 'Garage', 'parent': 'home' }, { 'level': 'type', 'name': 'Hardware', 'parent': 'home' }, { 'level': 'type', 'name': 'Kitchen & Dining', 'parent': 'home' }, { 'level': 'type', 'name': 'Lawn & Garden', 'parent': 'home' }, { 'level': 'type', 'name': 'Lighting', 'parent': 'home' }, { 'level': 'type', 'name': 'Pest Control', 'parent': 'home' }, { 'level': 'type', 'name': 'Pool & Spa', 'parent': 'home' }, { 'level': 'type', 'name': 'Supplies', 'parent': 'home' }, { 'level': 'type', 'name': 'Tools', 'parent': 'home' }, { 'level': 'category', 'name': 'Lamps', 'parent': 'Lighting' }];

  getGreetings() {
    return 'How are you today?';
  }
  getLandingOptions() {
    return ['what\'s trending?', 'Login', 'Join'];
  }
  getLandingOptionsAfterLogin() {
    return ['what\'s trending?', 'home'];
  }
  getNoResultsFound() {
    return 'No results Found.. Please Try again..';
  }
  addGreetings() {
    if (this.conversations.length === 0) {
      this.conversations.push(new Conversation(MsgDirection.Out, this.getGreetings()));
      this.inputComponent.next(new ConversationInput(MsgDirection.Out, cListComponent, { data: this.getLandingOptions() }));
    }
  }
  getNextMsg(msg) {
    const search = this.searchData.filter(p => p.name === msg);
    if (search && search.length > 0) {
      this.userResponse[search[0].level] = search[0].name;
      if (search[0].parent) {
        this.getNextMsg(search[0].parent);
      }
      const response = this.searchData.filter(p => p.parent === msg
      ).map(p => p.name);
      return response;
    }
    else { return ''; }

  }
  initializeConversation() {
    this.addGreetings();
  }
  addConversation(msg: Conversation) {
    switch (this.process) {
      case 'Greetings':
        switch (msg.data) {
          case 'Join':
            this.conversations.push(new Conversation(MsgDirection.Out, 'Great! Please enter preferred user name.'));
            this.process = 'Join';
            this.inputComponent.next(new ConversationInput(MsgDirection.Out, JoinKalaComponent, { data: this.getLandingOptions() }));
            break;
        }
        break;
      case 'Join':
        switch (msg.data) {
          case 'Join Completed': this.conversations.pop();
            this.conversations.push(new Conversation(MsgDirection.Out, 'Great! thanks for Joining Kala.'));
            this.process = 'Landing';
            this.inputComponent.next(new ConversationInput(MsgDirection.Out, cListComponent, { data: this.getLandingOptionsAfterLogin() }));
            break;
          default:
            this.conversations.push(msg);
            break;
        }break;
      case 'Landing':
        this.conversations.push(new Conversation(MsgDirection.In, msg.data));
        const nextMsg = this.getNextMsg(msg.data);
        if (nextMsg && nextMsg.length > 0) {
          this.inputComponent.next(new ConversationInput(MsgDirection.Out, cListComponent, { data: nextMsg }));
        } else {
          this.inputComponent.next(new ConversationInput(MsgDirection.Out, cListComponent, {
            data: this.getLandingOptionsAfterLogin()));
          this.conversations.push(new Conversation(MsgDirection.Out, this.getNoResultsFound()));
        }
        break;
      case 'List':
      default:
        switch (msg.data) {
          default: {
          } break;
        }
    }
  }
}
