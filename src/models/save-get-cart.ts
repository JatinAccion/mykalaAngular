export class SaveGetCartItems {
    constructor(
        public userId: string,
        public label: string,
        public retailerId: string,
        public retailerName: string,
        public productId: string,
        public productName: string,
        public price: number,
        public quantity: number,
        public inStock: number,
        public productImage: string,
        public taxCode: string,
        public productSKUCode: string,
        public productUPCCode: number,
        public width: number,
        public height: number,
        public length: number,
        public weight: number,
        public shipProfileId: string,
        public productDescription: string
    ) { }
}