import { apiNames, commonMessages } from './common';
import { regexPatterns } from '../../common/regexPatterns';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  s3: 'https://s3.us-east-2.amazonaws.com\\',
  Api: 'http://dev-user-service.us-east-2.elasticbeanstalk.com',
  AdminApi: 'http://dev-retailer-service-mongo.us-east-1.elasticbeanstalk.com/retailer/v1',
  // AdminApi: 'http://192.168.169.230:8099/retailer/v1',
  // productApi: 'http://192.168.169.185:9089/api',
  productApi: 'http://dev-product-service.us-east-2.elasticbeanstalk.com/api',
  userApi: 'http://dev-user-signup.us-east-2.elasticbeanstalk.com/user/v1',  
  ordersApi: 'http://dev-orderservice.us-east-1.elasticbeanstalk.com/order/v1',
  // ordersApi: 'http://192.168.169.185:8090/order/v1',
  // paymentApi: 'http://dev-OrderService.us-east-1.elasticbeanstalk.com/payment/v1',
  paymentApi: 'http://192.168.169.230:8090/payment/v1',
  // paymentApi: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/payment/v1',
  consumerApi: 'http://dev-consumer-profile.us-east-2.elasticbeanstalk.com',
  stripePK: 'pk_test_9th9u2YsJ2y1ms60AgtpXoMS',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};
