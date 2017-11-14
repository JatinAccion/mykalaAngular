import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  user: User = new User();
  constructor(private router: Router, private auth: AuthService) { }
  ngOnInit() {
    localStorage.clearItem('token');
  }
  onLogin(): void {
    this.auth.login(this.user)
      .then((user) => {
        localStorage.setItem('token', user.json().auth_token);
        this.router.navigateByUrl('/status');
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
