# Quick Setup Reference - Passwordless Universal Login

## 🎯 Quick Overview

```
Build → Deploy to CDN → Configure Auth0 → Test
```

## 📍 Where to Configure in Auth0 Dashboard

### 1. Enable Passwordless Connection
**Location:** `Authentication → Passwordless → Email`

```
☑️ Enable Email Passwordless
⚙️ OTP Length: 6 digits
⏱️ OTP Expiry: 300 seconds
📧 Email Template: Customize with your branding
```

### 2. Configure Universal Login
**Location:** `Branding → Universal Login`

```
🎨 Customization Mode: Advanced
📝 Prompt: login
🖼️ Screen: login-passwordless-email-code
```

#### 2a. Upload Assets (via Dashboard)
**Location:** `Branding → Universal Login → Advanced`

Click **"Customize Prompt"** → Select **"login-passwordless-email-code"** → Add head tags:

```json
{
  "head_tags": [
    { "tag": "base", "attributes": { "href": "https://your-cdn.com/" }},
    { "tag": "link", "attributes": { "rel": "stylesheet", "href": "https://your-cdn.com/assets/shared/style.abc123.css" }},
    { "tag": "script", "attributes": { "src": "https://your-cdn.com/assets/main.abc123.js", "type": "module" }},
    { "tag": "script", "attributes": { "src": "https://your-cdn.com/assets/shared/common.abc123.js", "type": "module" }},
    { "tag": "script", "attributes": { "src": "https://your-cdn.com/assets/shared/vendor.abc123.js", "type": "module" }},
    { "tag": "script", "attributes": { "src": "https://your-cdn.com/assets/login-passwordless-email-code/index.abc123.js", "type": "module" }}
  ]
}
```

### 3. Customize Text (Optional)
**Location:** `Branding → Universal Login → Text Customization → Login → login-passwordless-email-code`

```json
{
  "title": "Check your email",
  "description": "Enter your email to receive a verification code",
  "emailPlaceholder": "Email address",
  "codePlaceholder": "Verification code",
  "buttonText": "Continue",
  "resendCodeText": "Resend code",
  "footerText": "Don't have an account?",
  "footerLinkText": "Sign up"
}
```

### 4. Enable for Your Application
**Location:** `Applications → [Your App] → Connections`

```
☑️ Email (Passwordless)
```

## 🚀 Quick Deployment Commands

### Build
```bash
npm run build
```

### Deploy to CDN (Choose One)

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod --dir=dist
```

**AWS S3:**
```bash
aws s3 sync dist/ s3://your-bucket/acul/ --acl public-read
```

**Cloudflare Pages:**
```bash
wrangler pages deploy dist --project-name=auth0-acul
```

### Configure Auth0 via CLI
```bash
# Login
auth0 login

# Deploy configuration
auth0 ul customize \
  --rendering-mode advanced \
  --prompt login \
  --screen login-passwordless-email-code \
  --settings-file ./settings-passwordless-email-code.json
```

## 🔍 Testing URLs

### Test Login Flow
```
https://YOUR-DOMAIN.auth0.com/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_CALLBACK_URL&
  scope=openid%20profile%20email&
  connection=email
```

### Test in Your App
```javascript
// Using Auth0 SPA SDK
await auth0.loginWithRedirect({
  authorizationParams: {
    connection: 'email'
  }
});
```

## 📊 Configuration Matrix

| Step | Auth0 Dashboard Location | CLI Command | API Endpoint |
|------|-------------------------|-------------|--------------|
| Enable Passwordless | `Authentication → Passwordless` | N/A | `PATCH /api/v2/connections/{id}` |
| Upload Screen Assets | `Branding → Universal Login → Advanced` | `auth0 ul customize` | `PUT /api/v2/prompts/{prompt}/partials/{screen}` |
| Customize Text | `Branding → Universal Login → Text` | `auth0 api patch` | `PATCH /api/v2/prompts/{prompt}/custom-text/{language}` |
| Enable in App | `Applications → Connections` | N/A | `PATCH /api/v2/clients/{id}` |

## 🛠️ File Hash Finder

After building, find your actual file hashes:

```bash
# List all built files with hashes
ls -1 dist/assets/**/*.{js,css}

# Example output:
# dist/assets/main.a1b2c3d4.js
# dist/assets/shared/style.e5f6g7h8.css
# dist/assets/shared/common.i9j0k1l2.js
# dist/assets/shared/vendor.m3n4o5p6.js
# dist/assets/login-passwordless-email-code/index.q7r8s9t0.js
```

Update `settings-passwordless-email-code.json` with these actual hashes!

## 🔐 Auth0 Tenant Requirements

| Requirement | Status |
|-------------|--------|
| Auth0 Plan | ⚠️ Enterprise Required |
| Custom Domain | ✅ Must be verified |
| Passwordless Enabled | ✅ Email connection |
| Application Setup | ✅ Callback URLs configured |

## 📱 Mobile Compatibility

The OTP input is optimized for mobile:
- ✅ `inputMode="numeric"` → Number keyboard
- ✅ `autoComplete="one-time-code"` → iOS SMS autofill
- ✅ Paste support → Auto-fill all 6 digits
- ✅ Responsive design → Works on all screen sizes

## 🎨 Theme Variables

Override in `Branding → Universal Login → Custom CSS`:

```css
:root {
  /* Focus color */
  --ul-theme-color-base-focus-color: #635DFF;

  /* Input colors */
  --ul-theme-color-input-border: #c9cace;
  --ul-theme-color-input-background: #ffffff;

  /* Error color */
  --ul-theme-color-error: #d03c38;

  /* Text colors */
  --ul-theme-color-body-text: #1e212a;
  --ul-theme-color-input-filled-text: #000000;
}
```

## ✅ Pre-Launch Checklist

- [ ] Build assets: `npm run build`
- [ ] Upload to CDN (with CORS enabled)
- [ ] Get actual file hashes from CDN
- [ ] Update `settings-passwordless-email-code.json` with CDN URLs
- [ ] Enable passwordless in Auth0 (`Authentication → Passwordless`)
- [ ] Configure custom screen (`auth0 ul customize`)
- [ ] Enable connection in application
- [ ] Test login flow
- [ ] Verify email delivery
- [ ] Test OTP input on mobile
- [ ] Check error handling
- [ ] Verify resend code functionality

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Screen not loading | Check CDN URLs are public, CORS enabled |
| 404 on assets | Verify file hashes match in settings.json |
| Passwordless option not showing | Enable email connection in Application |
| OTP not sending | Check email connection settings in Auth0 |
| Wrong screen displaying | Verify prompt/screen name in CLI command |

## 📞 Support

- [Auth0 Community](https://community.auth0.com/)
- [Auth0 Support Portal](https://support.auth0.com/)
- [ACUL Documentation](https://auth0.com/docs/customize/login-pages/advanced-customizations)
