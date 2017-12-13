import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../../../models/user';

@Injectable()
export class CoreService {

  navVisible: boolean = true;

  logoutVisible: boolean = false;

  user: User;

  constructor(private http: Http) { }

  hide() { this.navVisible = false; }

  showLogout() { return this.user !== null }

  show() { this.navVisible = true; }

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
