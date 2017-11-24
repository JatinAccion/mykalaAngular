import { ProfileInfo } from "./profile-info";
import { PaymentInfo } from "./payment-info";
import { ProductInfo } from "./product-info";
import { ShippingProfile } from "./shipping-profile";

export class Retailer {
    profileInfo: ProfileInfo;
    paymentInfo: PaymentInfo;
    productInfo: ProductInfo;
    shippingProfiles: Array<ShippingProfile>;
    returnPolicy: string;
    orderEmail: string;
    shippingEmail: string;
}
