# Passwordless Email Code - Deployment Guide

This guide walks you through deploying the passwordless email code screen to your Auth0 tenant using a CDN.

## Prerequisites

### Required for All Deployments:
- ✅ Auth0 **paid plan** (Essentials, Professional, or Enterprise)
- ✅ **Verified custom domain** in Auth0 (required for ACUL)
- ✅ CDN account (AWS S3/CloudFront, Cloudflare, Vercel, Netlify, etc.)

### Additional for CLI Deployment (Optional):
- ⚠️ Auth0 **Enterprise** plan (required for `auth0 ul customize` CLI command)
- ✅ Auth0 CLI installed: `npm install -g @auth0/auth0-cli`

**Note:** You can deploy using the Management API with any paid plan. The CLI method requires Enterprise.

## Step-by-Step Deployment

### 1. Enable Passwordless in Auth0 Dashboard

Before deploying the custom screen, you need to enable passwordless authentication:

**Auth0 Dashboard:**
1. Navigate to **Authentication → Database**
2. Create or select your database connection
3. Enable **Passwordless** tab
4. Configure **Email** connection:
   - Enable "Email" as a passwordless option
   - Choose OTP code delivery method
   - Set code expiration time (default: 10 minutes)
   - Set code length (recommended: 6 digits)

**Or via Email Connection:**
1. Navigate to **Authentication → Passwordless**
2. Click **Email** tab
3. Toggle **Enable Email Passwordless**
4. Configure:
   - **OTP Length**: 6 digits
   - **OTP Expiry**: 300 seconds (5 minutes)
   - **Email Template**: Customize the email with your verification code

### 2. Build Your Application

```bash
# Navigate to project directory
cd auth0-acul-samples

# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates optimized assets in the `dist/` folder:

```
dist/
├── assets/
│   ├── main.[hash].js
│   ├── shared/
│   │   ├── style.[hash].css
│   │   ├── common.[hash].js
│   │   └── vendor.[hash].js
│   └── login-passwordless-email-code/
│       └── index.[hash].js
```

### 3. Upload to CDN

#### Option A: AWS S3 + CloudFront

```bash
# Install AWS CLI
brew install awscli  # macOS
# or: pip install awscli

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://your-acul-bucket

# Upload dist folder
aws s3 sync dist/ s3://your-acul-bucket/acul/ --acl public-read

# Create CloudFront distribution
# (Use AWS Console or CLI to point to S3 bucket)

# Your CDN URL will be: https://d123456.cloudfront.net/acul/
```

#### Option B: Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist --project-name=auth0-acul

# Your CDN URL will be: https://auth0-acul.pages.dev/
```

#### Option C: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Your CDN URL will be: https://your-project.vercel.app/
```

#### Option D: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Your CDN URL will be: https://your-site.netlify.app/
```

### 4. Update Settings File

After deployment, note the **actual file hashes** from your CDN:

```bash
# Example: List files in dist to get hashes
ls -la dist/assets/
```

Update `settings-passwordless-email-code.json` with your CDN URL and actual hashes:

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
        "href": "https://YOUR-ACTUAL-CDN-URL.com/"
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
        "href": "https://YOUR-ACTUAL-CDN-URL.com/assets/shared/style.ACTUAL-HASH.css"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://YOUR-ACTUAL-CDN-URL.com/assets/main.ACTUAL-HASH.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://YOUR-ACTUAL-CDN-URL.com/assets/shared/common.ACTUAL-HASH.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://YOUR-ACTUAL-CDN-URL.com/assets/shared/vendor.ACTUAL-HASH.js",
        "type": "module"
      }
    },
    {
      "tag": "script",
      "attributes": {
        "src": "https://YOUR-ACTUAL-CDN-URL.com/assets/login-passwordless-email-code/index.ACTUAL-HASH.js",
        "type": "module"
      }
    }
  ]
}
```

### 5. Configure Auth0 Tenant via CLI

```bash
# Login to Auth0 CLI
auth0 login

# Configure the passwordless email code screen
auth0 ul customize \
  --rendering-mode advanced \
  --prompt login \
  --screen login-passwordless-email-code \
  --settings-file ./settings-passwordless-email-code.json
```

**Alternative: Specific Prompt**

If you want to use passwordless for specific scenarios:

```bash
# For login prompt
auth0 ul customize \
  --rendering-mode advanced \
  --prompt login \
  --screen login-passwordless-email-code \
  --settings-file ./settings-passwordless-email-code.json

# For signup prompt
auth0 ul customize \
  --rendering-mode advanced \
  --prompt signup \
  --screen login-passwordless-email-code \
  --settings-file ./settings-passwordless-email-code.json
```

### 6. Configure via Management API (Alternative)

You can also configure via the Auth0 Management API:

```bash
# Get an access token
curl --request POST \
  --url https://YOUR-DOMAIN.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "audience": "https://YOUR-DOMAIN.auth0.com/api/v2/",
    "grant_type": "client_credentials"
  }'

