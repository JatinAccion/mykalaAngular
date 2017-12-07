import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  getHeader: any;
  firstName: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events
      .subscribe(() => {
        var root = this.router.routerState.snapshot.root;
        while (root) {
          if (root.children && root.children.length) root = root.children[0]
          else if (root.data && root.data["header"]) {
            this.getHeader = root.data["header"];
            this.firstName = JSON.parse(window.localStorage['userInfo']).firstName;
            return;
          }
          else return;
        }
      });
  }
}
