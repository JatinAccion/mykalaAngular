import { Injectable } from '@angular/core';
import { Conversation } from '../../models/conversation';
import { cmsgComponent } from './cmsg.component';
import { HomeComponent } from '../home/home.component';
import { cListComponent } from './cList.component';
import { UsrenameComponent } from '../usrename/usrename.component';
import { JoinKalaComponent } from '../join-kala/join-kala.component';

@Injectable()
export class ConversationalService {
  conversations: Array<Conversation>;
  isConverstionalUI = true;
  constructor() {
    this.conversations = new Array<Conversation>();
    this.isConverstionalUI = true;
  }
  userResponse = { place: '', type: '', category: '', subcategory: '' };
  searchData = [{ "level": "place", "name": "home", "parent": "" }, { "level": "type", "name": "appliences", "parent": "home" }, { "level": "type", "name": "Bedding & Linens", "parent": "home" }, { "level": "type", "name": "Emergency & Safety", "parent": "home" }, { "level": "type", "name": "Furniture & Patio", "parent": "home" }, { "level": "type", "name": "Garage", "parent": "home" }, { "level": "type", "name": "Hardware", "parent": "home" }, { "level": "type", "name": "Kitchen & Dining", "parent": "home" }, { "level": "type", "name": "Lawn & Garden", "parent": "home" }, { "level": "type", "name": "Lighting", "parent": "home" }, { "level": "type", "name": "Pest Control", "parent": "home" }, { "level": "type", "name": "Pool & Spa", "parent": "home" }, { "level": "type", "name": "Supplies", "parent": "home" }, { "level": "type", "name": "Tools", "parent": "home" }, { "level": "category", "name": "Lamps", "parent": "Lighting" }];

  getGreetings() {
    return "How are you today?";
  }
  getLandingOptions() {
    return ["what's trending?", "Login", "Join"];
  }
  getLandingOptionsAfterLogin() {
    return ["what's trending?"];
  }
  getNoResultsFound() {
    return "No results Found.. Please Try again..";
  }
  addGreetings() {
    if (this.conversations.length === 0) {
      this.conversations.push(new Conversation('out', cmsgComponent, { message: this.getGreetings() }));
      this.conversations.push(new Conversation('out', cListComponent, { data: this.getLandingOptions() }));
    }
  }
  onJoin() {
    this.conversations.push(new Conversation('out', cmsgComponent, { message: "Great! Please enter preferred user name." }));
    this.conversations.push(new Conversation('out', JoinKalaComponent, { data: this.getLandingOptions() }));
  }
  onJoined() {
    this.conversations.push(new Conversation('out', cmsgComponent, { message: "Great! thanks for Joining Kala." }));
    this.conversations.push(new Conversation('out', cListComponent, { data: this.getLandingOptionsAfterLogin() }));
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
    else {
      return '';
    }

  }
  addComponent(msg) {
    switch (msg) {
      case "Join": this.onJoin(); break;
      case "Join Completed": this.conversations.pop(); this.onJoined(); break;
      default: {
        this.conversations.push(new Conversation('in', cmsgComponent, { message: msg }));
        const nextMsg = this.getNextMsg(msg);
        if (nextMsg && nextMsg.length > 0) {
          this.conversations.push(new Conversation('out', cListComponent, { data: nextMsg }));
        } else {
          this.conversations.push(new Conversation('out', cmsgComponent, { message: this.getNoResultsFound() }));
        }
      } break;
    }
  }
}
