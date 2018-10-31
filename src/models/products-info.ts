export class ProductsInfo {
    attributes: {};
    kalaUniqueId: string;
    retailerId: string;
    retailerName: string;
    productSkuCode: string;
    productUpcCode: number;
    brandName: string;
    productName: string;
    productDescription: string;
    productPlaceName: string;
    productCategoryName: string;
    productSubCategoryName: string;
    productTypeName: string;
    retailPrice: number;
    kalaPrice: number;
    quantity: number;
    shipProfileId: string;
    productStatus: boolean;
    productActivatedDate: string;
    createdDate: string;
    productImages: Array<any>;
    mainImageSrc: string;
    taxCode: string;
    length: number;
    height: number;
    width: number;
    weight: number;
    productHierarchy: any;
    offerPrice: number;
    productAttributes: string;
    productHierarchyWithIds: Array<any>;
    constructor(obj?: any) {
        this.productImages = new Array<any>();
        if (obj) {
            this.attributes = obj.attributes;
            this.brandName = obj.brandName;
            this.createdDate = obj.createdDate;
            this.kalaPrice = obj.kalaPrice;
            this.kalaUniqueId = obj.kalaUniqueId;
            this.productActivatedDate = obj.productActivatedDate;
            this.productCategoryName = obj.productCategoryName;
            this.productDescription = obj.productDescription;
            this.productName = obj.productName;
            this.productPlaceName = obj.productPlaceName;
            this.productSkuCode = obj.productSkuCode;
            this.productStatus = obj.productStatus;
            this.productSubCategoryName = obj.productSubCategoryName;
            this.productTypeName = obj.productTypeName;
            this.productUpcCode = obj.productUpcCode;
            this.quantity = obj.quantity;
            this.retailPrice = obj.retailPrice;
            this.retailerId = obj.retailerId;
            this.retailerName = obj.retailerName;
            this.shipProfileId = obj.shipProfileId;
            this.productImages = obj.productImages;
            this.taxCode = obj.taxCode;
            this.length = obj.length;
            this.height = obj.height;
            this.weight = obj.weight;
            this.width = obj.width;
            this.mainImageSrc = '';
            this.productHierarchyWithIds = obj.productHierarchy;
            this.productHierarchy = `${obj.productPlaceName},${obj.productCategoryName},${obj.productSubCategoryName}`;
            this.offerPrice = obj.offerPrice;
            if (obj.attributes != undefined && Object.keys(obj.attributes).length > 0) {
                this.productAttributes = `Color:${obj.attributes.Color},Brand:${obj.attributes.Brand},Size:${obj.attributes.Size}`
            }
        }
    }
}