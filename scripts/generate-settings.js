#!/usr/bin/env node

/**
 * Auto-generate Auth0 ACUL settings file with correct file hashes
 *
 * Usage:
 *   node scripts/generate-settings.js <cdn-url> <screen-name>
 *
 * Example:
 *   node scripts/generate-settings.js https://my-acul.vercel.app login-passwordless-email-code
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const CDN_URL = args[0];
const SCREEN_NAME = args[1] || 'login-passwordless-email-code';

if (!CDN_URL) {
  console.error('❌ Error: CDN URL is required');
  console.error('');
  console.error('Usage:');
  console.error('  node scripts/generate-settings.js <cdn-url> [screen-name]');
  console.error('');
  console.error('Example:');
  console.error('  node scripts/generate-settings.js https://my-acul.vercel.app login-passwordless-email-code');
  process.exit(1);
}

// Validate dist folder exists
if (!fs.existsSync('dist/assets')) {
  console.error('❌ Error: dist/assets folder not found');
  console.error('   Run "npm run build" first!');
  process.exit(1);
}

/**
 * Find a file matching a pattern in a directory
 */
function findFile(dir, pattern) {
  try {
    const files = fs.readdirSync(dir);
    const found = files.find(f => pattern.test(f) && !f.endsWith('.map'));

    if (!found) {
      throw new Error(`No file matching ${pattern} found in ${dir}`);
    }

    return found;
  } catch (error) {
    console.error(`❌ Error reading ${dir}:`, error.message);
    process.exit(1);
  }
}

/**
 * Extract file hash from filename
 * Example: "main.Dcv3O3IS.js" -> "Dcv3O3IS"
 */
function extractHash(filename) {
  const match = filename.match(/\.([A-Za-z0-9_-]{8})\./);
  return match ? match[1] : null;
}

// Find all required files
console.log('🔍 Scanning build output...\n');

const files = {
  style: findFile('dist/assets/shared', /^style\..+\.css$/),
  main: findFile('dist/assets', /^main\..+\.js$/),
  common: findFile('dist/assets/shared', /^common\..+\.js$/),
  vendor: findFile('dist/assets/shared', /^vendor\..+\.js$/),
  screen: findFile(`dist/assets/${SCREEN_NAME}`, /^index\..+\.js$/),
};

// Display found files
console.log('✅ Found files:');
Object.entries(files).forEach(([type, filename]) => {
  const hash = extractHash(filename);
  console.log(`   ${type.padEnd(8)} → ${filename} (hash: ${hash})`);
});
console.log('');

// Normalize CDN URL (remove trailing slash)
const cdnUrl = CDN_URL.replace(/\/$/, '');

// Generate settings configuration
const settings = {
  rendering_mode: 'advanced',
  context_configuration: [
    'branding.settings',
    'branding.themes.default',
    'screen.texts'
  ],
  default_head_tags_disabled: false,
  head_tags: [
    {
      tag: 'base',
      attributes: {
        href: `${cdnUrl}/`
      }
    },
    {
      tag: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    },
    {
      tag: 'link',
      attributes: {
        rel: 'stylesheet',
        href: `${cdnUrl}/assets/shared/${files.style}`
      }
    },
    {
      tag: 'script',
      attributes: {
        src: `${cdnUrl}/assets/${files.main}`,
        type: 'module'
      }
    },
    {
      tag: 'script',
      attributes: {
        src: `${cdnUrl}/assets/shared/${files.common}`,
        type: 'module'
      }
    },
    {
      tag: 'script',
      attributes: {
        src: `${cdnUrl}/assets/shared/${files.vendor}`,
        type: 'module'
      }
    },
    {
      tag: 'script',
      attributes: {
        src: `${cdnUrl}/assets/${SCREEN_NAME}/${files.screen}`,
        type: 'module'
      }
    }
  ]
};

// Write settings file
const outputFile = `settings-${SCREEN_NAME}.json`;
fs.writeFileSync(outputFile, JSON.stringify(settings, null, 2));

console.log(`✅ Generated: ${outputFile}`);
console.log('');
console.log('📋 Configuration:');
console.log(`   CDN URL: ${cdnUrl}`);
console.log(`   Screen:  ${SCREEN_NAME}`);
console.log('');
console.log('🚀 Next steps:');
console.log('   1. Deploy dist/ folder to your CDN');
console.log(`   2. Verify assets are accessible at: ${cdnUrl}`);
console.log('   3. Deploy to Auth0 using Management API:');
console.log('');
console.log('      # Get access token');
console.log('      export TOKEN=$(curl -s --request POST \\');
console.log('        --url https://YOUR-TENANT.auth0.com/oauth/token \\');
console.log('        --header "content-type: application/json" \\');
console.log('        --data \'{"client_id":"YOUR_CLIENT_ID","client_secret":"YOUR_CLIENT_SECRET","audience":"https://YOUR-TENANT.auth0.com/api/v2/","grant_type":"client_credentials"}\' \\');
console.log('        | jq -r .access_token)');
console.log('');
console.log('      # Deploy configuration');
console.log('      curl --request PUT \\');
console.log(`        --url "https://YOUR-TENANT.auth0.com/api/v2/prompts/login/screen-partials/${SCREEN_NAME}" \\`);
console.log('        --header "authorization: Bearer $TOKEN" \\');
console.log('        --header "content-type: application/json" \\');
console.log(`        --data @${outputFile}`);
console.log('');
