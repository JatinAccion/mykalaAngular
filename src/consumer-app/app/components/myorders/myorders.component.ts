import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MyOrdersService } from '../../services/myorder.service';
import { MyOrders } from '../../../../models/myOrder';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyordersComponent implements OnInit {
  userData: any;
  loader: boolean = false;
  myorderModal = Array<MyOrders>();

  constructor(
    private core: CoreService,
    private myOrder: MyOrdersService
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
    this.myorderModal = [];
    this.myOrder.getOrders(this.userData.userId).subscribe((res) => {
      this.loader = false;
      for (var i = 0; i < res.length; i++) {
        for (var j = 0; j < res[i].orderItems.length; j++) {
          this.myorderModal.push(new MyOrders(res[i].orderItems[j].deliveryMethod, res[i].orderItems[j].orderShippingCost, res[i].orderItems[j].orderTaxCost, res[i].orderItems[j].productDescription, res[i].orderItems[j].productId, res[i].orderItems[j].productImage, res[i].orderItems[j].productName, res[i].orderItems[j].productPrice, res[i].orderItems[j].retailerName, res[i].purchaseDate, res[i].purchaseAmount, res[i].last4Digits, res[i].paymentSource, res[i].userId, res[i].customerName, res[i].cutomerId, res[i].address, res[i].orderItems[j].payment))
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

}
