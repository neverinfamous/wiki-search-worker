# Create Cloudflare API Token for GitHub Actions

The current API token (`J2RJvuQh0MQ48wtPvc9FlOGjjWdVJxNkwP3bejTY`) doesn't have the required permissions for Workers deployment.

## Required Permissions

Your API token needs these permissions:

1. **Workers Scripts:Edit** - Deploy and manage Workers
2. **Workers Routes:Edit** - Manage custom domains
3. **R2:Edit** - Upload files to R2 buckets
4. **Account Settings:Read** - Read account information

## Step-by-Step Guide

### 1. Create New API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Click **"Use template"** next to **"Edit Cloudflare Workers"**

### 2. Customize Permissions

The template should already include Workers permissions. Add these additional permissions:

- **Account** → **R2** → **Edit**
- **Account** → **Workers Scripts** → **Edit** ✓ (already included)
- **Zone** → **Workers Routes** → **Edit** ✓ (already included)

### 3. Set Account Resources

Under **Account Resources**:
- **Include** → **Specific account** → Select your account: `<REDACTED_ACCOUNT_ID>`

### 4. Set Zone Resources (if using custom domain)

Under **Zone Resources**:
- **Include** → **Specific zone** → Select: `adamic.tech`

### 5. Optional Settings

- **Client IP Address Filtering**: Leave blank (or add GitHub Actions IPs if needed)
- **TTL**: Leave as default or set expiration date

### 6. Create and Copy Token

1. Click **"Continue to summary"**
2. Click **"Create Token"**
3. **IMPORTANT**: Copy the token immediately - you can't see it again!

### 7. Update GitHub Secret

1. Go to: https://github.com/neverinfamous/wiki-search-worker/settings/secrets/actions
2. Find **CLOUDFLARE_API_TOKEN** and click **"Update"**
3. Paste the new token
4. Click **"Update secret"**

## Quick Setup (Alternative)

If the template doesn't work, create a **Custom Token** with these exact permissions:

```
Permissions:
├─ Account
│  ├─ Workers Scripts : Edit
│  └─ R2 : Edit
└─ Zone
   └─ Workers Routes : Edit

Account Resources:
└─ Include : <REDACTED_ACCOUNT_ID>

Zone Resources:
└─ Include : adamic.tech
```

## Test the Token

After updating the secret, trigger the workflow manually:

1. Go to: https://github.com/neverinfamous/wiki-search-worker/actions
2. Click **"Deploy Wiki Search Worker & Sync AutoRAG"**
3. Click **"Run workflow"** → **"Run workflow"**

## Troubleshooting

### Still Getting Authentication Error?

1. **Wait a few minutes** - API tokens can take 1-2 minutes to propagate
2. **Check token scope** - Make sure it includes your account ID
3. **Verify secret** - Make sure you copied the full token (no spaces)
4. **Token status** - Check if token is active at https://dash.cloudflare.com/profile/api-tokens

### Alternative: Use Global API Key (Not Recommended)

If tokens keep failing, you can use your Global API Key:
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Scroll to **"Global API Key"** → **"View"**
3. Use this as `CLOUDFLARE_API_TOKEN`

⚠️ **Warning**: Global API Key has full account access. API tokens are more secure.

## Current Configuration

- **Account ID**: `<REDACTED_ACCOUNT_ID>`
- **Worker Name**: `sqlite-wiki-search`
- **Custom Domain**: `search.adamic.tech`
- **R2 Bucket**: `sqlite-mcp-server-wiki`

