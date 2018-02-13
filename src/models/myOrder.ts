export class MyOrders {
    constructor(
        public deliveryMethod: string,
        public orderShippingCost: string,
        public orderTaxCost: string,
        public productDescription: string,
        public productId: string,
        public productImage: string,
        public productName: string,
        public productPrice: number,
        public retailerName: string,
        public purchaseDate: Date,
        public purchaseAmount: number,
        public last4Digits: string,
        public paymentSource: string,
        public userId: string,
        public customerName: string,
        public customerId: string,
        public address = new Address(),
        public payment = new Payment()
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