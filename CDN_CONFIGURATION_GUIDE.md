# CDN URLs Configuration - Detailed Guide

## 📋 Overview

When you deploy your built assets to a CDN, you need to tell Auth0 where to load those files from. This guide shows you exactly how to do that.

---

## 🎯 The Goal

After building (`npm run build`), you get files with hashes like:
```
dist/assets/main.a1b2c3d4.js
dist/assets/shared/style.e5f6g7h8.css
```

After uploading to your CDN, these files become accessible at URLs like:
```
https://your-cdn.com/assets/main.a1b2c3d4.js
https://your-cdn.com/assets/shared/style.e5f6g7h8.css
```

You need to tell Auth0 to load these specific files in the correct order.

---

## 📝 Step-by-Step Configuration

### Step 1: Build Your Application

```bash
npm run build
```

This creates the `dist/` folder with your compiled assets.

### Step 2: Identify Your Build Files

After building, check what files were created:

```bash
ls -R dist/assets/
```

**Example output:**
```
dist/assets/:
main.a1b2c3d4.js
shared/
login-passwordless-email-code/

dist/assets/shared/:
style.e5f6g7h8.css
common.i9j0k1l2.js
vendor.m3n4o5p6.js

dist/assets/login-passwordless-email-code/:
index.q7r8s9t0.js
```

**Important:** Note down these exact filenames with their hashes!

### Step 3: Upload to Your CDN

Let's say you upload to **Vercel** and get:
```
https://my-acul-project.vercel.app/
```

Or **Cloudflare Pages**:
```
https://auth0-acul.pages.dev/
```

Or **AWS CloudFront**:
```
https://d1234567890.cloudfront.net/acul/
```

**Verify Upload:** Test one file in your browser:
```
https://my-acul-project.vercel.app/assets/main.a1b2c3d4.js
```

You should see JavaScript code (not a 404 error).

### Step 4: Create the JSON Configuration

Now create or edit `settings-passwordless-email-code.json`:

```json
{
  "rendering_mode": "advanced",
  "context_configuration": [
    "branding.settings",
    "branding.themes.default",
    "screen.texts"
  ],
  "default_head_tags_disabled": false,
  "head_tags": [
    {
      "tag": "base",
      "attributes": {
        "href": "https://my-acul-project.vercel.app/"
      }
    },
    {
      "tag": "meta",
      "attributes": {
        "name": "viewport",
        "content": "width=device-width, initial-scale=1"
      }
    },
    {
      "tag": "link",
      "attributes": {
        "rel": "stylesheet",
        "href": "https://my-acul-project.vercel.app/assets/shared/style.e5f6g7h8.css"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/main.a1b2c3d4.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/shared/common.i9j0k1l2.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/shared/vendor.m3n4o5p6.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/login-passwordless-email-code/index.q7r8s9t0.js",
        "type": "module"
      }
    }
  ]
}
```

---

## 🔍 Breaking Down Each Part

### 1. Base Tag
```json
{
  "tag": "base",
  "attributes": {
    "href": "https://my-acul-project.vercel.app/"
  }
}
```
**Purpose:** Sets the base URL for all relative paths
**Replace:** `https://my-acul-project.vercel.app/` with YOUR CDN URL

### 2. Viewport Meta Tag
```json
{
  "tag": "meta",
  "attributes": {
    "name": "viewport",
    "content": "width=device-width, initial-scale=1"
  }
}
```
**Purpose:** Makes the page mobile-responsive
**No changes needed** - this stays the same

### 3. Stylesheet Link
```json
{
  "tag": "link",
  "attributes": {
    "rel": "stylesheet",
    "href": "https://my-acul-project.vercel.app/assets/shared/style.e5f6g7h8.css"
  }
}
```
**Purpose:** Loads the CSS styles
**Replace:**
- `https://my-acul-project.vercel.app/` → YOUR CDN URL
- `style.e5f6g7h8.css` → YOUR actual CSS filename with hash

