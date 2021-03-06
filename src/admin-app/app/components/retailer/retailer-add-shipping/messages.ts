export const userMessages = {
    success: 'Shipping Info Saved',
    error: 'Not able to Save',
    deliveryOptions: {
        freeshipping: 'freeshipping',
        ship_by_size: 'ship_by_size',
        ship_by_flat_rate: 'ship_by_flat_rate',
        ship_by_price: 'ship_by_price',
        ship_by_weight: 'ship_by_weight',
    },
    'noShippingmethodselected': 'Atleast one shipping method need to be selected',
    'customShippingmethodName': 'Please enter a custom shipping method name',
    'duplicateShippingName': 'Please enter a valid and unique shipping profile',
    'tierRangesMismatch': 'Please enter a valid min value and max values, min value should be lesser than or equal to max value, max value should be lesser than or equal to next tier min value',
};
export const inputValidations = {
    'shippingProfileName': { required: 'Please enter a profile name ', error: 'Please enter valid profile name' },
    'deliveryOptions': { required: 'Please select atleast one delivery option', error: 'Please enter valid deliveryOptions' },
    'min': { required: 'Please enter min value', error: 'Please enter valid min value' },
    'max': { required: 'Please enter max value', error: 'Please enter valid max value' },
    'charge': { required: 'Please enter charge value', error: 'Please enter valid charge value' },
    'locationFee': { required: 'Please enter location Fee value', error: 'Please enter valid location Fee value' },

    'address1': { required: 'Please enter Address line 1', error: 'Please enter valid Address line 1' },
    'address2': { required: 'Please enter Address line 2', error: 'Please enter valid Address line 2' },
    'city': { required: 'Please enter City', error: 'Please enter valid City' },
    'state': { required: 'Please enter State', error: 'Please enter valid State' },
    'zipcode': { required: 'Please enter Zipcode', error: 'Please enter valid Zipcode' },
};

