import { BusinessAddress } from './business-address';
import { ProductPlace, ProductCategory, ProductSubCategory } from './product-info';
export class SellOnKala {
    public compName: string;
    public businessAddress: BusinessAddress;
    public name: string;
    public email: BusinessAddress;
    public phoneNo: string;
    public extraInfo?:string;
    public productInfo:Array<ProductInfo>
    constructor() { }
}
export class ProductInfo {
    public productPlaces:Array<ProductPlace>;
    public noOfProducts:MinMax;
    constructor(prodPlaces : any,  nop: any) {
        this.productPlaces = prodPlaces;
        this.noOfProducts = nop;
     }
}
export class SellerInfo {
    public taxIdNumber : Number;
    public noOfProducts:Number;
    public IsRegisteredInUS:boolean;
    public integrationMethod:string;
}
export class MinMax{
    public min : Number;
    public max : Number;
}