### 4. Main JavaScript
```json
{
  "tag": "script",
  "attributes": {
    "src": "https://my-acul-project.vercel.app/assets/main.a1b2c3d4.js",
    "type": "module"
  }
}
```
**Purpose:** Main application bootstrap code
**Replace:**
- `https://my-acul-project.vercel.app/` → YOUR CDN URL
- `main.a1b2c3d4.js` → YOUR actual main.js filename with hash

### 5. Common Utilities
```json
{
  "tag": "script",
  "attributes": {
    "src": "https://my-acul-project.vercel.app/assets/shared/common.i9j0k1l2.js",
    "type": "module"
  }
}
```
**Purpose:** Shared utility functions
**Replace:**
- `https://my-acul-project.vercel.app/` → YOUR CDN URL
- `common.i9j0k1l2.js` → YOUR actual common.js filename with hash

### 6. Vendor Dependencies
```json
{
  "tag": "script",
  "attributes": {
    "src": "https://my-acul-project.vercel.app/assets/shared/vendor.m3n4o5p6.js",
    "type": "module"
  }
}
```
**Purpose:** Third-party libraries (React, etc.)
**Replace:**
- `https://my-acul-project.vercel.app/` → YOUR CDN URL
- `vendor.m3n4o5p6.js` → YOUR actual vendor.js filename with hash

### 7. Screen-Specific Code
```json
{
  "tag": "script",
  "attributes": {
    "src": "https://my-acul-project.vercel.app/assets/login-passwordless-email-code/index.q7r8s9t0.js",
    "type": "module"
  }
}
```
**Purpose:** Passwordless email code screen logic
**Replace:**
- `https://my-acul-project.vercel.app/` → YOUR CDN URL
- `index.q7r8s9t0.js` → YOUR actual screen JS filename with hash

---

## 🛠️ Finding Your Actual File Hashes

### Method 1: Manual Inspection
```bash
cd dist/assets
ls -la

# Output shows files with hashes:
# main.a1b2c3d4.js
# shared/style.e5f6g7h8.css
# etc.
```

### Method 2: Using Find Command
```bash
# Find all JS files
find dist/assets -name "*.js" -type f

# Find all CSS files
find dist/assets -name "*.css" -type f
```

### Method 3: Automated Script
Create a script `get-hashes.sh`:
```bash
#!/bin/bash
echo "=== Main Files ==="
ls dist/assets/main*.js

echo -e "\n=== Shared Files ==="
ls dist/assets/shared/*.{css,js}

echo -e "\n=== Screen Files ==="
ls dist/assets/login-passwordless-email-code/*.js
```

Run it:
```bash
chmod +x get-hashes.sh
./get-hashes.sh
```

---

## 🌐 CDN-Specific Examples

### Example 1: Vercel Deployment

**Deploy:**
```bash
vercel --prod
```

**Output:**
```
✅ Deployed to https://my-acul-project.vercel.app
```

**Your settings file:**
```json
{
  "head_tags": [
    {
      "tag": "base",
      "attributes": {
        "href": "https://my-acul-project.vercel.app/"
      }
    },
    {
      "tag": "link",
      "attributes": {
        "rel": "stylesheet",
        "href": "https://my-acul-project.vercel.app/assets/shared/style.abc123.css"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/main.def456.js",
        "type": "module"
      }
    }
  ]
}
```

### Example 2: Netlify Deployment

**Deploy:**
```bash
netlify deploy --prod --dir=dist
```

**Output:**
```
✅ Live URL: https://magical-unicorn-abc123.netlify.app
```

**Your settings file:**
```json
{
  "head_tags": [
    {
      "tag": "base",
      "attributes": {
        "href": "https://magical-unicorn-abc123.netlify.app/"
      }
    },
    {
      "tag": "link",
      "attributes": {
        "rel": "stylesheet",
        "href": "https://magical-unicorn-abc123.netlify.app/assets/shared/style.xyz789.css"
      }
    }
  ]
}
```

### Example 3: AWS CloudFront

**Deploy:**
```bash
aws s3 sync dist/ s3://my-auth0-bucket/acul/ --acl public-read
```

