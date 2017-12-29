import { PostalAddress } from './retailer-business-adress';

export class RetialerShippingProfile {
    retailerId: number;
    shipId: number;
    sequence: number;
    profileName: string;
    deliveryOption: string;
    deliveryTiers: Array<ShippingDeliveryTier>;
    shipOriginAddress: RetailerAddress;
    shipLocations: ShippingLocations;
    step: number;
    status: boolean;
    constructor() {
        this.deliveryTiers = new Array<ShippingDeliveryTier>();
        this.shipOriginAddress = new RetailerAddress();
        this.shipLocations = new ShippingLocations();
        this.step = 1;
    }
}

export class ShippingDeliveryTier {
    constructor() { }
    public tierName: string;
    public minValue: number;
    public maxValue: number;
    public sequence: number;
    public shippingMethod: RetailerShippingMethodFee[];

}
export class RetailerAddress extends PostalAddress { }
export class ShippingLocations {
    public countryName: string;
    public locationInclude: ShippingSubLocation[];
}
export class ShippingSubLocation {
    public locationName: string;
    public locationType: string;
    public locationStatus: boolean;
    public locationFee: number;
}
export class RetailerShippingMethodFee {
    public shipMethodId: number;
    public shipMethodName: string;
    public deliveryFee: number;
}
// {
//     "shipOriginAddress": {
//         "addressLine1": "",
//         "addrsesLine2": "",
//         "city": "",
//         "state": "",
//         "zipcode": ""
//     },

//     "shipLocations": {
//         "countryName": "",
//         "locationInclude": [{
//             "locationName": "",
//             "locationType": "",
//             "locationFee": ""
//         }]
//     }
//     "shippingProfile": {
//         "deliveryTier": [{
//             "tierName": "",
//             "minValue": "",
//             "maxValue": "",
//             "sequence": "",
//             "shippingMethod": [{
//                 "shipMethodName": "",
//                 "deliveryFee": ""
//             }]
//         }],
//         "deliveryOption": "flat rate",
//         "sequence": 1,
//         "retailerId": "1234"
//         "profileName": "ship_profile_1",
    // }
// }