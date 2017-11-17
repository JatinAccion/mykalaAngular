import { Injectable } from '@angular/core';
import { Conversation } from '../../models/conversation';
import { cmsgComponent } from './cmsg.component';
import { HomeComponent } from '../home/home.component';
import { cListComponent } from './cList.component';

@Injectable()
export class ConversationalService {
  conversations: Array<Conversation>;
  constructor() {
    this.conversations = new Array<Conversation>();
  }
  userResponse = { place: '', type: '', category: '', subcategory: '' };
  searchData = [{ "level": "place", "name": "home", "parent": "" }, { "level": "type", "name": "appliences", "parent": "home" }, { "level": "type", "name": "Bedding & Linens", "parent": "home" }, { "level": "type", "name": "Emergency & Safety", "parent": "home" }, { "level": "type", "name": "Furniture & Patio", "parent": "home" }, { "level": "type", "name": "Garage", "parent": "home" }, { "level": "type", "name": "Hardware", "parent": "home" }, { "level": "type", "name": "Kitchen & Dining", "parent": "home" }, { "level": "type", "name": "Lawn & Garden", "parent": "home" }, { "level": "type", "name": "Lighting", "parent": "home" }, { "level": "type", "name": "Pest Control", "parent": "home" }, { "level": "type", "name": "Pool & Spa", "parent": "home" }, { "level": "type", "name": "Supplies", "parent": "home" }, { "level": "type", "name": "Tools", "parent": "home" }, { "level": "category", "name": "Lamps", "parent": "Lighting" }];
  getGreetings() {
    return "How are you today?";
  }
  getNoResultsFound() {
    return "No results Found.. Please Try again..";
  }
  addGreetings() {
    if (this.conversations.length === 0) {
      this.conversations.push(new Conversation('out', cmsgComponent, { message: this.getGreetings() }));
    }
  }
  getNextMsg(msg) {
    const search = this.searchData.filter(p => p.name === msg);
    if (search) {
      this.userResponse[search[0].level] = search[0].name;
      if (search[0].parent) {
        this.getNextMsg(search[0].parent);
      }
      const response = this.searchData.filter(p => p.parent === msg //&&
        // (this.userResponse.place ? p.level === "place" && p.parent === this.userResponse.place : true) &&
        // (this.userResponse.type ? p.level === "type" && p.parent === this.userResponse.type : true) &&
        // (this.userResponse.category ? p.level === "category" && p.parent === this.userResponse.category : true) &&
        // (this.userResponse.subcategory ? p.level === "subcategory" && p.parent === this.userResponse.subcategory : true)
      ).map(p => p.name);
      return response;
    }
  }
  addComponent(msg) {

    this.conversations.push(new Conversation('in', cmsgComponent, { message: msg }));
    const nextMsg = this.getNextMsg(msg);
    if (nextMsg && nextMsg.length > 0) {
      this.conversations.push(new Conversation('out', cListComponent, { data: nextMsg }));
    } else {
      this.conversations.push(new Conversation('out', cmsgComponent, { message: this.getNoResultsFound() }));
    }
    // this.conversations.push(new Conversation('out', msg === "home" ? HomeComponent : cmsgComponent, { message: msg }));
  }
}