**CloudFront URL:**
```
https://d1234567890.cloudfront.net/acul/
```

**Your settings file:**
```json
{
  "head_tags": [
    {
      "tag": "base",
      "attributes": {
        "href": "https://d1234567890.cloudfront.net/acul/"
      }
    },
    {
      "tag": "link",
      "attributes": {
        "rel": "stylesheet",
        "href": "https://d1234567890.cloudfront.net/acul/assets/shared/style.ghi012.css"
      }
    }
  ]
}
```

### Example 4: Cloudflare Pages

**Deploy:**
```bash
wrangler pages deploy dist --project-name=auth0-acul
```

**Output:**
```
✅ Deployment complete: https://auth0-acul.pages.dev
```

**Your settings file:**
```json
{
  "head_tags": [
    {
      "tag": "base",
      "attributes": {
        "href": "https://auth0-acul.pages.dev/"
      }
    },
    {
      "tag": "link",
      "attributes": {
        "rel": "stylesheet",
        "href": "https://auth0-acul.pages.dev/assets/shared/style.jkl345.css"
      }
    }
  ]
}
```

---

## 📤 How to Upload to Auth0

### Option A: Via Auth0 CLI (Recommended)

1. Save your configuration to `settings-passwordless-email-code.json`
2. Run:
```bash
auth0 ul customize \
  --rendering-mode advanced \
  --prompt login \
  --screen login-passwordless-email-code \
  --settings-file ./settings-passwordless-email-code.json
```

### Option B: Via Auth0 Dashboard

1. Go to: `https://manage.auth0.com/dashboard/`
2. Navigate to: **Branding → Universal Login**
3. Click: **Advanced** tab
4. Select prompt: **login**
5. Find screen: **login-passwordless-email-code**
6. Click: **Customize** or **Edit**
7. Paste your JSON configuration
8. Click: **Save**

**Screenshot of Dashboard (where to paste):**
```
┌─────────────────────────────────────────┐
│ Branding > Universal Login > Advanced   │
├─────────────────────────────────────────┤
│                                         │
│ Prompt: [login ▼]                       │
│ Screen: [login-passwordless-email-code ▼]│
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ {                                   │ │
│ │   "rendering_mode": "advanced",     │ │
│ │   "head_tags": [                    │ │
│ │     {                               │ │
│ │       "tag": "base",                │ │
│ │       "attributes": {               │ │
│ │         "href": "https://your-cdn..." │
│ │       }                             │ │
│ │     },                              │ │
│ │     ...                             │ │
│ │   ]                                 │ │
│ │ }                                   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancel]                        [Save]  │
└─────────────────────────────────────────┘
```

### Option C: Via Management API

```bash
# Get access token
ACCESS_TOKEN=$(curl -s --request POST \
  --url https://YOUR-DOMAIN.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "audience": "https://YOUR-DOMAIN.auth0.com/api/v2/",
    "grant_type": "client_credentials"
  }' | jq -r '.access_token')

# Upload configuration
curl --request PUT \
  --url 'https://YOUR-DOMAIN.auth0.com/api/v2/prompts/login/screen-partials/login-passwordless-email-code' \
  --header "authorization: Bearer $ACCESS_TOKEN" \
  --header 'content-type: application/json' \
  --data @settings-passwordless-email-code.json
```

---

## ✅ Verification Checklist

After uploading your configuration, verify:

### 1. CDN Files are Accessible
Test each URL in your browser:
```
✅ https://your-cdn.com/assets/main.[hash].js → Shows JavaScript code
✅ https://your-cdn.com/assets/shared/style.[hash].css → Shows CSS code
✅ https://your-cdn.com/assets/login-passwordless-email-code/index.[hash].js → Shows JavaScript code
```

### 2. CORS is Configured
Your CDN must allow Auth0 to load resources:

**Required CORS headers:**
```
Access-Control-Allow-Origin: https://YOUR-TENANT.auth0.com
Access-Control-Allow-Methods: GET, OPTIONS
```

