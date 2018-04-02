import { Pagination } from './pagination';
import { PostalAddress } from './retailer-business-adress';
import { Product } from './Product';

export class ReportOrder {
  payment: ReportPayment;
  orderId: string; // "5a9664050b0a9030a6146be6"
  cutomerId: string; // "cus_COxMwBS8zaHmca"
  userId: string; // "5a8ad09c1035190ea96a9ffe"
  customerName: string; // "Jatin Sharma"
  purchasedPrice: number; // 2500
  totalTaxCost: number; // 27.5
  totalShipCost: number; // 70
  purchasedDate: string; // 1519805443610
  source: string; // "card"
  paymentSource: string; // "Visa"
  paymentFunding: string; // "credit"
  last4Digits: string; // "4242"
  orderStatus: string; // null
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
  productId: string; // "5a953089656fd27f67b67eb6"
  retailerId: string; // "5a93e32d8998e6452cb9ed44"
  retailerName: string; // "Best Buy"
  productName: string; // "Micromax 81 cm 32 inches I-Tech 32T8260HD 32T8280HD HD Ready LED TV Black"
  productDescription: string; // "Micromax 81 cm (32 inches) I-Tech 32T8260HD 32T8280HD HD Ready LED TV (Black)"
  productImage: string; // "https://s3.us-east-2.amazonaws.com/mykala-dev-images/products/images/bf60f397-33a8-4e4e-902a-f3c484a91344.jpeg"
  productQuantity: number; // 1
  productPrice: number; // 2500
  productTaxCost: number; // 20
  shippingCost: number; // 25
  totalProductPrice: number; // 2500
  deliveryMethod: string; // "Express: 3 to 5 business days"
  deliveryStatus: string; // null
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
  transactionNumber: string; // null
  paymentNumber: string; // "ch_1C0Q1QFYNDZqR6PoS8hISST3"
  paymentAmount: number; // 250000
  paymentDate: string; // 1519805444
  paymentStatus: string; // null
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
  constructor(obj?: any) {
    if (obj) {
      this.address = obj.address.map(p => new PostalAddress(p));
      this.consumerImagePath = obj.consumerImagePath;
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
}
export class SellerPayment {
  public orderId: string; // "5ab22cb2a27cbc47f0e1d67a"
  public paymentDate: string; // null
  public paymentStatus: string; // null
  public paymentType: string; //  null
  public retailerId: string; // "5a9558e28998e6452cb9ed5b"
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

