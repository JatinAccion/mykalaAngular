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
      if (obj.content) {
        this.content = obj.content.map(p => new ReportOrder(p));
      } else {
        this.content = new Array<ReportOrder>();
      }
    }
  }
  public content: ReportOrder[];
}
export const OrderStatus = {
  ORDERPENDING: 'ORDERPENDING',
  ORDERPROCESSED: 'ORDERPROCESSED',
  ORDERCANCELLED: 'ORDERCANCELLED',
  ORDERSHIPPED: 'ORDERSHIPPED',
  ORDERDELIVERED: 'ORDERDELIVERED',
};
export class RetailerOrder {
  sellerOrderId: string;
  orderId: string;
  orderStatus: string;
  retailerId: string;
  retailerName: string;
  customerName: string;
  orderDate: string;
  orderAmount: number;
  shippingCost: number;
  products: Array<ProductOrderStatus>;
  sellerPaymentAmount: string;
  issue: string;
  orderProcessedDate: Date;
  orderShippedDate: Date;
  orderDeliveredDate: Date;
  stringShipmentDate: any;
  isCollapsed: boolean;

  constructor(obj?: any) {
    this.products = new Array<ProductOrderStatus>();
    this.isCollapsed = true;
    if (obj) {
      this.sellerOrderId = obj.sellerOrderId;
      this.orderId = obj.orderId;
      this.retailerId = obj.retailerId;
      this.retailerName = obj.retailerName;
      this.customerName = obj.customerName;
      this.orderDate = obj.orderDate;
      this.orderAmount = obj.orderAmount;
      this.shippingCost = obj.shippingCost;
      this.orderProcessedDate = obj.orderProcessedDate;
      this.orderShippedDate = obj.orderShippedDate;
      this.orderDeliveredDate = obj.orderDeliveredDate;
      this.stringShipmentDate = obj.stringShipmentDate;
      if (obj.products) {
        this.products = obj.products.map(p => new ProductOrderStatus(p));
        this.orderStatus = this._OrderStatus;
      }
      this.sellerPaymentAmount = obj.sellerPaymentAmount;
      this.issue = obj.issue;

    }
  }
  set _ProductStatusShipped(productId: string) {
    const product = this.products.firstOrDefault(p => p.productId === productId);
    product.productItemStatus = OrderStatus.ORDERSHIPPED;
  }
  get _OrderStatus() {
    if (this.products && this.products.length > 0) {
      const count = this.products.filter(p => p.productItemStatus !== OrderStatus.ORDERCANCELLED).length;
      const cancelled = this.products.filter(p => p.productItemStatus === OrderStatus.ORDERCANCELLED).length;
      const pending = this.products.filter(p => p.productItemStatus === OrderStatus.ORDERPENDING).length;
      const processed = this.products.filter(p => p.productItemStatus === OrderStatus.ORDERPROCESSED).length;
      const shipped = this.products.filter(p => p.productItemStatus === OrderStatus.ORDERSHIPPED).length;
      const delivered = this.products.filter(p => p.productItemStatus === OrderStatus.ORDERDELIVERED).length;
      switch (true) {
        case count === 0:
          this.orderStatus = 'Cancelled';
          break;
        case count === delivered:
          this.orderStatus = 'Delivered';
          break;
        case count === shipped + delivered:
          this.orderStatus = 'Shipped';
          break;
        case count === processed + shipped + delivered:
          this.orderStatus = 'Processed';
          break;
        case count === pending + processed + shipped + delivered:
          this.orderStatus = 'Pending';
          break;
        default:
          this.orderStatus = 'Pending';
          break;
      }
    }
    return this.orderStatus;
  }
}

