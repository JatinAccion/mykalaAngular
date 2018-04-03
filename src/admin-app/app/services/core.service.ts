import { Injectable, transition } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User, UserProfile } from '../../../models/user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { Promise } from 'q';
import { Alert } from '../../../models/IAlert';
@Injectable()
export class CoreService {
  user = new UserProfile({});

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

  setUser(usr: UserProfile) {
    this.user = usr;
    this.show();
  }
  clearUser() {
    localStorage.removeItem('token');
    this.user = null;
    this.hide();
  }
  getUser(): UserProfile {
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
  isZeroValue(subject: string): boolean {
    return /^0*$/.test(subject);
  }
  /// pass key - tab or page or hash to set
  /// pass value as tab name or page number
  setUrl(key: string, value?: string) {
    if (key && value) {
      const locationHash = window.location.hash.split('/' + key)[0];
      window.location.hash = locationHash + '/' + key + '/' + value;
    }
    if (key) {
      window.location.hash = key;
    }
  }
}
