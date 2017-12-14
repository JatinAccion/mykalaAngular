export const apiNames = {
    Auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token'
    },
    retailers: {
        get: 'retailer/allRetailers',
        sellerTypes: 'retailer/sellerType',

    },
    retailerProfileInfo: {
        get: 'retailerProfileInfo/get',
        save: 'retailer/saveRetailer',
        delete: 'delete',
    },
    retailerPaymentInfo: {
        get: 'retailerPaymentInfo/get',
        save: 'retailer/saveBankDetails',
        delete: 'delete',
    },
    retailerShippingInfo: {
        get: 'retailerShippingInfo/get',
        save: 'retailer/saveShippingProfile',
        delete: 'delete',
    },
    retailerShippingNotification: {
        get: 'retailer/getShippingNotifications',
        save: 'retailer/saveShippingNotifications',
        delete: 'delete',
    },
    retailerShippingReturnPolicy: {
        get: 'retailer/getShippingReturnPolicy',
        save: 'retailer/saveShippingReturnPolicy',
        delete: 'delete',
    }
};
export const commonMessages = {
    error404: 'Server is not available',
};

