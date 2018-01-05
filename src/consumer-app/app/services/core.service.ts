import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../../../models/user';

@Injectable()
export class CoreService {
  userName: boolean = true;
  navVisible: boolean = true;
  logoutVisible: boolean = false;
  showSearch: boolean = true;
  showHeaderMessage: string;
  searchMessage: string;
  user: User;
  pageMsg: string;
  showPageMsg: boolean = false;
  constructor(private http: Http) { }

  hideUserInfo(showuser?: any) {
    if (showuser != undefined) this.userName = false;
    else this.userName = true;
  }

  hide() { this.navVisible = false; }

  searchMsgToggle(msg?: any) {
    if (msg != undefined) {
      this.showSearch = false;
      this.searchMessage = msg;
    }
    else this.showSearch = true;
  }

  pageLabel(pageMessage?: any) {
    if (pageMessage == undefined) this.showPageMsg = false;
    else {
      this.showPageMsg = true;
      this.pageMsg = pageMessage;
    }
  }
  
  showLogout() { return this.user !== null }

  show(msg?: any) { this.navVisible = true; this.showHeaderMessage = msg; }

  toggle() { this.navVisible = !this.navVisible; }

  setUser(usr: User) {
    this.user = usr;
    this.show();
  }

  clearUser() {
    this.user = null;
    this.hide();
  }
}
