# Create Properly Scoped Cloudflare API Token

The Global API Key is causing authentication issues with Wrangler 4.x. Let's create a properly scoped API token instead.

## 🎯 Quick Token Creation

### Option 1: Use Pre-Made Template

1. **Go to**: https://dash.cloudflare.com/profile/api-tokens
2. **Click**: "Create Token"
3. **Find**: "Edit Cloudflare Workers" template
4. **Click**: "Use template"
5. **Scroll down** and click "Continue to summary"
6. **Click**: "Create Token"
7. **COPY THE TOKEN** - you can't see it again!

### Option 2: Custom Token (More Control)

1. **Go to**: https://dash.cloudflare.com/profile/api-tokens
2. **Click**: "Create Token" → "Create Custom Token"
3. **Token name**: `GitHub Actions - Wiki Search Worker`

4. **Add these permissions**:

   ```
   Account Permissions:
   - Workers Scripts : Edit
   - Workers KV Storage : Edit
   - Account Settings : Read
   - R2 : Edit
   
   Zone Permissions:
   - Workers Routes : Edit
   - Zone : Read
   ```

5. **Account Resources**:
   - Include → Specific account → `Adamic` (<REDACTED_ACCOUNT_ID>)

6. **Zone Resources**:
   - Include → Specific zone → `adamic.tech`

7. **Client IP Address Filtering**: Leave blank

8. **TTL**: Start Date = Now, End Date = No expiry (or set as desired)

9. **Click**: "Continue to summary" → "Create Token"

10. **COPY THE TOKEN IMMEDIATELY**

## 📝 Update GitHub Secret

After creating the token:

1. **Go to**: https://github.com/neverinfamous/wiki-search-worker/settings/secrets/actions
2. **Find**: `CLOUDFLARE_API_TOKEN`
3. **Click**: "Update"
4. **Paste**: Your new token
5. **Click**: "Update secret"

## ✅ Test the Token (Optional)

Before using it in GitHub Actions, test locally:

```bash
# Set the token temporarily
$env:CLOUDFLARE_API_TOKEN = "your-new-token-here"
$env:CLOUDFLARE_ACCOUNT_ID = "<REDACTED_ACCOUNT_ID>"

# Test deployment
npx wrangler deploy --env=""

# Test R2 access
npx wrangler r2 bucket list
```

If these commands work, the token is configured correctly!

## 🔍 Why Not Global API Key?

The Global API Key:
- ❌ Uses older authentication format (`X-Auth-Key` + `X-Auth-Email`)
- ❌ Not fully compatible with Wrangler 4.x's Bearer token authentication
- ❌ Provides excessive permissions (full account access)

A scoped API Token:
- ✅ Uses modern Bearer token authentication
- ✅ Works seamlessly with Wrangler 4.x
- ✅ Follows principle of least privilege
- ✅ Can be rotated without affecting other services

## 🚨 If Token Creation Fails

If you get permission errors when creating the token:
1. Make sure you're logged into the correct Cloudflare account
2. Ensure you have admin/owner access to the account
3. Try using the "Edit Cloudflare Workers" template (simpler)

## 📞 Next Steps After Token Creation

1. Update the `CLOUDFLARE_API_TOKEN` secret in GitHub
2. Re-run the workflow: https://github.com/neverinfamous/wiki-search-worker/actions
3. Check the deployment logs - should see "Total Upload" and success messages

