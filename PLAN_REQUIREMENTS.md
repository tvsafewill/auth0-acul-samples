# Auth0 ACUL Plan Requirements - Verified (January 2025)

## ✅ What You Actually Need

Based on official Auth0 documentation and testing, here are the **real** requirements:

---

## 🎯 Quick Answer

| Question | Answer |
|----------|--------|
| **Do I need Enterprise plan for ACUL?** | ❌ **NO** - Any paid plan works! |
| **Can I use ACUL with Essentials ($35/mo)?** | ✅ **YES** - Via Management API |
| **Do I need a custom domain?** | ✅ **YES** - Must be verified |
| **Can I use the CLI with Professional plan?** | ❌ **NO** - CLI requires Enterprise |
| **Is ACUL production-ready?** | ✅ **YES** - Early Access but stable |

---

## 📊 Plan Comparison

### **Free Plan ($0/month)**
- ❌ No ACUL access
- ❌ No custom domain
- ✅ Can develop locally with mock data

### **Essentials Plan (~$35/month)**
- ✅ **ACUL access via Management API**
- ✅ Custom domain (free with credit card verification)
- ❌ No CLI access (`auth0 ul customize`)
- ✅ Up to 500 MAUs (Monthly Active Users)

### **Professional Plan (~$240/month)**
- ✅ **ACUL access via Management API**
- ✅ Custom domain (included)
- ❌ No CLI access (`auth0 ul customize`)
- ✅ Up to 500 MAUs, then pay-as-you-go

### **Enterprise Plan ($30k+/year)**
- ✅ **ACUL access via Management API**
- ✅ **ACUL access via CLI** (`auth0 ul customize`)
- ✅ Custom domain (included)
- ✅ Unlimited MAUs
- ✅ Priority support

---

## 🛠️ Deployment Methods by Plan

### Method 1: Management API (All Paid Plans)

**Works with:** Essentials, Professional, Enterprise

```bash
# Get access token
curl --request POST \
  --url https://YOUR-TENANT.auth0.com/oauth/token \
  --data '{"client_id":"...","client_secret":"...","audience":"https://YOUR-TENANT.auth0.com/api/v2/","grant_type":"client_credentials"}'

# Deploy configuration
curl --request PUT \
  --url 'https://YOUR-TENANT.auth0.com/api/v2/prompts/login/screen-partials/login-passwordless-email-code' \
  --header "authorization: Bearer TOKEN" \
  --data @settings-passwordless-email-code.json
```

**Pros:**
- ✅ Works with cheaper plans ($35/mo vs $30k/yr)
- ✅ Can be automated in CI/CD
- ✅ Programmatic control

**Cons:**
- ⚠️ Requires API token management
- ⚠️ Slightly more complex setup

---

### Method 2: Auth0 CLI (Enterprise Only)

**Works with:** Enterprise plan only

```bash
auth0 login
auth0 ul customize \
  --rendering-mode advanced \
  --prompt login \
  --screen login-passwordless-email-code \
  --settings-file ./settings-passwordless-email-code.json
```

**Pros:**
- ✅ Simpler command
- ✅ Interactive workflow
- ✅ Official CLI tool

**Cons:**
- ❌ Requires Enterprise plan (~$30k+/year)
- ⚠️ Manual process (harder to automate)

---

## 💰 Cost Analysis

### Scenario 1: Small Startup (< 500 users)
**Recommendation:** Essentials Plan + Management API
- **Cost:** $35/month
- **Setup:** Use Management API deployment
- **Savings:** $29,965/year vs Enterprise

### Scenario 2: Growing Company (500-5000 users)
**Recommendation:** Professional Plan + Management API
- **Cost:** $240/month + usage
- **Setup:** Use Management API deployment
- **Savings:** $27,120/year vs Enterprise

### Scenario 3: Large Enterprise (5000+ users)
**Recommendation:** Enterprise Plan + CLI
- **Cost:** $30k+/year (custom pricing)
- **Setup:** Use CLI for convenience
- **Benefits:** Priority support, SLA, dedicated CSM

---

## 🔐 Custom Domain Requirements

**All ACUL deployments require a verified custom domain.**

### Setup Process:

1. **Go to:** Auth0 Dashboard → Branding → Custom Domains
2. **Enter your domain:** e.g., `auth.yourcompany.com`
3. **Add DNS records:**
   - Auth0 provides CNAME record
   - Add to your DNS provider
4. **Verify:**
   - Auth0 checks DNS propagation
   - Usually takes 5-10 minutes
5. **Configure features:**
   - Enable custom domain for Universal Login
   - Enable for APIs (optional)

### Free Custom Domain (Essentials Plan):
- ✅ Available with credit card on file
- ✅ No charges for custom domain
- ✅ Same features as paid plans

---

## 📋 Feature Matrix

| Feature | Free | Essentials | Professional | Enterprise |
|---------|------|------------|--------------|------------|
| **ACUL Access** | ❌ | ✅ API | ✅ API | ✅ API + CLI |
| **Custom Domain** | ❌ | ✅ Free* | ✅ | ✅ |
| **CLI Deployment** | ❌ | ❌ | ❌ | ✅ |
| **API Deployment** | ❌ | ✅ | ✅ | ✅ |
| **Local Development** | ✅ | ✅ | ✅ | ✅ |
| **Production Use** | ❌ | ✅ | ✅ | ✅ |

*Requires credit card verification

---

## ✅ What This Means for You

### If you're just exploring:
- ✅ Use **Free plan** with mock data
- ✅ Develop locally: `npm run screen login-passwordless-email-code`
- ✅ No Auth0 account needed

### If you want to deploy to production:
- ✅ Minimum: **Essentials plan** ($35/mo)
- ✅ Setup custom domain (free with credit card)
- ✅ Deploy via Management API
- ✅ Works perfectly fine!

### If you prefer CLI convenience:
- ⚠️ Need: **Enterprise plan** ($30k+/year)
- ✅ Use `auth0 ul customize` commands
- ✅ Get priority support

---

## 🚀 Recommended Path

### For Most Users:
```bash
1. Start: Free plan → develop locally
2. Upgrade: Essentials ($35/mo) → deploy to production
3. Method: Management API deployment
4. Cost: $420/year (vs $30k for Enterprise)
```

### For Large Enterprises:
```bash
1. Start: Enterprise plan
2. Method: CLI deployment
3. Benefits: Support + SLA + convenience
4. Cost: Custom pricing (~$30k+)
```

---

## 📚 Official Sources

- [ACUL Documentation](https://auth0.com/docs/customize/login-pages/advanced-customizations)
- [Auth0 Pricing](https://auth0.com/pricing)
- [Custom Domains](https://auth0.com/docs/customize/custom-domains)
- [Management API v2](https://auth0.com/docs/api/management/v2)

---

## 🎯 Summary

**The good news:** You DON'T need a $30k Enterprise plan to use ACUL!

**What you need:**
- ✅ Any paid plan (starts at $35/month)
- ✅ Verified custom domain (free with Essentials)
- ✅ CDN for hosting assets
- ✅ Management API or CLI access

**Bottom line:** ACUL is accessible to startups and small businesses, not just enterprises! 🎉
