import { apiNames, commonMessages } from './common';
import { regexPatterns } from '../../common/regexPatterns';

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  Api: 'http://localhost:8081',
  AdminApi: 'http://192.168.168.227:9083',
  productApi: 'http://localhost:8086',
  apis: apiNames,
  regex: regexPatterns,
  commonMsg: commonMessages
};
