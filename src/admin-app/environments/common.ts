export const apiNames = {
    Auth: {
        login: 'login',
        register: 'register',
        status: 'status',
        token: 'oauth/token',
        userInfo: 'loginUser'
    },
    users: {
        resetPassword: 'login/user/resetPassword',
        getAdmin: 'role/ROLE_ADMIN',
        get: '{userId}',
        save: 'admin',
        delete: '{userId}',
    },
    retailers: {
        get: '',
        sellerTypes: 'sellerTypes',
        getShippingProfileNames: '{retailerId}/shippingProfileName',
        changeStatus: 'changeStatus',
        getRetailerNames: 'sellerName'
    },
    retailerProfileInfo: {
        get: '{retailerId}',
        save: 'retailerProfiles',
        delete: 'delete',
    },
    retailerPaymentInfo: {
        get: '{retailerId}/bankDetails',
        save: 'bankDetails',
        delete: 'delete',
    },
    retailerShippingInfo: {
        get: '{retailerId}/shippingProfiles',
        save: 'shippingProfiles',
        delete: 'delete',
    },
    retailerShippingNotification: {
        get: '{retailerId}/shippingNotifications',
        save: 'shippingNotifications',
        delete: 'delete',
    },
    retailerShippingReturnPolicy: {
        get: '{retailerId}/shippingReturns',
        save: 'shippingReturns',
        delete: 'delete',
    },
    retailerTax: {
        get: '{retailerId}/taxNexus',
        save: 'taxNexus',
        delete: 'delete',
    },
    retailerProduct: {
        get: '{retailerId}/productPreferences',
        save: 'productPreferences',
        delete: 'delete',
    },
    product: {
        get: 'products/filterBy',
        save: 'products/save',
        saveImage: 'products/saveImages',
        changeMainImage: 'products/changeMainImage',
        delete: 'products/delete',
        places: 'products/places',
        categories: 'products/categoriesList',
        subCategories: 'products/subCategoriesList',
        types: 'products/typesList'
    },

};
export const commonMessages = {
    error404: 'Server is not available',
};

