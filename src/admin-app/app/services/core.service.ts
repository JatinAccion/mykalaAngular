import { Injectable } from '@angular/core';

@Injectable()
export class CoreService {

  navVisible: boolean = true;

  constructor() { }

  hide() { this.navVisible = false; }

  show() { this.navVisible = true; }

  toggle() { this.navVisible = !this.navVisible; }

}
