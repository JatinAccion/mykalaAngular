import { Injectable, transition } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../models/user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { Promise } from 'q';
import { Alert } from '../../../models/IAlert';
@Injectable()
export class CoreService {
  user: User;

  navVisible = true;
  spinnerVisible = false;
  message = this.toastr;
  dialogVisible = new Subject<Alert>();
  dialogResponse = new Subject<string>();

  constructor(private toastr: ToastrService) { }

  hide() { this.navVisible = false; }

  show() { this.navVisible = true; }

  toggle() { this.navVisible = !this.navVisible; }


  hideSpinner() { this.spinnerVisible = false; }

  showSpinner() { this.spinnerVisible = true; }

  toggleSpinner() { this.spinnerVisible = !this.spinnerVisible; }

  showLogout() { return this.user !== null; }

  setUser(usr: User) {
    this.user = usr;
    this.show();
  }
  clearUser() {
    this.user = null;
    this.hide();
  }
  getUser() {
    return this.user;
  }

  showDialog(alert: Alert): Promise<any> {
    return Promise(resolve => {
      this.dialogVisible.next(alert);
      this.dialogResponse.subscribe(sub => {
        return resolve(sub);
      });
    });
  }
  setDialogResponse(response) {
    this.dialogResponse.next(response);
  }
}
