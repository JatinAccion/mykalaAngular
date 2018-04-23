import { ProductPlace, ProductCategory, ProductSubCategory, ProductType, ProductTypeLevels } from './product-info';
import { Pagination } from './pagination';
import { environment } from '../admin-app/environments/environment';
export class Product {
    public retailerId: string;
    public retailerName: string;

    public kalaUniqueId: string;
    public productSkuCode: string;
    public productUpcCode: string;
    public productName: string;
    // public brandName: string;
    public productDescription: string;
    public productPlaceName: string;
    public productCategoryName: string;
    public productSubCategoryName: string;
    public productTypeName: string;
    public productHierarchy: Array<ProductType>;

    public retailPrice: number;
    public kalaPrice: number;
    public lowestPrice: number;
    public quantity: number;
    public shipProfileId: string;
    public shippingProfile: string;
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
    public otherImages: ProductImage[] | null = new Array<ProductImage>();
    public attributes: Map<string, object>;
    public taxCode: string;
    public reviewCount: number;
    public weight: number;
    public weightunit: string;
    public dimensionunit: string;
    public length: number;
    public height: number;
    public width: number;
    public productTypeLevels: ProductTypeLevels;
    constructor(obj?: any) {
        this.otherImages = new Array<ProductImage>();
        this.productImages = new Array<ProductImage>();
        this.attributes = new Map<string, object>();
        this.productHierarchy = new Array<ProductType>();
        this.productTypeLevels = new ProductTypeLevels();
        if (obj) {
            this.retailerId = obj.retailerId;
            this.retailerName = obj.retailerName;
            this.kalaUniqueId = obj.kalaUniqueId;
            this.productSkuCode = obj.productSkuCode;
            this.productUpcCode = obj.productUpcCode;
            this.productName = obj.productName;
            this.brandName = obj.brandName;
            this.productDescription = obj.productDescription;
            this.productPlaceName = obj.productPlaceName;
            this.productCategoryName = obj.productCategoryName;
            this.productSubCategoryName = obj.productSubCategoryName;
            // this.productTypeName = obj.productTypeName;
            if (obj.productHierarchy) {
                this.productHierarchy = obj.productHierarchy.map(p => new ProductType(p));
                if (this.productHierarchy && this.productHierarchy.filter(p => p.parentName === this.productSubCategoryName).length > 0) {
                    this.productTypeName = this.productHierarchy.filter(p => p.parentName === this.productSubCategoryName)[0].productTypeName;
                }
            }
            this.retailPrice = obj.retailPrice;
            this.kalaPrice = obj.kalaPrice;
            this.lowestPrice = obj.lowestPrice;
            this.quantity = obj.quantity;
            this.shipProfileId = obj.shipProfileId;
            this.shippingProfile = obj.shippingProfile;
            this.productStatus = obj.productStatus;
            this.productActivatedDate = obj.productActivatedDate;
            this.createdDate = obj.createdDate;
            this.taxCode = obj.taxCode;
            this.weight = obj.weight;
            this.weightunit = obj.weightunit;
            this.dimensionunit = obj.dimensionunit;
            this.length = obj.length;
            this.height = obj.height;
            this.width = obj.width;
            if (obj.attributes) {
                this.attributes = obj.attributes;
                this.brandName = obj.attributes.Brand;
                // this.productTypeName = obj.attributes.Type;
            }

            this.productImages = obj.productImages ? obj.productImages.filter(p => p.location !== null).map(p => new ProductImage(p)) : new Array<ProductImage>();
            for (let index = 0; index < this.productImages.length; index++) {
                if (this.productImages[index].mainImage) {
                    this.mainImage = this.productImages[index];
                } else {
                    this.otherImages.push(this.productImages[index]);
                }
            }
            if (!this.mainImage) {
                delete this.mainImage;
            }
        } else {
            this.productStatus = true;
        }
    }

    set brandName(val: string) {
        if (this.attributes) {
            this.attributes['Brand'] = val;
        }
    }
    get brandName(): string {
        return this.attributes['Brand'];
    }
}
export class ProductImage {
    public id: string;
    public imageType: string;
    public location: string;
    public mainImage: boolean | null = false;
    public imageUrl: string;
    constructor(obj?: any) {
        this.id = obj.id;
        this.imageType = obj.imageType;
        this.location = obj.location;
        this.imageUrl = obj.location.toLowerCase().startsWith('https://') ? obj.location : (environment.s3 + obj.location);
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
