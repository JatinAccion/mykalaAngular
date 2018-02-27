import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { StripeAddCardModel } from '../../../../models/StripeAddCard';
import { StripeCheckoutModal } from '../../../../models/StripeCheckout';
import { CheckoutService } from '../../services/checkout.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GetCustomerCards } from '../../../../models/getCards';
import { CheckoutShippingAddress } from '../../../../models/checkoutShippingAddress';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCheckout, Address, OrderItems } from '../../../../models/productCheckout';
import { MyAccountAddressModel } from '../../../../models/myAccountPost';

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
  editShippingAddressForm: FormGroup;
  addShippingAddressForm: FormGroup;
  @ViewChild('cardInfo') cardInfo: ElementRef;
  @ViewChild('toBeCharged') toBeCharged: ElementRef;
  @ViewChild('ModalBox') ModalBox: ElementRef;
  @ViewChild('editAddressModal') editAddressModal: ElementRef;
  @ViewChild('addNewAddressModal') addNewAddressModal: ElementRef;
  @ViewChild('retialerReturnModal') retialerReturnModal: ElementRef;
  AddressSaveModel = new MyAccountAddressModel();
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  loggedIn: boolean = false;
  loader: boolean = false;
  loader_chargeAmount: boolean = false;
  stripeAddCard = new StripeAddCardModel();
  stripeCheckout = new StripeCheckoutModal();
  shippingAddressCheckout = Array<CheckoutShippingAddress>();
  ProductCheckoutModal = new ProductCheckout();
  selectedCardDetails: any;
  selectedAddressDetails: any;
  selectedMethodDetails: any;
  paymentSuccessfullMsg: any;
  shippingMethod: any;
  closeResult: string;
  userData: any;
  userId: string;
  getCardsDetails: any;
  loader_getCards: boolean = false;
  retailerReturnPolicy: string;
  showShippingMethod: boolean = false;
  loader_shippingMethod: boolean = false;
  customerId: string;
  editShippingAddressFormWrapper: boolean = false;
  addShippingAddressFormWrapper: boolean = false;
  addressFormData: any;

  constructor(
    public core: CoreService,
    private cd: ChangeDetectorRef,
    private checkout: CheckoutService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private route: Router
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
    this.loadShippingAddress();
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
      if (res.length > 0) {
        this.customerId = res[0].customerId;
        for (var i = 0; i < res.length; i++) {
          this.getCardsDetails.push(new GetCustomerCards(res[i].userId, res[i].customerId, res[i].last4Digits, res[i].cardType, res[i].funding, res[i].cardHoldersName))
        }
      }
    });
  }

  loadShippingAddress() {
    this.checkout.getShippingAddress(this.userData.emailId).subscribe((res) => {
      for (var i = 0; i < res.address.length; i++) {
        let address = res.address[i];
        if (address.addressType === 'shippingAddress') {
          this.shippingAddressCheckout.push(new CheckoutShippingAddress(address.addID, address.addressLineOne, address.addressLineTwo, address.city, address.state, address.zipcode, address.addressType))
        }
      }
    })
  }

  addAddress() {
    this.editShippingAddressFormWrapper = false;
    this.addShippingAddressFormWrapper = true;
    this.addShippingAddressForm = this.formBuilder.group({
      addAddressLineOne: [''],
      addAddressLineTwo: [''],
      addCity: [''],
      addState: [''],
      addZipcode: ['']
    });
    //this.open(this.addNewAddressModal, undefined, 'addNewAddress');
  }

  editAddress(address) {
    this.editShippingAddressFormWrapper = true;
    this.addShippingAddressFormWrapper = false;
    this.editShippingAddressForm = this.formBuilder.group({
      editAddressLineOne: [address.addressLineOne],
      editAddressLineTwo: [address.addressLineTwo],
      editCity: [address.city],
      editState: [address.state],
      editZipcode: [address.zipcode]
    });
    this.addressFormData = address;
    //this.open(this.editAddressModal, address, undefined);
  }

  addEditSave(addressForm, toDo) {
    if (toDo == 'edit') {
      for (var i = 0; i < this.shippingAddressCheckout.length; i++) {
        if (this.shippingAddressCheckout[i].addID == this.addressFormData.addID) {
          this.shippingAddressCheckout[i].addressLineOne = this.editShippingAddressForm.controls.editAddressLineOne.value;
          this.shippingAddressCheckout[i].addressLineTwo = this.editShippingAddressForm.controls.editAddressLineTwo.value;
          this.shippingAddressCheckout[i].city = this.editShippingAddressForm.controls.editCity.value;
          this.shippingAddressCheckout[i].state = this.editShippingAddressForm.controls.editState.value;
          this.shippingAddressCheckout[i].zipcode = this.editShippingAddressForm.controls.editZipcode.value;
        }
      }
      this.AddressSaveModel.emailId = this.userData.emailId;
      this.AddressSaveModel.address = this.shippingAddressCheckout;
      this.editShippingAddressFormWrapper = false;
      this.checkout.addEditShippingAddress(this.AddressSaveModel).subscribe((res) => {
        window.localStorage['userInfo'] = JSON.stringify(res);
        this.addressFormData.addressLineOne = this.editShippingAddressForm.controls.editAddressLineOne.value;
        this.addressFormData.addressLineTwo = this.editShippingAddressForm.controls.editAddressLineTwo.value;
        this.addressFormData.city = this.editShippingAddressForm.controls.editCity.value;
        this.addressFormData.state = this.editShippingAddressForm.controls.editState.value;
        this.addressFormData.zipcode = this.editShippingAddressForm.controls.editZipcode.value;
      }, (err) => {
        console.log(err);
      });
    }
    else {
      this.shippingAddressCheckout.push(new CheckoutShippingAddress(null, this.addShippingAddressForm.controls.addAddressLineOne.value, this.addShippingAddressForm.controls.addAddressLineTwo.value, this.addShippingAddressForm.controls.addCity.value, this.addShippingAddressForm.controls.addState.value, this.addShippingAddressForm.controls.addZipcode.value, 'shippingAddress'))
      this.AddressSaveModel.emailId = this.userData.emailId;
      this.AddressSaveModel.address = this.shippingAddressCheckout;
      this.addShippingAddressFormWrapper = false;
      this.checkout.addEditShippingAddress(this.AddressSaveModel).subscribe((res) => {
        window.localStorage['userInfo'] = JSON.stringify(res);
      }, (err) => {
        console.log(err);
      });
    }
  }

  cancelAddress(address, toDo) {
    if (toDo == 'edit') this.editShippingAddressForm.reset();
    else this.addShippingAddressForm.reset();
    this.editShippingAddressFormWrapper = false;
    this.addShippingAddressFormWrapper = false;
  }

  selectShippingAddress(e, address) {
    this.loader_shippingMethod = true;
    this.showShippingMethod = false;
    let allAddress = document.getElementsByClassName("customerShippingAddress");
    for (var i = 0; i < allAddress.length; i++) {
      if (allAddress[i].classList.contains("categ_outline_red")) {
        allAddress[i].classList.remove("categ_outline_red");
        allAddress[i].classList.add("categ_outline_gray");
      }
    }
    let element = e.currentTarget;
    element.classList.remove("categ_outline_gray");
    element.classList.add("categ_outline_red");
    this.selectedAddressDetails = address;
    this.checkout.getShippingMethods(address.state, this.itemsInCart[0].shipProfileId).subscribe((res) => {
      this.shippingMethod = res.deliveryTiers[0];
      this.loader_shippingMethod = false;
      this.showShippingMethod = true;
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
    this.selectedCardDetails = card;
  }

  selectShippingMethod(e, method) {
    let allMethods = document.getElementsByClassName("customerShippingMethod");
    for (var i = 0; i < allMethods.length; i++) {
      if (allMethods[i].classList.contains("categ_outline_red")) {
        allMethods[i].classList.remove("categ_outline_red");
        allMethods[i].classList.add("categ_outline_gray");
      }
    }
    let element = e.currentTarget;
    element.classList.remove("categ_outline_gray");
    element.classList.add("categ_outline_red");
    this.selectedMethodDetails = method;
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
        this.stripeAddCard.customer.customerId = this.customerId;
        if (this.getCardsDetails.length > 0) this.updateCard(this.stripeAddCard);
        else {
          this.checkout.addCard(this.stripeAddCard).subscribe((res) => {
            this.loader = false;
            this.resetAddCard();
            this.getCards();
          });
        }
      }
    }
  }

  addNewCard() {
    this.addCard = !this.addCard;
  }

  resetAddCard() {
    this.addCard = false;
    this.error = null;
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
    this.ngAfterViewInit();
  }

  updateCard(stripeAddCard) {
    this.checkout.updateCard(stripeAddCard).subscribe((res) => {
      this.loader = false;
      this.resetAddCard();
      this.getCards();
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
    if ((this.selectedAddressDetails || this.selectedCardDetails || this.selectedMethodDetails) == undefined) alert("Please select a Shipping Address, Shipping Method and a Card");
    else if (this.selectedAddressDetails == undefined) alert("Please select a Shipping Address");
    else if (this.selectedCardDetails == undefined) alert("Please select a Card");
    else if (this.selectedMethodDetails == undefined) alert("Please select a Shipping Method")
    else {
      this.ProductCheckoutModal.orderItems = [];
      this.loader_chargeAmount = true;
      this.ProductCheckoutModal.cutomerId = this.selectedCardDetails.customerId;
      this.ProductCheckoutModal.userId = this.userData.userId;
      this.ProductCheckoutModal.customerName = this.userData.firstName + ' ' + this.userData.lastName;
      this.ProductCheckoutModal.address = new Address();
      this.ProductCheckoutModal.address = this.selectedAddressDetails;
      this.ProductCheckoutModal.purchasedDate = new Date();
      this.ProductCheckoutModal.source = 'card';
      this.ProductCheckoutModal.paymentFunding = this.selectedCardDetails.funding;
      this.ProductCheckoutModal.paymentSource = this.selectedCardDetails.cardType;
      this.ProductCheckoutModal.last4Digits = this.selectedCardDetails.last4Digit;
      this.ProductCheckoutModal.totalShipCost = this.selectedMethodDetails.deliveryFee;
      this.ProductCheckoutModal.totalTaxCost = parseFloat(document.getElementsByClassName("totalTaxCost")[0].innerHTML);
      this.ProductCheckoutModal.purchasedPrice = parseFloat(this.totalAmountFromCart.toString());
      for (var i = 0; i < this.itemsInCart.length; i++) {
        let item = this.itemsInCart[i]
        this.ProductCheckoutModal.orderItems.push(new OrderItems(item.productId, item.productName, item.retailerName, item.retailerId, item.productDescription,item.productImage, item.quantity, item.price, 20, 25, eval(`${item.price * item.quantity}`), this.selectedMethodDetails.deliveryMethodName))
      };
      console.log(this.ProductCheckoutModal);
      this.checkout.chargeAmount(this.ProductCheckoutModal).subscribe((res) => {
        this.loader_chargeAmount = false;
        this.paymentSuccessfullMsg = res;
        localStorage.removeItem('existingItemsInCart');
        this.route.navigateByUrl('/myorder');
      }, (err) => {
        this.loader_chargeAmount = false;
        alert("Something went wrong");
      })
    }
  }

  showRetailerReturns(order) {
    this.retailerReturnPolicy = order.retailerReturns;
    this.open(this.retialerReturnModal);
  }

  open(content, editAddress?: any, addNewAddress?: string) {
    this.modalService.open(content).result.then((result) => {
      //Editing Address
      if (editAddress != undefined) {
        for (var i = 0; i < this.shippingAddressCheckout.length; i++) {
          if (this.shippingAddressCheckout[i].addID == editAddress.addID) {
            this.shippingAddressCheckout[i].addressLineOne = this.editShippingAddressForm.controls.editAddressLineOne.value;
            this.shippingAddressCheckout[i].addressLineTwo = this.editShippingAddressForm.controls.editAddressLineTwo.value;
            this.shippingAddressCheckout[i].city = this.editShippingAddressForm.controls.editCity.value;
            this.shippingAddressCheckout[i].state = this.editShippingAddressForm.controls.editState.value;
            this.shippingAddressCheckout[i].zipcode = this.editShippingAddressForm.controls.editZipcode.value;
          }
        }
        this.AddressSaveModel.emailId = this.userData.emailId;
        this.AddressSaveModel.address = this.shippingAddressCheckout;
        this.checkout.addEditShippingAddress(this.AddressSaveModel).subscribe((res) => {
          window.localStorage['userInfo'] = JSON.stringify(res);
          editAddress.addressLineOne = this.editShippingAddressForm.controls.editAddressLineOne.value;
          editAddress.addressLineTwo = this.editShippingAddressForm.controls.editAddressLineTwo.value;
          editAddress.city = this.editShippingAddressForm.controls.editCity.value;
          editAddress.state = this.editShippingAddressForm.controls.editState.value;
          editAddress.zipcode = this.editShippingAddressForm.controls.editZipcode.value;
        }, (err) => {
          console.log(err);
        });
      }
      //Adding New Address
      if (addNewAddress != undefined) {
        this.shippingAddressCheckout.push(new CheckoutShippingAddress(null, this.addShippingAddressForm.controls.addAddressLineOne.value, this.addShippingAddressForm.controls.addAddressLineTwo.value, this.addShippingAddressForm.controls.addCity.value, this.addShippingAddressForm.controls.addState.value, this.addShippingAddressForm.controls.addZipcode.value, 'shippingAddress'))
        this.AddressSaveModel.emailId = this.userData.emailId;
        this.AddressSaveModel.address = this.shippingAddressCheckout;
        this.checkout.addEditShippingAddress(this.AddressSaveModel).subscribe((res) => {
          window.localStorage['userInfo'] = JSON.stringify(res);
        }, (err) => {
          console.log(err);
        });
      }
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