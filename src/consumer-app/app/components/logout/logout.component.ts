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
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("browseProductSearch");
    localStorage.removeItem("existingItemsInCart");
    localStorage.removeItem("levelSelections");
    localStorage.removeItem("selectedProduct");
    localStorage.removeItem("TotalAmount");
    this.core.clearUser();
    this.core.hideUserInfo(true);
    this.router.navigateByUrl('/login');
  }
}
