export const apiNames = {
    Auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token',
        userInfo: 'loginUser'
    },
    retailers: {
        get: 'retailer/getReatilerByName',
        sellerTypes: 'retailer/sellerType',
        getShippingProfileNames: 'retailer/getShippingProfileName',
        changeStatus: 'retailer/changeStatus'
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
    },
    retailerProduct: {
        getPlaces: 'retailer/getShippingReturnPolicy',
        getCategories: 'retailer/getShippingReturnPolicy',
        getSubCategories: 'retailer/getShippingReturnPolicy',
        getTypes: 'retailer/getShippingReturnPolicy',

        save: 'retailer/saveShippingReturnPolicy',
        delete: 'delete',
    },
    product: {
        get: 'filterBy',
        save: 'save',
        saveImage: 'saveImages',
        changeMainImage: 'changeMainImage',
        delete: 'delete',
        places: 'places',
        categories: 'categoriesList',
        subCategories: 'subCategoriesList',
        types: 'typesList'
    },

};
export const commonMessages = {
    error404: 'Server is not available',
};

