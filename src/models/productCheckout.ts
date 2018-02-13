export class ProductCheckout {
    public cutomerId: string;
    public userId: string;
    public source: string;
    public paymentSource: string;
    public paymentFunding: string;
    public last4Digits: string;
    public customerName: string;
    public address = new Address();
    public purchaseDate: Date;
    public payment = new Payment();
    public orderItems = Array<OrderItems>();
    public purchaseAmount: number;
};

export class Address {
    public addID: string;
    public addressLineOne: string;
    public addressLineTwo: string;
    public city: string;
    public state: string;
    public zipcode: string;
    public addressType: string;
}

export class Payment {
    public purchasedAmount: number;
    public paymentAmount: number;
}

export class OrderItems {
    constructor(
        public productId: string,
        public productName: string,
        public retailerName: string,
        public retailerId: string,
        public productDescription: string,
        public productPrice: number,
        public orderTaxCost: number,
        public orderShippingCost: number,
        public deliveryMethod: string
    ) { }
}