**Most CDNs (Vercel, Netlify, Cloudflare Pages) handle this automatically.**

For AWS S3, add a CORS policy:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://YOUR-TENANT.auth0.com"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"]
    }
  ]
}
```

### 3. Auth0 Configuration Uploaded
```bash
# Verify via CLI
auth0 api get prompts/login/partials/login-passwordless-email-code
```

Should return your configuration JSON.

### 4. Test the Login Flow
Visit:
```
https://YOUR-TENANT.auth0.com/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_CALLBACK_URL&
  scope=openid%20profile%20email&
  connection=email
```

You should see your custom passwordless screen!

---

## 🐛 Troubleshooting

### Issue: Screen shows blank or default Auth0 page

**Causes:**
1. Wrong file hashes in settings.json
2. CDN URLs not publicly accessible
3. CORS not enabled

**Debug:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for 404 or CORS errors
4. Verify each CDN URL loads in a new browser tab

### Issue: Files not found (404)

**Solution:**
1. Re-check your file hashes:
   ```bash
   ls dist/assets/**/*.{js,css}
   ```
2. Verify CDN upload was successful
3. Update settings.json with correct hashes
4. Re-upload to Auth0:
   ```bash
   auth0 ul customize \
     --rendering-mode advanced \
     --prompt login \
     --screen login-passwordless-email-code \
     --settings-file ./settings-passwordless-email-code.json
   ```

### Issue: CORS errors in browser console

**Error message:**
```
Access to script at 'https://your-cdn.com/assets/main.js' from origin
'https://your-tenant.auth0.com' has been blocked by CORS policy
```

**Solution:**
Configure CORS on your CDN to allow Auth0:

**Vercel** - Add `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```

**Netlify** - Add `netlify.toml`:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

---

## 📊 Configuration Template Generator

Want to generate the config automatically? Here's a helper script:

Create `generate-settings.js`:
```javascript
const fs = require('fs');
const path = require('path');

const CDN_URL = process.argv[2] || 'https://your-cdn.com';
const distPath = './dist/assets';

// Find files with specific patterns
const findFile = (pattern) => {
  const files = fs.readdirSync(path.join(distPath), { recursive: true });
  return files.find(f => f.includes(pattern));
};

const config = {
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
      attributes: { href: CDN_URL + '/' }
    },
    {
      tag: 'meta',
      attributes: { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    },
    {
      tag: 'link',
      attributes: {
        rel: 'stylesheet',
        href: `${CDN_URL}/assets/${findFile('shared') && findFile('style')}`
      }
    },
    {
      tag: 'script',
      attributes: {
        src: `${CDN_URL}/assets/${findFile('main.')}`,
        type: 'module'
      }
    },
    {
      tag: 'script',
      attributes: {
        src: `${CDN_URL}/assets/${findFile('shared/common')}`,
        type: 'module'
      }
    },
    {
      tag: 'script',
      attributes: {
        src: `${CDN_URL}/assets/${findFile('shared/vendor')}`,
        type: 'module'
      }
    },
    {
      tag: 'script',
      attributes: {
        src: `${CDN_URL}/assets/${findFile('login-passwordless-email-code')}`,
        type: 'module'
      }
    }
  ]
};

fs.writeFileSync(
  'settings-passwordless-email-code.json',
  JSON.stringify(config, null, 2)
);

console.log('✅ Generated settings-passwordless-email-code.json');
```

**Usage:**
```bash
node generate-settings.js https://my-acul-project.vercel.app
```

---

## 🎓 Summary

**What you need:**
1. ✅ Your CDN base URL (e.g., `https://my-acul-project.vercel.app/`)
2. ✅ Actual file hashes from your build (e.g., `main.a1b2c3d4.js`)

**What you do:**
1. Build: `npm run build`
2. Deploy to CDN
3. Get file hashes from `dist/assets/`
4. Create `settings-passwordless-email-code.json` with your URLs
5. Upload to Auth0 via CLI or Dashboard

**Result:**
Auth0 loads your custom passwordless screen from your CDN! 🎉
