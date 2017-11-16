import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  user: User = new User();
  @Input() hideNavi: string;
  constructor(private router: Router, private auth: AuthService, private core: CoreService) { }
  ngOnInit() {
    localStorage.removeItem('token');
    this.core.hide();

  }
  onLogin(): void {
    this.auth.login(this.user)
      .then((user) => {
        localStorage.setItem('token', user.json().auth_token);
        this.core.show();
        this.router.navigateByUrl('/status');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
