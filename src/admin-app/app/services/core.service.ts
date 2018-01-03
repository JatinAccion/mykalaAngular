import { Injectable } from '@angular/core';

@Injectable()
export class CoreService {

  navVisible = true;
  spinnerVisible = false;

  constructor() { }

  hide() { this.navVisible = false; }

  show() { this.navVisible = true; }

  toggle() { this.navVisible = !this.navVisible; }


  hideSpinner() { this.spinnerVisible = false; }

  showSpinner() { this.spinnerVisible = true; }

  toggleSpinner() { this.spinnerVisible = !this.spinnerVisible; }

}
