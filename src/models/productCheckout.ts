export class ProductCheckout {
    public cutomerId: string;
    public userId: string;;
    public customerName: string;
    public address = new Address();
    public orderDate: Date;
    public payment = new Payment();
    public orderItems = Array<OrderItems>();
    public totalPrice: number;
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