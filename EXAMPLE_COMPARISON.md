# Example: Before & After - CDN URL Configuration

## 🎯 Real-World Example

Let's walk through a complete example from start to finish.

---

## 📦 Step 1: After Build

You run `npm run build` and get these files:

```bash
$ ls -R dist/assets/

dist/assets/:
main.f3a2b1c9.js
index.html
shared/
login-passwordless-email-code/

dist/assets/shared/:
style.d4e5f6a7.css
common.b8c9d0e1.js
vendor.f2a3b4c5.js

dist/assets/login-passwordless-email-code/:
index.a6b7c8d9.js
```

**Key observation:** Note the hashes!
- `main.f3a2b1c9.js` ← Hash is `f3a2b1c9`
- `style.d4e5f6a7.css` ← Hash is `d4e5f6a7`
- etc.

---

## 🌐 Step 2: Upload to CDN

Let's say you choose **Vercel**:

```bash
$ vercel --prod

🔍 Inspect: https://vercel.com/your-team/my-acul-project/abc123
✅ Production: https://my-acul-project.vercel.app
```

Your files are now at:
- `https://my-acul-project.vercel.app/assets/main.f3a2b1c9.js`
- `https://my-acul-project.vercel.app/assets/shared/style.d4e5f6a7.css`
- `https://my-acul-project.vercel.app/assets/shared/common.b8c9d0e1.js`
- `https://my-acul-project.vercel.app/assets/shared/vendor.f2a3b4c5.js`
- `https://my-acul-project.vercel.app/assets/login-passwordless-email-code/index.a6b7c8d9.js`

---

## 📝 Step 3: Create Settings File

### ❌ BEFORE (Template with placeholders)

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
        "href": "https://your-cdn-domain.com/"
      }
    },
    {
      "tag": "link",
      "attributes": {
        "rel": "stylesheet",
        "href": "https://your-cdn-domain.com/assets/shared/style.[hash].css"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://your-cdn-domain.com/assets/main.[hash].js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://your-cdn-domain.com/assets/shared/common.[hash].js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://your-cdn-domain.com/assets/shared/vendor.[hash].js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://your-cdn-domain.com/assets/login-passwordless-email-code/index.[hash].js",
        "type": "module"
      }
    }
  ]
}
```

### ✅ AFTER (With your actual values)

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
        "href": "https://my-acul-project.vercel.app/assets/shared/style.d4e5f6a7.css"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/main.f3a2b1c9.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/shared/common.b8c9d0e1.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/shared/vendor.f2a3b4c5.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/login-passwordless-email-code/index.a6b7c8d9.js",
        "type": "module"
      }
    }
  ]
}
```

**What changed:**
1. ✅ `your-cdn-domain.com` → `my-acul-project.vercel.app`
2. ✅ `style.[hash].css` → `style.d4e5f6a7.css`
3. ✅ `main.[hash].js` → `main.f3a2b1c9.js`
4. ✅ `common.[hash].js` → `common.b8c9d0e1.js`
5. ✅ `vendor.[hash].js` → `vendor.f2a3b4c5.js`
6. ✅ `index.[hash].js` → `index.a6b7c8d9.js`

---

## 🚀 Step 4: Upload to Auth0

```bash
$ auth0 login
✓ Successfully logged in

$ auth0 ul customize \
  --rendering-mode advanced \
  --prompt login \
  --screen login-passwordless-email-code \
  --settings-file ./settings-passwordless-email-code.json

✓ Successfully updated login-passwordless-email-code screen
```

---

## 🧪 Step 5: Test

Visit your Auth0 login URL:
```
https://your-tenant.auth0.com/authorize?
  response_type=code&
  client_id=abc123&
  redirect_uri=http://localhost:3000/callback&
  scope=openid%20profile%20email&
  connection=email
```

You should see your custom passwordless screen! 🎉

---

## 📊 Comparison Table

| Item | Template Value | Your Actual Value | Where to Find |
|------|---------------|-------------------|---------------|
| Base URL | `https://your-cdn-domain.com/` | `https://my-acul-project.vercel.app/` | Vercel deployment output |
| CSS File | `style.[hash].css` | `style.d4e5f6a7.css` | `ls dist/assets/shared/` |
| Main JS | `main.[hash].js` | `main.f3a2b1c9.js` | `ls dist/assets/` |
| Common JS | `common.[hash].js` | `common.b8c9d0e1.js` | `ls dist/assets/shared/` |
| Vendor JS | `vendor.[hash].js` | `vendor.f2a3b4c5.js` | `ls dist/assets/shared/` |
| Screen JS | `index.[hash].js` | `index.a6b7c8d9.js` | `ls dist/assets/login-passwordless-email-code/` |

---

## 🎬 Complete Workflow

