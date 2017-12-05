export const apiNames = {
    Auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'auth/oauth/token'
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
    }
};
