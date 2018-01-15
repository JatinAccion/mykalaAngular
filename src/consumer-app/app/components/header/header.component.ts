import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarModule } from 'ng-sidebar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  getHeader: any;
  firstName: string;
  lastName: string;
  emailId: string;
  showLounge: boolean = false;

  constructor(private router: Router, private core: CoreService) { }

  ngOnInit() {
    this.router.events
      .subscribe(() => {
        var root = this.router.routerState.snapshot.root;
        while (root) {
          if (root.children && root.children.length) root = root.children[0]
          else if (root.data && root.data["header"]) {
            this.getHeader = root.data["header"];
            if (window.localStorage['userInfo'] != undefined) {
              this.firstName = JSON.parse(window.localStorage['userInfo']).firstName;
              this.lastName = JSON.parse(window.localStorage['userInfo']).lastName;
              this.emailId = JSON.parse(window.localStorage['userInfo']).email;
            }
            return;
          }
          else return;
        }
      });
  }

  // openNav() {
  //   this.showLounge = true;
  // }

  // closeNav() {
  //   this.showLounge = false;
  // }
}