```bash
# 1. Build
npm run build

# 2. Check files
ls -R dist/assets/

# Example output:
# dist/assets/main.f3a2b1c9.js
# dist/assets/shared/style.d4e5f6a7.css
# dist/assets/shared/common.b8c9d0e1.js
# dist/assets/shared/vendor.f2a3b4c5.js
# dist/assets/login-passwordless-email-code/index.a6b7c8d9.js

# 3. Deploy to CDN
vercel --prod

# Output: https://my-acul-project.vercel.app

# 4. Create settings file with YOUR values
cat > settings-passwordless-email-code.json << 'EOF'
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
        "href": "https://my-acul-project.vercel.app/assets/shared/style.d4e5f6a7.css"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/main.f3a2b1c9.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/shared/common.b8c9d0e1.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/shared/vendor.f2a3b4c5.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://my-acul-project.vercel.app/assets/login-passwordless-email-code/index.a6b7c8d9.js",
        "type": "module"
      }
    }
  ]
}
EOF

# 5. Upload to Auth0
auth0 login
auth0 ul customize \
  --rendering-mode advanced \
  --prompt login \
  --screen login-passwordless-email-code \
  --settings-file ./settings-passwordless-email-code.json

# 6. Test in browser
# Visit: https://your-tenant.auth0.com/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_CALLBACK&scope=openid&connection=email
```

---

## 🔍 How to Verify Each URL

Test each URL in your browser to ensure they're accessible:

```bash
# CSS - should show styles
open https://my-acul-project.vercel.app/assets/shared/style.d4e5f6a7.css

# Main JS - should show JavaScript code
open https://my-acul-project.vercel.app/assets/main.f3a2b1c9.js

# Common JS
open https://my-acul-project.vercel.app/assets/shared/common.b8c9d0e1.js

# Vendor JS
open https://my-acul-project.vercel.app/assets/shared/vendor.f2a3b4c5.js

# Screen JS
open https://my-acul-project.vercel.app/assets/login-passwordless-email-code/index.a6b7c8d9.js
```

All should return code, **NOT 404 errors**.

---

## 💡 Pro Tips

### Tip 1: Copy-Paste from CDN
After deploying to CDN, you can often browse the files directly:
- Vercel: `https://my-acul-project.vercel.app/assets/` (shows file listing)
- Some CDNs allow directory browsing

### Tip 2: Use Browser DevTools
1. Visit your Auth0 login page
2. Open DevTools (F12)
3. Go to Network tab
4. Look for failed requests (404s)
5. Fix those URLs in your settings file

### Tip 3: Version Your Settings Files
Create multiple settings files for different environments:
```
settings-passwordless-dev.json      → https://dev-acul.vercel.app
settings-passwordless-staging.json  → https://staging-acul.vercel.app
settings-passwordless-prod.json     → https://acul.yourcompany.com
```

### Tip 4: Use a Script
Create `update-settings.sh`:
```bash
#!/bin/bash

# Get CDN URL from command line
CDN_URL=$1

# Get file hashes
STYLE_FILE=$(ls dist/assets/shared/style.*.css | xargs basename)
MAIN_FILE=$(ls dist/assets/main.*.js | xargs basename)
COMMON_FILE=$(ls dist/assets/shared/common.*.js | xargs basename)
VENDOR_FILE=$(ls dist/assets/shared/vendor.*.js | xargs basename)
SCREEN_FILE=$(ls dist/assets/login-passwordless-email-code/index.*.js | xargs basename)

# Generate settings file
cat > settings-passwordless-email-code.json <<EOF
{
  "rendering_mode": "advanced",
  "head_tags": [
    { "tag": "base", "attributes": { "href": "${CDN_URL}/" }},
    { "tag": "link", "attributes": { "rel": "stylesheet", "href": "${CDN_URL}/assets/shared/${STYLE_FILE}" }},
    { "tag": "script", "attributes": { "src": "${CDN_URL}/assets/${MAIN_FILE}", "type": "module" }},
    { "tag": "script", "attributes": { "src": "${CDN_URL}/assets/shared/${COMMON_FILE}", "type": "module" }},
    { "tag": "script", "attributes": { "src": "${CDN_URL}/assets/shared/${VENDOR_FILE}", "type": "module" }},
    { "tag": "script", "attributes": { "src": "${CDN_URL}/assets/login-passwordless-email-code/${SCREEN_FILE}", "type": "module" }}
  ]
}
EOF

echo "✅ Generated settings file with:"
echo "   CDN URL: ${CDN_URL}"
echo "   Files:"
echo "     - ${STYLE_FILE}"
echo "     - ${MAIN_FILE}"
echo "     - ${COMMON_FILE}"
echo "     - ${VENDOR_FILE}"
echo "     - ${SCREEN_FILE}"
```

Usage:
```bash
chmod +x update-settings.sh
./update-settings.sh https://my-acul-project.vercel.app
```

---

## ✅ Final Checklist

- [ ] Built application (`npm run build`)
- [ ] Noted all file hashes from `dist/assets/`
- [ ] Deployed to CDN
- [ ] Copied CDN base URL
- [ ] Created `settings-passwordless-email-code.json` with actual values
- [ ] Verified all CDN URLs are accessible in browser
- [ ] Uploaded configuration to Auth0
- [ ] Tested login flow
- [ ] Confirmed passwordless screen appears
- [ ] Verified 6-digit OTP input works

---

## 🎓 Summary

**The key is simple:**

1. **Get your CDN URL** (e.g., `https://my-acul-project.vercel.app/`)
2. **Get your file hashes** (e.g., `style.d4e5f6a7.css`)
3. **Combine them** in the settings file
4. **Upload to Auth0**

That's it! Auth0 will now load your custom passwordless screen from your CDN. 🚀
