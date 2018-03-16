export class MyOrders {
    constructor(
        public customerOrderStatus: string,
        public customerId: string,
        public userId: string,
        public source: string,
        public paymentSource: string,
        public paymentFunding: string,
        public last4Digits: string,
        public customerName: string,
        public address = new Address(),
        public purchasedDate: Date,
        public orderItems = Array<OrderItems>(),
        public purchasedPrice: number,
        public totalTaxCost: number,
        public totalShipCost: number,
        public orderId: string,
        public payment = new Payment(),
        public leaveReview?: boolean,
        public contactSupport?: boolean,
        public cancelOrder?: boolean,
        public trackOrder?: boolean
    ) { }
}

export class OrderItems {
    constructor(
        public productId: string,
        public productName: string,
        public retailerName: string,
        public retailerId: string,
        public productDescription: string,
        public productImage: string,
        public productQuantity: number,
        public productPrice: number,
        public productTaxCost: number,
        public shippingCost: number,
        public totalProductPrice: number,
        public deliveryMethod: string,
        public productItemStatus: string,
        public leaveReview?: boolean,
        public contactSupport?: boolean,
        public cancelOrder?: boolean,
        public trackOrder?: boolean
    ) { }
}

export class Payment {
    public paymentAmount: number;
    public paymentDate: Date;
    public paymentNumber: string;
    public paymentStatus: string;
    public transactionNumber: string;
}

export class Address {
    public addID: string;
    public addressLineOne: string;
    public addressLineTwo: string;
    public city: string;
    public state: string;
    public zipcode: string;
    public addressType: string
}