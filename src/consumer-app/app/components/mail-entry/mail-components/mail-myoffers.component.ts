import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { userMessages } from './messages';
import { CoreService } from '../../../services/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../services/LocalStorage.service';
import { AuthService } from '../../../services/auth.service';
import { UserProfile } from '../../../../../models/user';

@Component({
  selector: 'app-mail-myoffers',
  template: '<div class="header bgimage"><div>',
  encapsulation: ViewEncapsulation.None
})
export class MailMyoffersComponent implements OnInit {
  unAuthorized: boolean;
  loader: boolean;
  userId: any;
  productId: any;
  constructor(private router: Router,
    route: ActivatedRoute,
    private auth: AuthService,
    public core: CoreService, private localStorageService: LocalStorageService) {
    this.userId = route.snapshot.params['userId'];
  }

  ngOnInit() {
    if (!this.core.validateUser(this.userId)) {
      this.router.navigateByUrl('/home');
    } else {
      this.core.redirectTo('myoffer');
    }
  }
}
