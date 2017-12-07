import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VerificationService } from '../../services/verification.service';
import { userMessages } from './verification.messages';

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

  constructor(private verification: VerificationService) { }

  ngOnInit() {
    this.token = window.location.href.split('=')[1];
    this.verification.getVerified(this.token).subscribe((data) => {
      this.verficationStatus = data;
    });
  }

}
