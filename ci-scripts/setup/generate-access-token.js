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

// load main env for client id/secret, etc
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function generateAccessToken() {
  if (
    !process.env.RSDK_ADOBE_CLIENT_ID ||
    !process.env.RSDK_ADOBE_CLIENT_SECRET ||
    !process.env.RSDK_ADOBE_SCOPES ||
    !process.env.RSDK_ADOBE_ENVIRONMENT
  ) {
    console.error(
      'RSDK_ADOBE_CLIENT_ID, RSDK_ADOBE_CLIENT_SECRET, RSDK_ADOBE_SCOPES, and ' +
        'RSDK_ADOBE_ENVIRONMENT must be defined to generate access token'
    );
    process.exit(1);
  }

  try {
    const config = {
      clientId: process.env.RSDK_ADOBE_CLIENT_ID,
      clientSecret: process.env.RSDK_ADOBE_CLIENT_SECRET,
      scope: process.env.RSDK_ADOBE_SCOPES,
      environment: process.env.RSDK_ADOBE_ENVIRONMENT
    };

    const { access_token: freshToken } = await auth(config);
    return freshToken;
  } catch (error) {
    console.error('Failed to generate access token:', error.message);
    process.exit(1);
  }
}

async function main() {
  const accessToken = await generateAccessToken();
  const accessTokenEnvPath = path.resolve(__dirname, '.env.access-token');
  const content = `RSDK_ACCESS_TOKEN=${accessToken}\n`;

  fs.writeFileSync(accessTokenEnvPath, content, 'utf-8');
  console.log(`✅ Wrote fresh ACCESS_TOKEN to ${accessTokenEnvPath}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
