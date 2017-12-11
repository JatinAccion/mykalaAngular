import { Injectable } from '@angular/core';

@Injectable()
export class CoreService {

  navVisible: boolean = true;

  logoutVisible: boolean = false;

  constructor() { }

  hide() { this.navVisible = false; }

  showLogout() { this.logoutVisible = true; }

  show() { this.navVisible = true; }

  toggle() { this.navVisible = !this.navVisible; }

}
