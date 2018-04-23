import { Pagination } from './pagination';
import { PostalAddress } from './retailer-business-adress';
import { Product } from './product';
import { environment } from '../admin-app/environments/environment';

export class ReportOrder {
  payment: ReportPayment;
  orderId: string;
  cutomerId: string;
  userId: string;
  customerName: string;
  purchasedPrice: number;
  totalTaxCost: number;
  totalShipCost: number;
  purchasedDate: string;
  source: string;
  paymentSource: string;
  paymentFunding: string;
  last4Digits: string;
  orderStatus: string;
  consumerEmail: string;
  address: PostalAddress;
  orderItems: ReportOrderItem[];
  isCollapsed: true;
  sellerPayment: SellerPayment;
  constructor(obj?: any) {
    this.isCollapsed = true;
    if (obj) {
      this.orderId = obj.orderId;
      this.cutomerId = obj.cutomerId;
      this.userId = obj.userId;
      this.customerName = obj.customerName;
      this.purchasedPrice = obj.purchasedPrice;
      this.totalTaxCost = obj.totalTaxCost;
      this.totalShipCost = obj.totalShipCost;
      this.purchasedDate = obj.purchasedDate;
      this.source = obj.source;
      this.paymentSource = obj.paymentSource;
      this.paymentFunding = obj.paymentFunding;
      this.last4Digits = obj.last4Digits;
      this.orderStatus = obj.orderStatus || 'Pending';
      this.consumerEmail = obj.consumerEmail;
      this.address = new PostalAddress(obj.address);
      this.orderItems = obj.orderItems.map(p => new ReportOrderItem(p));
      this.payment = new ReportPayment(obj.payment);
    }
  }
}

export class ReportOrders extends Pagination {
  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.content = obj.content.map(p => new ReportOrder(p));
    }
  }
  public content: ReportOrder[];
}
export class ReportOrderItem {
  productId: string;
  retailerId: string;
  retailerName: string;
  productName: string;
  productDescription: string;
  productImage: string;
  productQuantity: number;
  productPrice: number;
  productTaxCost: number;
  shippingCost: number;
  totalProductPrice: number;
  deliveryMethod: string;
  deliveryStatus: string;
  product: Product;
  constructor(obj?: any) {
    if (obj) {
      this.productId = obj.productId;
      this.retailerId = obj.retailerId;
      this.retailerName = obj.retailerName;
      this.productName = obj.productName;
      this.productDescription = obj.productDescription;
      this.productImage = obj.productImage;
      this.productQuantity = obj.productQuantity;
      this.productPrice = obj.productPrice;
      this.productTaxCost = obj.productTaxCost;
      this.shippingCost = obj.shippingCost;
      this.totalProductPrice = obj.totalProductPrice;
      this.deliveryMethod = obj.deliveryMethod;
      this.deliveryStatus = obj.deliveryStatus;
    }
  }
}
export class ReportPayment {
  transactionNumber: string;
  paymentNumber: string;
  paymentAmount: number;
  paymentDate: string;
  paymentStatus: string;
  constructor(obj?: any) {
    if (obj) {
      this.transactionNumber = obj.transactionNumber;
      this.paymentNumber = obj.paymentNumber;
      this.paymentAmount = obj.paymentAmount;
      this.paymentDate = obj.paymentDate;
      this.paymentStatus = obj.paymentStatus;
    }
  }

}
export class ReportConsumer {
  public address: PostalAddress[];
  public consumerImagePath: string;
  public consumerInterests: any;
  public createdAt: string;
  public customerAccountStatus: string;
  public customerId: string;
  public dateOfBirth: string;
  public emailId: string;
  public firstName: string;
  public gender: string;
  public lastName: string;
  public phone: string;
  public userId: string;
  public offersCount = 0;
  public ordersCount = 0;
  constructor(obj?: any) {
    if (obj) {
      this.address = obj.address.map(p => new PostalAddress(p));
      this.consumerImagePath = obj.consumerImagePath.toLowerCase().startsWith('https://') || obj.consumerImagePath.toLowerCase().startsWith('data:image') ? obj.consumerImagePath : (environment.s3 + obj.consumerImagePath);
      this.consumerInterests = obj.consumerInterests;
      this.createdAt = obj.createdAt;
      this.customerAccountStatus = obj.customerAccountStatus;
      this.customerId = obj.customerId;
      this.dateOfBirth = obj.dateOfBirth;
      this.emailId = obj.emailId;
      this.firstName = obj.firstName;
      this.gender = obj.gender;
      this.lastName = obj.lastName;
      this.phone = obj.phone;
      this.userId = obj.userId;
    }
  }
  get getOffersOrdersString(): string {
    return `${this.ordersCount} orders, ${this.offersCount} offer requests`;
  }
}
export class ConsumerOffersOrdersCount {
  public offerTotal: number;
  public orderTotal: number;

  constructor(obj?: any) {
    if (obj) {
      this.offerTotal = obj.offerTotal;
      this.orderTotal = obj.orderTotal;
    }
  }
}
export class SellerPayment {
  public orderId: string;
  public paymentDate: string;
  public paymentStatus: string;
  public paymentType: string;
  public retailerId: string;
  constructor(obj?: any) {
    if (obj) {
      this.orderId = obj.orderId;
      this.paymentDate = obj.paymentDate;
      this.paymentStatus = obj.paymentStatus;
      this.paymentType = obj.paymentType;
      this.retailerId = obj.retailerId;
    }
  }
}
export class ReportRetailerInquiry {
  businessName: string;
  retailerId: string;
  count: number;
  open: number;

  constructor(obj?: any) {
    if (obj) {
      this.businessName = obj.businessName;
      this.retailerId = obj.retailerId;
      if (obj.report) {
        this.count = obj.report.count;
        this.open = obj.report.open;
      } else {
        this.count = 0;
        this.open = 0;
      }
    }
  }
}

export class ReportRetailerInquirys extends Pagination {
  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.content = obj.content.map(p => new ReportRetailerInquiry(p));
    }
  }
  public content: ReportRetailerInquiry[];
}


