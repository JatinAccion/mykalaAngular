import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MyOrdersService } from '../../services/myorder.service';
import { MyOrders, OrderItems } from '../../../../models/myOrder';
import { Router } from '@angular/router'
import { ReviewModel } from '../../../../models/review';

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

  constructor(
    public core: CoreService,
    private myOrder: MyOrdersService,
    private route: Router
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.userData = JSON.parse(window.localStorage['userInfo']);
    this.getOrders();
  }

  getOrders() {
    this.loader = true;
    this.myOrder.getOrders(this.userData.userId).subscribe((res) => {
      this.loader = false;
      this.myorderModal = new Array<MyOrders>();
      for (var i = 0; i < res.length; i++) {
        let order = res[i]
        this.myorderModal.push(new MyOrders(order.cutomerId, order.userId, order.source, order.paymentSource, order.paymentFunding, order.last4Digits, order.customerName, order.address, order.purchasedDate, new Array<OrderItems>(), order.purchasedPrice, order.totalTaxCost, order.totalShipCost, order.orderId))
        for (var j = 0; j < order.orderItems.length; j++) {
          let orderItem = order.orderItems[j]
          this.myorderModal[i].orderItems.push(new OrderItems(orderItem.productId, orderItem.productName, orderItem.retailerName, orderItem.retailerId, orderItem.productDescription, orderItem.productImage, orderItem.productQuantity, orderItem.productPrice, orderItem.productTaxCost, orderItem.shippingCost, orderItem.totalProductPrice, orderItem.deliveryMethod));
        }
      }
      console.log(this.myorderModal)
    }, (err) => {
      this.loader = false;
      console.log(err);
    })
  }

  getTotalCost(shippingCost, productCost) {
    return eval(`${shippingCost + productCost}`);
  }

  getPurchaseDate(date) {
    let objDate = new Date(date), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
    return objDate.toLocaleString(locale, { month: "short" }) + ' ' + objDate.getDate() + ', ' + this.formatAMPM(objDate);
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
      return getDay.toLocaleString(locale, { month: "short" }) + ' ' + (getDay.getDate()) + ', ' + weekday[getDay.getDay()]
    }
    // 2 day: 2 business day shipping days Delivery
    else if (deliveryMethod == '2 day: 2 business day shipping') {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 48 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return getDay.toLocaleString(locale, { month: "short" }) + ' ' + (getDay.getDate()) + ', ' + weekday[getDay.getDay()]
    }
    // Standard: 5 to 8 business days Delivery
    else if (deliveryMethod == 'Standard: 5 to 8 business days') {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 192 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return getDay.toLocaleString(locale, { month: "short" }) + ' ' + (getDay.getDate()) + ', ' + weekday[getDay.getDay()]
    }
    // Next day: 1 business day shipping
    else {
      let date = new Date(purchaseDate), locale = "en-us", month = date.toLocaleString(locale, { month: "long" });
      let getDay = new Date(date.getTime() + 24 * 60 * 60 * 1000); //Calculating on the next 5days basis
      return getDay.toLocaleString(locale, { month: "short" }) + ' ' + (getDay.getDate()) + ', ' + weekday[getDay.getDay()]
    }
  }

  leaveReview(modal, order) {
    window.localStorage['forReview'] = JSON.stringify({ modal: modal, order: order });
    this.route.navigateByUrl("/leave-review");
  }

}
