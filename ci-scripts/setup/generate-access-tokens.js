/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const fs = require('fs');
const path = require('path');
const { auth } = require('@adobe/auth-token');
const supportedCompanyTypes = require('./supportedCompanyTypes.json');

// load main env for client id/secret, etc
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function generateAccessToken(companyType) {
  if (!supportedCompanyTypes.hasOwnProperty(companyType)) {
    console.error(
      `The company type "${companyType}" is not any of the container types
      ${Object.keys(supportedCompanyTypes).join(', ')}`
    );
    process.exit(1);
  }

  let config;
  if (companyType === supportedCompanyTypes.DEFAULT_COMPANY) {
    if (
      !process.env.RSDK_ADOBE_DEFAULT_COMPANY_CLIENT_ID ||
      !process.env.RSDK_ADOBE_DEFAULT_COMPANY_CLIENT_SECRET ||
      !process.env.RSDK_ADOBE_SCOPES ||
      !process.env.RSDK_ADOBE_ENVIRONMENT
    ) {
      console.error(
        'RSDK_ADOBE_DEFAULT_COMPANY_CLIENT_ID, RSDK_ADOBE_DEFAULT_COMPANY_CLIENT_SECRET, RSDK_ADOBE_SCOPES, and ' +
          'RSDK_ADOBE_ENVIRONMENT must be defined to generate the default company access token'
      );
      process.exit(1);
    }
    config = {
      clientId: process.env.RSDK_ADOBE_DEFAULT_COMPANY_CLIENT_ID,
      clientSecret: process.env.RSDK_ADOBE_DEFAULT_COMPANY_CLIENT_SECRET,
      scope: process.env.RSDK_ADOBE_SCOPES,
      environment: process.env.RSDK_ADOBE_ENVIRONMENT
    };
  } else {
    if (
      !process.env.RSDK_ADOBE_PREMIUM_COMPANY_CLIENT_ID ||
      !process.env.RSDK_ADOBE_PREMIUM_COMPANY_CLIENT_SECRET ||
      !process.env.RSDK_ADOBE_SCOPES ||
      !process.env.RSDK_ADOBE_ENVIRONMENT
    ) {
      console.error(
        'RSDK_ADOBE_PREMIUM_COMPANY_CLIENT_ID, RSDK_ADOBE_PREMIUM_COMPANY_CLIENT_SECRET, RSDK_ADOBE_SCOPES, and ' +
          'RSDK_ADOBE_ENVIRONMENT must be defined to generate the premium company access token'
      );
      process.exit(1);
    }
    config = {
      clientId: process.env.RSDK_ADOBE_PREMIUM_COMPANY_CLIENT_ID,
      clientSecret: process.env.RSDK_ADOBE_PREMIUM_COMPANY_CLIENT_SECRET,
      scope: process.env.RSDK_ADOBE_SCOPES,
      environment: process.env.RSDK_ADOBE_ENVIRONMENT
    };
  }

  try {
    const { access_token: freshToken } = await auth(config);
    return freshToken;
  } catch (error) {
    console.error('Failed to generate access token:', error.message);
    process.exit(1);
  }
}

async function main() {
  const [defaultToken, premiumToken] = await Promise.all([
    generateAccessToken(supportedCompanyTypes.DEFAULT_COMPANY),
    generateAccessToken(supportedCompanyTypes.PREMIUM_COMPANY)
  ]);
  const accessTokenDefaultCompanyEnvPath = path.resolve(
    __dirname,
    '.env.access-token-default-company'
  );
  const defaultCompanyContent = `RSDK_DEFAULT_COMPANY_ACCESS_TOKEN=${defaultToken}\n`;
  fs.writeFileSync(
    accessTokenDefaultCompanyEnvPath,
    defaultCompanyContent,
    'utf-8'
  );
  console.log(
    `✅ Wrote fresh ACCESS_TOKEN to ${accessTokenDefaultCompanyEnvPath}`
  );

  const accessTokenPremiumCompanyEnvPath = path.resolve(
    __dirname,
    '.env.access-token-premium-company'
  );
  const content = `RSDK_PREMIUM_COMPANY_ACCESS_TOKEN=${premiumToken}\n`;
  fs.writeFileSync(accessTokenPremiumCompanyEnvPath, content, 'utf-8');
  console.log(
    `✅ Wrote fresh ACCESS_TOKEN to ${accessTokenPremiumCompanyEnvPath}`
  );

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
