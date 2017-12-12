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

  constructor(private router: Router, private core: CoreService) { }

  ngOnInit() {
    this.onLogout();
  }
  onLogout(): void {
    localStorage.removeItem('token');
    this.core.clearUser();
    this.router.navigateByUrl('/login');
  }
}