export class RetailerOrders extends Pagination {
  constructor(obj?: any) {
    if (obj && obj.length > 0) {
      super(obj[0]);
      this.content = obj.map(p => new RetailerOrder(p));
    } else {
      this.content = new Array<RetailerOrder>();
    }
  }
  public content: RetailerOrder[];
}
export class ProductOrderStatus {
  public productId: string;
  public productName: string;
  public productItemStatus: string;
  public trackingNumber: string;
  public selected: boolean;
  constructor(obj?: any) {
    if (obj) {
      this.productId = obj.productId;
      this.productName = obj.productName;
      this.productItemStatus = obj.productItemStatus;
      this.trackingNumber = obj.trackingNumber;
    }
  }
}
export class ReportPaymentData {
  public connectAccountId: string;
  public kalaCommissionFee: number;
  public orderAmount: number;
  public orderDate: Date;
  public orderId: string;
  public orderItemId: string;
  public orderTransactionId: string;
  public paymentArrivalDate: Date;
  public paymentInitiatedDate: Date;
  public paymentStatus: string;
  public paymentType: string;
  public paytoSeller: boolean;
  public retailerId: string;
  public retailerName: string;
  public sellerPaymentAmount: number;
  public sellerShipmentStatus: string;
  public transferGroup: string;
  public transferId: string;
  constructor(obj?: any) {
    if (obj) {
      this.connectAccountId = obj.connectAccountId;
      this.kalaCommissionFee = obj.kalaCommissionFee;
      this.orderAmount = obj.orderAmount;
      this.orderDate = obj.orderDate;
      this.orderId = obj.orderId;
      this.orderItemId = obj.orderItemId;
      this.orderTransactionId = obj.orderTransactionId;
      this.paymentArrivalDate = obj.paymentArrivalDate;
      this.paymentInitiatedDate = obj.paymentInitiatedDate;
      this.paymentStatus = obj.paymentStatus;
      this.paymentType = obj.paymentType;
      this.paytoSeller = obj.paytoSeller;
      this.retailerId = obj.retailerId;
      this.retailerName = obj.retailerName;
      this.sellerPaymentAmount = obj.sellerPaymentAmount;
      this.sellerShipmentStatus = obj.sellerShipmentStatus;
      this.transferGroup = obj.transferGroup;
      this.transferId = obj.transferId;
    }
  }
}

export class ReportPaymentDatas extends Pagination {
  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.content = obj.content.map(p => new ReportPaymentData(p));
    }
  }
  public content: ReportPaymentData[];
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
  trackingNumber: string;
  shipTrackingId: string;
  orderProcessedDate: Date;
  orderShippedDate: Date;
  orderDeliveredDate: Date;
  stringShipmentDate: any;
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
      this.trackingNumber = obj.trackingNumber;
      this.shipTrackingId = obj.shipTrackingId;
      this.orderProcessedDate = obj.orderProcessedDate;
      this.orderShippedDate = obj.orderShippedDate;
      this.orderDeliveredDate = obj.orderDeliveredDate;
      this.stringShipmentDate = obj.stringShipmentDate;
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

export class ReportProductSold {
  productHierarchy: string;
  productPlace: string;
  productCategory: string;
  productSubCategory: string;
  totalproduct: number;

  constructor(obj?: any) {
    if (obj) {
      this.totalproduct = obj.totalproduct;
      if (obj.orderItems) {
        this.productHierarchy = obj.orderItems.productHierarchy;
        if (this.productHierarchy) {
          const splits = this.productHierarchy.split(',');
          this.productPlace = splits[0];
          this.productCategory = splits[1];
          this.productSubCategory = splits[2];
        }
      }
    }
  }
}

export class ReportProductSolds extends Pagination {
  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.content = obj.content.map(p => new ReportProductSold(p));
    }
  }
  public content: ReportProductSold[];
}

export class ShippingTracking {
  public orderId: string;
  public retailerOrderId: string;
  public retailerName: string;
  public trackingNumber: string;
  public carrier: string;
  public productSKU: Array<string>;
  public productIds: Array<string>;
  public shipmentDate: any; // "2018-05-16"
  public stringShipmentDate: any;
  constructor(obj?: any) {
    this.productSKU = new Array<string>();
    this.productIds = new Array<string>();
    if (obj) {
      this.orderId = obj.orderId;
      this.retailerName = obj.retailerName;
      this.trackingNumber = obj.trackingNumber;
      this.carrier = obj.carrier;
      if (obj.productSKU && obj.productSKU.length > 0) {
        this.productSKU = obj.productSKU;
      }
      if (obj.productIds && obj.productIds.length > 0) {
        this.productIds = obj.productIds;
      }
      this.shipmentDate = obj.shipmentDate;
      this.stringShipmentDate = obj.stringShipmentDate;
    }
  }
}

