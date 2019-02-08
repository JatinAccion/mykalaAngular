import { SellerBusinessAddress } from './seller-business-address';

export class SellOnKala {
    public compName: string;
    public businessAddress: SellerBusinessAddress;
    public name: string;
    public extraInfo?:string;
    public productPlaces:Array<ProductPlaceSOK>;
    public minNoOfProducts:Number;
    public maxNoOfProducts : Number;
    public taxIdNumber : Number;
    public IsRegisteredInUS:boolean;
    public integrationMethod:string;
    public doShipProds :boolean;
    public regInUS :boolean;
    public prefIntMeth : string;
    constructor() { }
}
export class ProductPlaceSOK {
    public placeId: string;
    public placeName: string;
    constructor(obj?: any) {
        if (obj) {
            this.placeId = obj.placeId;
            this.placeName = obj.placeName;
        }
    }
}