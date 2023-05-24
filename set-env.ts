const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
const result = dotenv.config({ path: '.env' });

if (result.error) {
  throw result.error;
}
result.parsed['production'] = true
// Convert environment variables to string format
const envConfigFile = `export const environment = ${JSON.stringify(result.parsed)};`;

// Create environment.ts file
fs.writeFile('./src/environments/environment.prod.ts', envConfigFile, (err) => {
  if (err) {
    throw err;
  }
  console.log('.env variables set successfully!');
});
