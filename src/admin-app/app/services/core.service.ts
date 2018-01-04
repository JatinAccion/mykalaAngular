import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CoreService {

  navVisible = true;
  spinnerVisible = false;
  message = this.toastr;

  constructor(private toastr: ToastrService) { }

  hide() { this.navVisible = false; }

  show() { this.navVisible = true; }

  toggle() { this.navVisible = !this.navVisible; }


  hideSpinner() { this.spinnerVisible = false; }

  showSpinner() { this.spinnerVisible = true; }

  toggleSpinner() { this.spinnerVisible = !this.spinnerVisible; }

}
