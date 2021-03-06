import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, public core: CoreService) { }

  ngOnInit() {
    this.onLogout();
  }
  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rf_Token');
    localStorage.removeItem('userInfo');
    this.core.hide();
    this.core.clearUser();
    this.router.navigateByUrl('/login');
    this.core.clearTokenValidation();
  }
}
