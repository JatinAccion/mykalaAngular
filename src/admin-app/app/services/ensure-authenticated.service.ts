import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationStart, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

import { PlatformLocation, Location } from '@angular/common';
import { CoreService } from './core.service';
import { Alert } from '../../../models/IAlert';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class EnsureAuthenticated implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private location: Location, private core: CoreService) {
    // this.router.events
    //   .subscribe((event) => {
    //     if (event instanceof NavigationStart) {
    //       console.log(event);
    //       location.forward();
    //     }
    //   });
    // location.subscribe.onPopState(() => {
    //   const msg = new Alert('Do you want to go to previous page', 'Confirmation');
    //   this.core.showDialog(msg).then(res => {
    //     if (res !== 'yes') {
    //       location.forward();
    //     }
    //   });
    //   console.log('pressed back!');
    // });

  }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (localStorage.getItem('token')) {
      //  return confirm('Are you sure, you want to navigate to list page ');
       return true;
    } else {
      this.router.navigateByUrl('/home');
      return false;
    }
  }
}




