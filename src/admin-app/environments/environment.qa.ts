import { apiNames, commonMessages } from './common';
import { regexPatterns } from '../../common/regexPatterns';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  s3: 'https://s3.us-east-2.amazonaws.com\\',
  Api: 'http://qa-user-service.us-west-1.elasticbeanstalk.com',
  AdminApi: 'http://qa-retailer-service.us-west-1.elasticbeanstalk.com/retailer/v1',
  productApi: 'http://qa-product-service.us-west-1.elasticbeanstalk.com/api',
  userApi: 'http://qa-signup-service.us-west-1.elasticbeanstalk.com/user/v1',
  ordersApi: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/order/v1',
  paymentApi: 'http://qa-order-service.us-east-1.elasticbeanstalk.com/payment/v1',
  consumerApi: 'http://qa-consumer-service.us-west-1.elasticbeanstalk.com',
  stripePK: 'pk_test_9th9u2YsJ2y1ms60AgtpXoMS',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};
