import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { UserProfile } from '../../../../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  menuCollapse = true;
  constructor(public core: CoreService) { }

  ngOnInit() {
    if (window.localStorage['userInfo']) {
      const usr = new UserProfile(JSON.parse(window.localStorage['userInfo']));
      this.core.setUser(usr);
    }
  }

}
