const fs = require('fs');
const dotenv = require('dotenv');

const result = dotenv.config({ path: '.env' });
const fromFile = result.parsed || {};
const baseUrl = (process.env.API_BASE_URL || fromFile.baseUrl || '').replace(/\/$/, '');

if (!baseUrl) {
  throw new Error('Set baseUrl in .env, or API_BASE_URL in the environment.');
}

const envConfigFile = `export const environment = ${JSON.stringify({
  baseUrl,
  production: true,
})};\n`;

fs.writeFileSync('./src/environments/environment.prod.ts', envConfigFile);
console.log('.env variables set successfully!');
