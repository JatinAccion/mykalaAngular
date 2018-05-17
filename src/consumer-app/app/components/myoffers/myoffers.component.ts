import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { MyOffersService } from '../../services/myOffer.service';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BrowseProductsModal } from '../../../../models/browse-products';

@Component({
  selector: 'app-myoffers',
  templateUrl: './myoffers.component.html',
  styleUrls: ['./myoffers.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MyoffersComponent implements OnInit {
  userData: any;
  myOffersDetails = [];
  loader: boolean = false;
  startDate: {};
  s3: any;
  remainingTime = 'Time';
  getOffersData: any;
  getOffersDataAttr = [];

  constructor(
    public core: CoreService,
    private myOffer: MyOffersService,
    private route: Router,
    private routerOutlet: RouterOutlet
  ) { }

  ngOnInit() {
    this.core.checkIfLoggedOut(); /*** If User Logged Out*/
    this.core.hide();
    this.core.searchMsgToggle();
    this.userData = JSON.parse(window.localStorage['userInfo']);
    localStorage.removeItem("offerIdForEdit");
    if (window.localStorage['getOffers'] != undefined) this.getOffersData = JSON.parse(window.localStorage['getOffers']);
    //this.getOffersDataFn() //Temperaroy based on the confirm result
    this.getOffers(); //Enable once get offers algorithm is implemented
    this.s3 = environment.s3;
  }

  getOffersDataFn() {
    for (var key in this.getOffersData.getOffersRequestDTO.attributes) {
      if (key == "Zipcode" || key == "DeliveryMethod") { }
      else {
        this.getOffersDataAttr.push({
          key: key,
          values: this.getOffersData.getOffersRequestDTO.attributes[key]
        })
      }
    }
    this.getOffersData.getOffersRequestDTO.attributes['getOffersDataAttr'] = [];
    this.getOffersData.getOffersRequestDTO.attributes['getOffersDataAttr'] = this.getOffersDataAttr;
    let objDate = new Date(this.getOffersData.getOffersRequestDTO.startDate), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
    this.getOffersData.getOffersRequestDTO.startDate = objDate.toLocaleString(locale, { month: "short" }) + ' ' + objDate.getDate() + ', ' + this.formatAMPM(objDate);
    this.calculateTimeLeft(this.getOffersData.getOffersRequestDTO);
  }

  getOffers() {
    this.loader = true;
    let emailId = this.userData.emailId
    this.myOffer.loadOffers(emailId).subscribe((res) => {
      this.loader = false;
      this.myOffersDetails = res;
      this.refineAttributes();
      for (var i = 0; i < this.myOffersDetails.length; i++) {
        let objDate = new Date(this.myOffersDetails[i].getOffersRequestDTO.startDate), locale = "en-us", month = objDate.toLocaleString(locale, { month: "long" });
        this.myOffersDetails[i].getOffersRequestDTO.startDate = objDate.toLocaleString(locale, { month: "short" }) + ' ' + objDate.getDate() + ', ' + this.formatAMPM(objDate);
        this.calculateTimeLeft(this.myOffersDetails[i].getOffersRequestDTO);
      }
    });
  }

  refineAttributes() {
    for (var i = 0; i < this.myOffersDetails.length; i++) {
      this.getOffersDataAttr = [];
      if (this.myOffersDetails[i].getOffersRequestDTO.attributes != null) {
        for (var key in this.myOffersDetails[i].getOffersRequestDTO.attributes) {
          if (key == "Zipcode" || key == "DeliveryMethod") { }
          else {
            this.getOffersDataAttr.push({
              key: key,
              values: this.myOffersDetails[i].getOffersRequestDTO.attributes[key]
            })
          }
        }
        this.myOffersDetails[i].getOffersRequestDTO.attributes = this.getOffersDataAttr;
      }
    }
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

  calculateTimeLeft(Obj) {
    var deadline = new Date(Obj.endDate).getTime();
    var x = setInterval(function () {
      var now = new Date().getTime();
      var t = deadline - now;
      var days = Math.floor(t / (1000 * 60 * 60 * 24));
      var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((t % (1000 * 60)) / 1000);
      if (t < 0) {
        clearInterval(x);
        Obj.remainingTime = "EXPIRED";
      }
      else Obj.remainingTime = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }, 1000);
  }

  editOffer(offer) {
    window.localStorage['offerIdForEdit'] = offer.offerID;
    setTimeout(() => {
      if (this.routerOutlet.isActivated) this.routerOutlet.deactivate();
      this.route.navigate(['/getoffer', 'step1']);
    }, 1000);
  }

  endOffer(offer) {
    this.myOffer.endOffer(offer.offerID).subscribe((res) => {
      this.getOffers();
    })
  }

  viewOfferDetails(product) {
    product.product = {
      "productImages": [{
        "id": "e4b834fc-c020-4e3c-a3b5-bb8765b25d73",
        "name": null,
        "location": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5746/5746805_sd.jpg;maxHeight=63;maxWidth=63",
        "type": ".png",
        "size": 0,
        "basePath": "images/",
        "mainImage": true,
        "createdOn": "2018-05-08T10:07:46.470+0000",
        "modifiedOn": "2018-05-08T10:07:46.470+0000",
        "fieldName": "Image URL 1"
      }, {
        "id": "7cb01b33-3d6e-40af-bbce-807528e439c2",
        "name": null,
        "location": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5746/5746805ld.jpg;maxHeight=93;maxWidth=93",
        "type": ".png",
        "size": 0,
        "basePath": "images/",
        "mainImage": false,
        "createdOn": "2018-05-08T10:07:46.470+0000",
        "modifiedOn": "2018-05-08T10:07:46.470+0000",
        "fieldName": "Image URL 2"
      }, {
        "id": "0b9049c0-653a-4d27-80a0-337e3305e443",
        "name": null,
        "location": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5746/5746805_bd.jpg;maxHeight=93;maxWidth=93",
        "type": ".png",
        "size": 0,
        "basePath": "images/",
        "mainImage": false,
        "createdOn": "2018-05-08T10:07:46.470+0000",
        "modifiedOn": "2018-05-08T10:07:46.470+0000",
        "fieldName": "Image URL 3"
      }, {
        "id": "ef6dd3ba-af54-4601-b1cd-22b8b7204bcc",
        "name": null,
        "location": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5746/5746805cv3d.jpg;maxHeight=93;maxWidth=93",
        "type": ".png",
        "size": 0,
        "basePath": "images/",
        "mainImage": false,
        "createdOn": "2018-05-08T10:07:46.470+0000",
        "modifiedOn": "2018-05-08T10:07:46.470+0000",
        "fieldName": "Image URL 4"
      }],
      "attributes": {
        "Type": "LED",
        "Color": "Blue",
        "Resolution": "2160P",
        "Screen Type": "Flat",
        "Size": "150.0",
        "Unit": "Inch",
        "Features": ["Built-in Wi-Fi Smart TV with Roku", "3 high speed HDMI inputs for best home theater connection", "Energy Star Certified", "Built-in V-chip lets you block content based on program ratings and check ratings of unfamiliar programs.", "Blue 150. Inch"]
      },
      "createdDate": "2018-05-08T10:07:46.470+0000",
      "kalaPrice": 1000.99,
      "kalaUniqueId": product.product.kalaUniqueId,
      "productActivatedDate": null,
      "productCategoryName": "TV and Home Theater",
      "productDescription": "Watch your favorite films or shows in comfort with this Sharp 4K TV. High resolutions produce images that are four times more detailed than Full HD, resulting in videos have plenty of impact and have lots of contrast and bright colors. The 60Hz screen refresh rate keeps your eyes comfortable thanks to smooth transitions on this Sharp 4K TV.",
      "productName": product.product.productName,
      "productPlaceName": "Electronics",
      "productSkuCode": "7456321",
      "productStatus": true,
      "productSubCategoryName": "TVs",
      "productUpcCode": 73899914,
      "quantity": 41,
      "retailPrice": 1220,
      "retailerId": product.product.retailerId,
      "retailerName": product.retailerName,
      "shipProfileId": "5ac67846ec90344eb2285d55",
      "taxCode": "P0000000",
      "length": 111,
      "height": 11,
      "weight": 11,
      "width": 11,
      "mainImageSrc": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5746/5746805_sd.jpg;maxHeight=63;maxWidth=63",
      "productHierarchy": [{
        "levelName": "Electronics",
        "levelId": "5a99114a5e52683747a0f0f5",
        "levelCount": 1
      }, {
        "levelName": "TV and Home Theater",
        "levelId": "5a99114a5e52683747a0f0f6",
        "levelCount": 2
      }, {
        "levelName": "TVs",
        "levelId": "5a99114a5e52683747a0f0f7",
        "levelCount": 3
      }, {
        "levelName": "LED TVs",
        "levelId": "5a99114a5e52683747a0f0fa",
        "levelCount": 4
      }]
    }
    product.product.kalaPrice = product.offerPrice;
    let selectedProduct = new BrowseProductsModal(product.product)
    window.localStorage['selectedProduct'] = JSON.stringify(selectedProduct);
    this.route.navigateByUrl("/view-offer")
  }

}