# Update the prompt customization
curl --request PUT \
  --url 'https://YOUR-DOMAIN.auth0.com/api/v2/prompts/login/screen-partials/login-passwordless-email-code' \
  --header 'authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data @settings-passwordless-email-code.json
```

### 7. Test Your Configuration

#### Option A: Test via Auth0 Application

1. Go to **Applications** in Auth0 Dashboard
2. Select your application
3. Click **Try** or use the login URL
4. Navigate to login flow
5. You should see your custom passwordless screen

#### Option B: Test via Direct URL

```
https://YOUR-DOMAIN.auth0.com/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_CALLBACK_URL&
  scope=openid%20profile%20email&
  connection=email
```

### 8. Customize Text & Branding

Update screen texts via Auth0 Dashboard:

1. Navigate to **Branding → Universal Login → Text Customization**
2. Select **Login** prompt
3. Select **login-passwordless-email-code** screen
4. Customize:
   - `title`: "Check your email"
   - `description`: "Enter your email to receive a verification code"
   - `emailPlaceholder`: "Email address"
   - `codePlaceholder`: "Verification code"
   - `buttonText`: "Continue"
   - `resendCodeText`: "Resend code"

## Auth0 Dashboard Configuration

### Where to Configure in Dashboard

1. **Branding → Universal Login**
   - Select **Advanced** customization mode
   - Navigate to **Login** prompt
   - Select **login-passwordless-email-code** screen
   - Upload or reference your CDN assets

2. **Authentication → Passwordless**
   - Configure email connection settings
   - Customize email templates
   - Set OTP length and expiry

3. **Applications**
   - Enable passwordless connection for your application
   - Configure callback URLs
   - Set allowed web origins

## Troubleshooting

### Screen Not Loading

**Check:**
- CDN URLs are publicly accessible (test in browser)
- CORS is enabled on your CDN
- File hashes in settings.json match actual files
- Auth0 CLI successfully updated the configuration

**Debug:**
```bash
# Verify configuration
auth0 api get prompts/login/partials/login-passwordless-email-code

# Check browser console for errors
# Open browser DevTools → Network tab
```

### Passwordless Not Appearing

**Check:**
- Passwordless connection is enabled in Auth0
- Application has passwordless connection enabled
- Using correct prompt (`login` vs `signup`)

### OTP Not Sending

**Check:**
- Email connection is properly configured
- SMTP settings are correct (if custom)
- Email template is not malformed
- Test email is not going to spam

## Advanced Configuration

### Using Different OTP Lengths

While the component supports 6 digits by default, you can modify it:

```tsx
// In OTPInput.tsx component
<OTPInput
  length={8}  // Change to 4, 6, 8, etc.
  value={code}
  onChange={onChange}
/>
```

### Custom Styling

Override theme variables in your Auth0 Dashboard:

**Branding → Universal Login → Advanced Options → Custom CSS**

```css
:root {
  --ul-theme-color-base-focus-color: #635DFF;
  --ul-theme-color-input-border: #c9cace;
  --ul-theme-color-error: #d03c38;
}
```

### Environment-Specific Configurations

Create multiple settings files:

- `settings-passwordless-dev.json` → Dev tenant
- `settings-passwordless-staging.json` → Staging tenant
- `settings-passwordless-prod.json` → Production tenant

## Security Considerations

- ✅ Always use HTTPS for CDN URLs
- ✅ Enable CORS only for your Auth0 domain
- ✅ Use CDN with cache invalidation support
- ✅ Set appropriate cache headers on assets
- ✅ Monitor for unauthorized changes to CDN files
- ✅ Use subresource integrity (SRI) hashes if possible
- ✅ Regularly update dependencies and rebuild

## Rollback Strategy

To rollback to default Auth0 Universal Login:

```bash
# Disable advanced customization
auth0 ul customize \
  --rendering-mode standard \
  --prompt login
```

Or via API:

```bash
curl --request DELETE \
  --url 'https://YOUR-DOMAIN.auth0.com/api/v2/prompts/login/screen-partials/login-passwordless-email-code' \
  --header 'authorization: Bearer YOUR_ACCESS_TOKEN'
```

## Next Steps

- Configure email templates with your branding
- Set up monitoring and analytics
- Add A/B testing for conversion optimization
- Implement internationalization (i18n)
- Add telemetry and error tracking

## Resources

- [Auth0 ACUL Documentation](https://auth0.com/docs/customize/login-pages/advanced-customizations)
- [Auth0 Passwordless Guide](https://auth0.com/docs/authenticate/passwordless)
- [Auth0 Management API](https://auth0.com/docs/api/management/v2)
- [Auth0 CLI Documentation](https://github.com/auth0/auth0-cli)
