import { ProductPlace, ProductCategory, ProductSubCategory, ProductType, ProductTypeLevels, ProductLevel } from './product-info';
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
    public productPlaceId: string;
    public productCategoryName: string;
    public productCategoryId: string;
    public productSubCategoryName: string;
    public productSubCategoryId: string;
    public productTypeName: string;
    public productTypeId: string;
    public productHierarchy: Array<ProductLevel>;

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
        this.productHierarchy = new Array<ProductLevel>();
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
                this.productHierarchy = obj.productHierarchy.map(p => new ProductLevel(p)).sort((a, b) => a < b);
                if (this.productHierarchy.length > 0) { this.productPlaceId = this.productHierarchy[0].levelId; this.productPlaceName = this.productHierarchy[0].levelName; }
                if (this.productHierarchy.length > 1) { this.productCategoryId = this.productHierarchy[1].levelId; this.productCategoryName = this.productHierarchy[1].levelName; }
                if (this.productHierarchy.length > 2) { this.productSubCategoryId = this.productHierarchy[2].levelId; this.productSubCategoryName = this.productHierarchy[2].levelName; }
                if (this.productHierarchy.length > 3) { this.productTypeId = this.productHierarchy[3].levelId; this.productTypeName = this.productHierarchy[3].levelName; }
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
            this.weightunit = obj.weightunit || 'lbs';
            this.dimensionunit = obj.dimensionunit || 'inches';
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
    get attributesList(): Array<ProdAttr> {
        if (this.attributes) {
            const attributeList = Object.entries(this.attributes).map(p => new ProdAttr(p));
            attributeList.removeAll(p => p.key.toLowerCase() === 'unit' || p.key.toLowerCase() === 'features');
            return attributeList;
        } return new Array<ProdAttr>();
    }

    get featuresList(): Array<string> {
        if (this.attributes && this.attributes['Features']) {
            return this.attributes['Features'];
        } return [];
    }

    getAttributesList_AttrType(attributesMasterData?: Map<string, Array<string>>): Array<ProdAttr> {
        if (this.attributes) {
            const attributeList = Object.entries(this.attributes).map(p => new ProdAttr(p));
            for (let i = 0; i < attributeList.length; i++) {
                const element = attributeList[i];
                switch (element.key.toLowerCase()) {
                    case 'size':
                        element.attrType = 'string';
                        break;
                    case 'unit':
                        element.attrType = 'hidden';
                        break;
                    case 'features':
                        element.attrType = 'array';
                        break;
                    default:
                        if (attributesMasterData && attributesMasterData[element.key]) {
                            element.attrType = 'select';
                        }
                        break;
                }
            }
            return attributeList;
        }
        return new Array<ProdAttr>();
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
export class ProdAttr {
    public key: string;
    public value: any;
    public strValue: string;
    public numValue: number;
    public values: string[];
    public placeholder: string;
    public attrType: string;
    constructor(obj?: any) {
        if (obj) {
            this.key = obj[0];
            this.placeholder = `${obj[0]}`;
            const val = obj[1];
            this.value = val;
            this.attrType = 'string'; // typeof val;
            switch (typeof val) {
                case 'string':
                    this.strValue = val;
                    break;
                case 'number':
                    this.numValue = val;
                    break;
                case 'object':
                    if (Array.isArray(val)) {
                        this.values = val;
                        this.attrType = 'array';
                    } else {
                        // this.value = JSON.stringify(val);
                    }
                    break;
                default:
                    // this.value = JSON.stringify(val);
                    break;
            }
        }
    }
}
export class ProductAttributesMasterData {
    public attributes: Map<string, Array<string>>;
    constructor(obj?: any) {
        this.attributes = new Map<string, Array<string>>();
        if (obj && obj.attributes) {
            Object.keys(obj.attributes).forEach(key => {
                this.attributes[key] = obj.attributes[key];
            });
        }
    }
}
