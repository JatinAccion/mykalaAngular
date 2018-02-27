export class ProductCheckout {
    public cutomerId: string;
    public userId: string;
    public source: string;
    public paymentSource: string;
    public paymentFunding: string;
    public last4Digits: string;
    public customerName: string;
    public address = new Address();
    public purchasedDate: Date;
    public orderItems = Array<OrderItems>();
    public purchasedPrice: number;
    public totalTaxCost: number;
    public totalShipCost: number
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
        public deliveryMethod: string
    ) { }
}