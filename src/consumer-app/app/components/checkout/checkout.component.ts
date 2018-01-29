import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { StripeAddCardModel } from '../../../../models/StripeAddCard';
import { StripeCheckoutModal } from '../../../../models/StripeCheckout';
import { CheckoutService } from '../../services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {
  addCard: boolean = false;
  itemsInCart: any;
  totalAmountFromCart: number;
  @ViewChild('cardInfo') cardInfo: ElementRef;
  @ViewChild('toBeCharged') toBeCharged: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  loggedIn: boolean = false;
  loader: boolean = false;
  stripeAddCard = new StripeAddCardModel();
  stripeCheckout = new StripeCheckoutModal();
  savedCardDetails: any;
  constructor(
    private core: CoreService,
    private cd: ChangeDetectorRef,
    private checkout: CheckoutService
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    if (window.localStorage['existingItemsInCart'] != undefined) this.itemsInCart = JSON.parse(window.localStorage['existingItemsInCart']);
    if (window.localStorage['TotalAmount'] != undefined) this.totalAmountFromCart = window.localStorage['TotalAmount'];
  }

  ngAfterViewInit() {
    const style = {
      base: {
        lineHeight: '24px',
        fontFamily: 'monospace',
        fontSmoothing: 'antialiased',
        fontSize: '19px',
        '::placeholder': {
          //color: 'purple'
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
    // const userInfo = window.localStorage['userInfo'];
    // if (userInfo === undefined) this.error = "Please login to add new card";
    // else {
    //   this.loader = true;
    //   const { token, error } = await stripe.createToken(this.card);
    //   if (error) {
    //     this.loader = false;
    //     console.log('Something is wrong:', error);
    //   }
    //   else {
    //     this.loader = false;
    //     console.log('Success!', token);
    //     this.stripeAddCard.email = JSON.parse(userInfo).email;
    //     this.stripeAddCard.source = token.id;
    //     console.log(this.stripeAddCard);
    //   }
    // }
    this.loader = true;
    const { token, error } = await stripe.createToken(this.card);
    if (error) {
      this.loader = false;
      console.log('Something is wrong:', error);
    }
    else {
      this.loader = false;
      console.log('Success!', token);
      this.stripeAddCard.email = 'jatin.sharma@accionlabs.com';
      this.stripeAddCard.source = token.id;
      console.log(this.stripeAddCard);
    }
  }

  addNewCard() {
    this.addCard = !this.addCard;
  }

  calculateTotalPayable() {
    let amounts = [];
    let toBeCalculated = document.getElementsByClassName("amount");
    for (var i = 0; i < toBeCalculated.length; i++) {
      amounts.push(parseFloat(toBeCalculated[i].innerHTML))
    }
    return eval(amounts.join("+"));
  }

  chargeAmount() {
    this.stripeCheckout.customerId = this.savedCardDetails.customerId;
    this.stripeCheckout.amount = parseFloat(this.toBeCharged.nativeElement.innerText);
    this.checkout.chargeAmount(this.stripeCheckout.customerId, this.stripeCheckout.amount).subscribe((res) => {
      console.log(res);
    })
  }

}
