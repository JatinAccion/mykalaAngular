import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MyOrdersService } from '../../services/myorder.service';
import { MyOrders, OrderItems } from '../../../../models/myOrder';
import { Router } from '@angular/router'
import { ReviewModel } from '../../../../models/review';
import { CancelOrder } from '../../../../models/cancelOrder';
import { ConsumerSupportModal } from '../../../../models/support';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyordersComponent implements OnInit {
  userData: any;
  loader: boolean = false;
  requestReviewModel = new ReviewModel();
  myorderModal = new Array<MyOrders>();
  cancelOrderModel = new CancelOrder();
  supportOptions = { level: 0, name: '', data: [] };
  showBack: boolean = false;
  remainingTime: any;
  consumerSupport: any;
  supportData = {
    "options": [
      {
        "name": "General Question",
        "options": ["Product", "Order", "Account", "Shipping", "Using Kala", "Other"]
      }, {
        "name": "Order Issue",
        "options": ["Product Not Received", "Product Damaged", "Payment Issue", "Wrong Product Received", "Didn't Receive Order Confirmation", "Didn't Receive Shipping Confirmation", "Other"]
      }, {
        "name": "Return",
        "options": ["Product Defect", "Wrong Size", "Wrong Color", "Wrong Style", "Don't Like the Product", "Personal Reasons", "Other"]
      }, {
        "name": "Exchange",
        "options": ["Product Defect", "Wrong Size", "Wrong Color", "Wrong Style", "Don't Like the Product", "Personal Reasons", "Other"]
      }, {
        "name": "Other",
        "options": ["Other"]
      }]
  };
  questionCounter: number = 0;
  supportMessages = [];
  OtherOption: boolean = false;
  commentBox: string;
  saveAndCloseSection: boolean = false;
  showSupportOptions: boolean = true;
  selection = { parent: '', child: '' }
  @ViewChild("contactKalaModal") contactKalaModal: ElementRef;
  @ViewChild("cancelOrdersModal") cancelOrdersModal: ElementRef;
  @ViewChild('productAlreadyReviewed') productAlreadyReviewed: ElementRef;
  selectedModalDetails: any;
  selectedOrderDetails: any;

  constructor(
    public core: CoreService,
    private myOrder: MyOrdersService,
    private route: Router
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    localStorage.removeItem("productForTracking")
    this.userData = JSON.parse(window.localStorage['userInfo']);
    this.getOrders();
  }

  getOrders() {
    this.loader = true;
    this.myOrder.getOrders(this.userData.userId).subscribe((res) => {
      this.loader = false;
      this.myorderModal = res.map(p => new MyOrders(p));
      this.myorderModal.map(p => p.orderItems.filter(q => q.productItemStatus === 'ORDER PENDING').map(r => this.disableCancel(p, r)));
      this.filterImageURL()
      this.myorderModal.sort(function (a, b) {
        var nameA = a.purchasedDate, nameB = b.purchasedDate
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      });
    }, (err) => {
      this.loader = false;
      console.log(err);
    })
  }

  filterImageURL() {
    for (var i = 0; i < this.myorderModal.length; i++) {
      for (var j = 0; j < this.myorderModal[i].orderItems.length; j++) {
        let image = this.myorderModal[i].orderItems[j].productImage;
        if (image && image.indexOf('maxHeight') > -1) {
          this.myorderModal[i].orderItems[j].productImage = image.split(";")[0]
        }
      }
    }
  }

  showSupportPanel(modal, order) {
    this.supportMessages = [];
    this.supportOptions.data = [];
    order.showCustomerSupport = !order.showCustomerSupport;
    if (order.showCustomerSupport) {
      for (var i = 0; i < this.myorderModal.length; i++) {
        for (var j = 0; j < this.myorderModal[i].orderItems.length; j++) {
          this.myorderModal[i].orderItems[j].showCustomerSupport = false;
        }
      }
      order.showCustomerSupport = true;
      this.consumerSupport = new ConsumerSupportModal();
      this.consumerSupport.customerEmail = this.userData.emailId;
      this.consumerSupport.customerId = this.userData.userId;
      this.consumerSupport.customerName = modal.customerName;
      this.consumerSupport.orderId = modal.orderId;
      this.consumerSupport.orderDate = new Date(modal.purchasedDate);
      this.consumerSupport.productName = order.productName;
      this.consumerSupport.productCost = order.totalProductPrice;
      this.consumerSupport.retailerIntegrationMethod = order.retailerIntegrationMethod;
      this.questionCounter = 0;
      this.supportMessages.push({
        mainImage: '/consumer-app/assets/images/logo.png',
        from: 'Kala',
        message: 'Hi ' + this.userData.firstName + ', what can i help you with today ?'
      });
      for (var i = 0; i < this.supportData.options.length; i++) {
        this.supportOptions.level = 1;
        this.supportOptions.data.push(this.supportData.options[i].name);
      }
      this.showBack = false;
    }
    else this.saveAndClose(order, "0");
  }

  loadOptions(order, option, name) {
    this.selection.child = name;
    if (name != 'Other') {
      this.showBack = true;
      this.questionCounter++;
      if (this.supportOptions.level < 2) {
        for (var i = 0; i < this.supportData.options.length; i++) {
          if (this.supportData.options[i].name == name) {
            this.supportOptions.level = this.supportOptions.level + 1;
            this.supportOptions.name = name;
            this.selection.parent = this.supportOptions.name;
            this.supportOptions.data = this.supportData.options[i].options;
          }
        }
      }
      else if (this.supportOptions.level > 2 && name == 'Yes') {
        this.OtherOption = true;
        this.showSupportOptions = false;
      }
      else if (this.supportOptions.level > 2 && name == 'No') {
        setTimeout(() => {
          this.supportMessages.push({
            mainImage: '/consumer-app/assets/images/logo.png',
            from: 'Kala',
            message: 'Thanks for the info. We will contact you shortly via email with more details.'
          });
          this.saveAndClose(order, "1");
          this.saveAndCloseSection = true;
        }, 1500)
        this.supportOptions.data = [];
        this.consumerSupport.description = "";
        this.showBack = false;
      }
      else {
        this.supportOptions.level = this.supportOptions.level + 1;
        this.supportOptions.name = name;
        if (this.questionCounter == 3) this.questionCounter--;
        this.supportOptions.data = ["Yes", "No"];
      }

      //Updating User Message
      this.supportMessages.push({
        mainImage: this.userData.consumerImagePath,
        from: 'User',
        message: name
      });
      //Updating User Message

      //Auto Generated Data from Kala System
      if (this.questionCounter == 1) {
        this.consumerSupport.inquiryType = name;
        setTimeout(() => {
          this.supportMessages.push({
            mainImage: '/consumer-app/assets/images/logo.png',
            from: 'Kala',
            message: 'Can you give me a little more info so i can better help you ?'
          });
        }, 1500)
      }
      else if (this.questionCounter == 2) {
        this.consumerSupport.inquiryCategory = name;
        setTimeout(() => {
          this.supportMessages.push({
            mainImage: '/consumer-app/assets/images/logo.png',
            from: 'Kala',
            message: 'I\'ll look into this for you right away, Is there any other information that you want me to know ?'
          });
        }, 1500)
      }
      //Auto Generated Data from Kala System
    }
    else {
      this.consumerSupport.inquiryType = name;
      this.consumerSupport.inquiryCategory = "";
      this.OtherOption = true;
      this.showSupportOptions = false;
    }
  }

  submitComment(order, commentBox) {
    this.consumerSupport.description = commentBox;
    this.supportMessages.push({
      mainImage: this.userData.consumerImagePath,
      from: 'User',
      message: commentBox
    });
    this.commentBox = '';
    this.OtherOption = false;
    setTimeout(() => {
      this.supportMessages.push({
        mainImage: '/consumer-app/assets/images/logo.png',
        from: 'Kala',
        message: 'Thanks for the info. We will contact you shortly via email with more details.'
      });
      this.saveAndCloseSection = true;
      this.saveAndClose(order, "1");
    }, 1500);
    this.supportOptions.data = [];
    this.showBack = false;
  }

  cancelComment(commentBox) {
    this.commentBox = '';
    this.OtherOption = false;
    this.showSupportOptions = true;
  }

  saveAndClose(order, from) {
    if (from != "0") {
      this.consumerSupport.inquiryDate = new Date();
      this.myOrder.support(this.consumerSupport).subscribe((res) => {
        this.core.openModal(this.contactKalaModal)
        setTimeout(() => {
          this.core.modalReference.close();
        }, 7000)
        this.resetAll(order);
      }, (err) => {
        console.log('Something went wrong')
      })
    }
    else this.resetAll(order)
  }

  resetAll(order) {
    this.supportOptions = { level: 0, name: '', data: [] };
    this.showBack = false;
    this.questionCounter = 0;
    this.supportMessages = [];
    this.OtherOption = false;
    this.commentBox = '';
    this.saveAndCloseSection = false;
    this.showBack = false;
    this.showSupportOptions = true;
    order.showCustomerSupport = false;
  }

  goBack(order) {
    if (this.supportOptions.level > 2) {
      this.questionCounter--;
      this.supportOptions.data = []
      for (var i = 0; i < this.supportData.options.length; i++) {
        if (this.supportData.options[i].name == this.selection.parent) {
          this.supportOptions.level = this.supportOptions.level - 1;
          this.supportOptions.name = this.selection.parent;
          this.supportOptions.data = this.supportData.options[i].options;
        }
      }
    }
    else {
      this.questionCounter--;
      this.supportOptions.data = [];
      for (var i = 0; i < this.supportData.options.length; i++) {
        this.supportOptions.level = 1;
        this.supportOptions.data.push(this.supportData.options[i].name);
      }
      this.showBack = false;
    }
  }

  getTotalCost(shippingCost, productCostWithQuantiy, taxCost) {
    return eval(`${shippingCost + productCostWithQuantiy + taxCost}`);
  }

  getPurchaseDate(date) {
    let objDate = new Date(date), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
    return objDate.toLocaleString(locale, { month: "long" }) + ' ' + objDate.getDate() + ', ' + this.formatAMPM(objDate);
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  getDeliveryDate(deliveryMethod, purchaseDate) {
    let weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    // Express: 3 to 5 business days Delivery
    if (deliveryMethod == 'Express: 3 to 5 business days') {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 120 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
    // 2 day: 2 business day shipping days Delivery
    else if (deliveryMethod == '2 day: 2 business day shipping') {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 48 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
    // Standard: 5 to 8 business days Delivery
    else if (deliveryMethod == 'Standard: 5 to 8 business days') {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 192 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
    // Next day: 1 business day shipping
    else {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 24 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return weekday[getDay.getDay()] + ', ' + getDay.toLocaleString(locale, { month: "long" }) + ' ' + (getDay.getDate())
    }
  }

  leaveReview(modal, order) {
    this.myOrder.getOrderReviewStatus(modal.orderId, order.productId).subscribe((res) => {
      if (res === '') {
        window.localStorage['forReview'] = JSON.stringify({ modal: modal, order: order });
        this.route.navigateByUrl("/leave-review");
      }
      else {
        this.core.getProductDetails(order.productId);
        this.core.openModal(this.productAlreadyReviewed);
      }
    }, (err) => {
      console.log("Error In API", err)
    })
  }

  confirmCancelOrder() {
    let modal = this.selectedModalDetails;
    let order = this.selectedOrderDetails;
    this.cancelOrderModel.amount = eval(`${order.totalProductPrice + order.shippingCost + order.productTaxCost}`);
    this.cancelOrderModel.customerId = modal.customerId;
    this.cancelOrderModel.orderId = modal.orderId;
    this.cancelOrderModel.orderItemId = order.productId;
    this.cancelOrderModel.chargeId = modal.payment.paymentNumber;
    this.myOrder.cancelOrder(this.cancelOrderModel).subscribe((res) => {
      if (res == 'ORDERCANCELLED') res = 'ORDER CANCELLED';
      for (var i = 0; i < this.myorderModal.length; i++) {
        if (this.myorderModal[i].orderId == modal.orderId) {
          for (var j = 0; j < this.myorderModal[i].orderItems.length; j++) {
            this.myorderModal[i].orderItems[j].productItemStatus = res;
            this.myorderModal[i].orderItems[j].cancelOrder = true;
            this.myorderModal[i].orderItems[j].trackOrder = true;
            this.myorderModal[i].orderItems[j].leaveReview = true;
            this.myorderModal[i].orderItems[j].contactSupport = true;
          }
          break;
        }
      }
      /*order.productItemStatus = res;
      order.cancelOrder = true;
      order.trackOrder = true;
      order.leaveReview = true;
      order.contactSupport = true;*/
    }, (err) => {
      console.log(err)
    })
  }

  cancelOrder(modal, order) {
    this.selectedModalDetails = modal;
    this.selectedOrderDetails = order;
    this.core.openModal(this.cancelOrdersModal);
  }

  disableCancel(modal, order) {
    modal.deadline = new Date(new Date(modal.purchasedDate).getTime() + 1 * 60 * 60 * 1000);
    var deadline = new Date(modal.deadline).getTime();
    var x = setInterval(function () {
      var now = new Date().getTime();
      var t = deadline - now;
      var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((t % (1000 * 60)) / 1000);
      if (t < 0) {
        clearInterval(x);
        order.cancelOrder = true;
      }
      else modal.remainingTime = hours + "h " + minutes + "m " + seconds + "s ";
    }, 1000);
  }

  trackOrder(modal, order) {
    // order.carrier = 'shippo';
    // order.shipTrackingId = 'SHIPPO_TRANSIT';
    this.myOrder.trackOrder(order.carrier, order.shipTrackingId, order.productId).subscribe((res) => {
      window.localStorage['productForTracking'] = JSON.stringify({ modal: modal, order: order, goShippoRes: res });
      this.route.navigateByUrl("/trackOrder");
    }, (err) => {
      console.log(err);
    })
  }
}
