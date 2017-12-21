import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../../../models/user';

@Injectable()
export class CoreService {

  navVisible: boolean = true;

  logoutVisible: boolean = false;

  showSearch: boolean = true;

  showHeaderMessage: string;

  searchMessage: string;

  user: User;

  constructor(private http: Http) { }

  hide() { this.navVisible = false; }

  searchMsgToggle(msg?: any) { 
    if(msg != undefined){
      this.showSearch = false; 
      this.searchMessage = msg;
    }
    else this.showSearch = true; 
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
