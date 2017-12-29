export class Product {
    public retailerId: number;
    public retailerName: string;

    public kalaUniqueId: string;
    public productSkuCode: string;
    public productUpcCode: string;
    public productName: string;
    public brandName: string;
    public productDescription: string;
    public productPlaceName: string;
    public productCategoryName: string;
    public productSubCategoryName: string;
    public productTypeName: string;
    public retailPrice: number;
    public kalaPrice: number;
    public quantity: number;
    public shipProfileId: number;


    constructor(obj?: any) {
        if (obj) {
            this.retailerId = obj.retailerId;
            this.kalaUniqueId = obj.kalaUniqueId;
            this.productSkuCode = obj.productSkuCode;
            this.productUpcCode = obj.productUpcCode;
            this.productName = obj.productName;
            this.brandName = obj.brandName;
            this.productDescription = obj.productDescription;
            this.productPlaceName = obj.productPlaceName;
            this.productCategoryName = obj.productCategoryName;
            this.productSubCategoryName = obj.productSubCategoryName;
            this.productTypeName = obj.productTypeName;
            this.retailPrice = obj.retailPrice;
            this.kalaPrice = obj.kalaPrice;
            this.quantity = obj.quantity;
            this.shipProfileId = obj.shipProfileId;
        }
    }
}
