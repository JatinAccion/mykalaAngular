import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VerificationService } from '../../services/verification.service';
import { userMessages } from './verification.messages';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-thank-message',
  templateUrl: './thank-message.component.html',
  styleUrls: ['./thank-message.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ThankMessageComponent implements OnInit {
  verficationStatus: string;
  token: string;
  verifyUser = userMessages;

  constructor(
    private verification: VerificationService,
    private routerOutlet: RouterOutlet,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = window.location.href.split('=')[1];
    this.verification.getVerified(this.token).subscribe((data) => {
      this.verficationStatus = data;
      setTimeout(() => {
        if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
        this.router.navigateByUrl('/login');
      }, 3000);
    });
  }

}
