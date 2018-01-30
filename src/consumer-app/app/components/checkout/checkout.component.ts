import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { StripeAddCardModel } from '../../../../models/StripeAddCard';
import { StripeCheckoutModal } from '../../../../models/StripeCheckout';
import { CheckoutService } from '../../services/checkout.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GetCustomerCards } from '../../../../models/getCards';

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
  @ViewChild('ModalBox') ModalBox: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  loggedIn: boolean = false;
  loader: boolean = false;
  loader_chargeAmount: boolean = false;
  stripeAddCard = new StripeAddCardModel();
  stripeCheckout = new StripeCheckoutModal();
  savedCardDetails: any;
  paymentSuccessfullMsg: any;
  closeResult: string;
  userData: any;
  userId: string;
  getCardsDetails: any;
  loader_getCards: boolean = false;
  constructor(
    private core: CoreService,
    private cd: ChangeDetectorRef,
    private checkout: CheckoutService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    if (window.localStorage['existingItemsInCart'] != undefined) this.itemsInCart = JSON.parse(window.localStorage['existingItemsInCart']);
    if (window.localStorage['TotalAmount'] != undefined) this.totalAmountFromCart = window.localStorage['TotalAmount'];
    if (window.localStorage['userInfo'] != undefined) {
      this.userData = JSON.parse(window.localStorage['userInfo']);
      this.userId = this.userData.userId;
    }
    this.getCards();
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

  getCards() {
    this.loader_getCards = true;
    this.checkout.getCards(this.userId).subscribe((res) => {
      this.getCardsDetails = [];
      this.loader_getCards = false;
      for (var i = 0; i < res.length; i++) {
        this.getCardsDetails.push(new GetCustomerCards(res[i].userId, res[i].customerId, res[i].last4Digits, res[i].cardType, res[i].cardHoldersName))
      }
    });
  }

  selectPayCard(e, card) {
    let allCards = document.getElementsByClassName("customerCards");
    for (var i = 0; i < allCards.length; i++) {
      if (allCards[i].classList.contains("categ_outline_red")) {
        allCards[i].classList.remove("categ_outline_red");
        allCards[i].classList.add("categ_outline_gray");
      }
    }
    let element = e.currentTarget;
    element.classList.remove("categ_outline_gray");
    element.classList.add("categ_outline_red");
    this.savedCardDetails = card;
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
    if (this.userData === undefined) this.error = "Please login to add new card";
    else {
      this.loader = true;
      const { token, error } = await stripe.createToken(this.card);
      if (error) this.loader = false;
      else {
        this.stripeAddCard.customer.email = this.userData.emailId;
        this.stripeAddCard.customer.source = token.id;
        this.stripeAddCard.userId = this.userId;
        this.checkout.addCard(this.stripeAddCard).subscribe((res) => {
          this.loader = false;
          this.savedCardDetails = res;
          this.getCards();
        });
      }
    }
  }

  addNewCard() {
    this.addCard = !this.addCard;
  }

  updateCard() {
    this.checkout.updateCard(this.userId).subscribe((res) => {
      console.log(res);
    });
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
    this.loader_chargeAmount = true;
    this.stripeCheckout.customerId = this.savedCardDetails.customerId;
    this.stripeCheckout.amount = this.toBeCharged.nativeElement.innerText;
    this.checkout.chargeAmount(this.stripeCheckout).subscribe((res) => {
      this.loader_chargeAmount = false;
      this.paymentSuccessfullMsg = res;
      this.open(this.ModalBox)
    })
  }

  open(content) {
    console.log(content);
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) return 'by pressing ESC';
    else if (reason === ModalDismissReasons.BACKDROP_CLICK) return 'by clicking on a backdrop';
    else return `with: ${reason}`;
  }

}
