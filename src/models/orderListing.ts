export class OrderListing {
    public retailerId: string;
    public retailerName: string;
    public differentShippingMethod: boolean;
    public orderItems = new Array<Orders>()
}

export class Orders {
    constructor(
        public inStock: number,
        public price: number,
        public productDescription: string,
        public productId: string,
        public productImage: string,
        public productName: string,
        public quantity: number,
        public shipProfileId: string,
        public taxCost: number,
        public taxCode: string,
        public retailerIntegrationMethod: string
    ) { }
}