import { ProductPlace, ProductCategory, ProductSubCategory, ProductType } from './product-info';
import { Pagination } from './pagination';
import { environment } from '../admin-app/environments/environment';
export class Product {
    public retailerId: string;
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
    public lowestPrice: number;
    public quantity: number;
    public shippingProfileId: string;
    public productStatus: boolean | null = true;
    public productActivatedDate: Date | null;
    public createdDate: Date | null;
    public productImages: ProductImage[] | null = new Array<ProductImage>();

    public productPlace: ProductPlace;
    public productCategory: ProductCategory;
    public productSubCategory: ProductSubCategory;
    public productType: ProductType;
    public isCollapsed: boolean | null = true;
    public mainImage: ProductImage;
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
            this.shippingProfileId = obj.shippingProfileId;
            this.productStatus = obj.productStatus;
            this.productActivatedDate = obj.productActivatedDate;
            this.createdDate = obj.createdDate;
            this.productImages = obj.productImages ? obj.productImages.map(p => new ProductImage(p)) : new Array<ProductImage>();
            this.mainImage = this.productImages[0]; // .filter(p => p.mainImage === true)[0];
            if (!this.mainImage) {
                delete this.mainImage;
            }
        } else {
            this.productStatus = true;
        }
    }
}
export class ProductImage {
    public imageType: string;
    public imageUrl: string;
    public mainImage: boolean | null = false;
    constructor(obj?: any) {
        this.imageType = obj.imageType;
        this.imageUrl = environment.s3 + obj.imageUrl;
        this.mainImage = obj.mainImage;
    }
}
export class Products extends Pagination {
    constructor(obj?: any) {
        if (obj) {
            super(obj);
            this.content = obj.content.map(p => new Product(p));
        }
    }
    public content: Product[];
}
