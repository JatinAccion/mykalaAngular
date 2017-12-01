import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VerificationService } from './verification.service';

@Component({
  selector: 'app-thank-message',
  templateUrl: './thank-message.component.html',
  styleUrls: ['./thank-message.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ThankMessageComponent implements OnInit {
  verficationStatus: string;
  token: string;
  constructor(private verification: VerificationService) { }

  ngOnInit() {
    this.token = window.location.href.split('=')[1];
    this.verification.getVerified(this.token).subscribe(data => {
      this.verficationStatus = data;
    });
  }

}
