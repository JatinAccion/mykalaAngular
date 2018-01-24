import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-stripe-poc',
  templateUrl: './stripe-poc.component.html',
  styleUrls: ['./stripe-poc.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StripePocComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cardInfo') cardInfo: ElementRef;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  constructor(private cd: ChangeDetectorRef) { }

  ngAfterViewInit() {
    const style = {
      base: {
        lineHeight: '24px',
        fontFamily: 'monospace',
        fontSmoothing: 'antialiased',
        fontSize: '19px',
        '::placeholder': {
          color: 'purple'
        }
      }
    };
    this.card = elements.create('card', { style });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { token, error } = await stripe.createToken(this.card);

    if (error) {
      console.log('Something is wrong:', error);
    } else {
      console.log('Success!', token);
      // ...send the token to the your backend to process the charge
    }
  }

  /* IF WANNA SAVE AN ADDITIONAL DATA
  async onSubmit(form: NgForm) {
    const { token, error } = await stripe.createToken(this.card, {
      email: this.emailAddress
    });
  
    // ...
  }*/

}
