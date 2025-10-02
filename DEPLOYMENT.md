# Automated Deployment Pipeline

This repository uses GitHub Actions to automatically deploy the Wiki Search Worker and sync the AutoRAG index whenever changes are pushed to the `main` branch.

## 🔄 Automated Pipeline Flow

```
GitHub Push → Deploy Worker → Sync Wiki to R2 → Trigger AutoRAG Refresh
```

### What Happens Automatically:

1. **Worker Deployment**: Cloudflare Worker code is deployed to `search.adamic.tech`
2. **R2 Sync**: Latest wiki `.md` files are uploaded to the `sqlite-mcp-server-wiki` R2 bucket
3. **AutoRAG Index**: Triggers a manual sync to refresh the AI Search index

## ⚙️ Setup Instructions

### 1. Add GitHub Secrets

Go to your repository settings: **Settings → Secrets and variables → Actions → New repository secret**

Add these two secrets:

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare Global API Key | Already set: `75d9c0a2d7894f19a088f85375557b65c0dc0` |
| `CLOUDFLARE_EMAIL` | Your Cloudflare account email | Already set: `writenotenow@gmail.com` |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Already set: `<REDACTED_ACCOUNT_ID>` |

**To create a new API token** (if needed):
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Use the **Edit Cloudflare Workers** template
4. Add **R2:Edit** permission
5. Scope to your account

### 2. Enable GitHub Actions

The workflow is already configured in `.github/workflows/deploy.yml`. It will automatically run on:
- Every push to `main` branch
- Manual trigger via GitHub Actions tab

## 📋 Manual Deployment

You can also trigger deployment manually:

1. Go to **Actions** tab in your GitHub repository
2. Select **Deploy Wiki Search Worker & Sync AutoRAG**
3. Click **Run workflow** → **Run workflow**

## 🔍 Monitoring

### Check Deployment Status

- **GitHub Actions**: See deployment logs in the Actions tab
- **Cloudflare Dashboard**: 
  - Worker: https://dash.cloudflare.com/workers
  - R2 Bucket: https://dash.cloudflare.com/r2/overview
  - AI Search: https://dash.cloudflare.com/ai/ai-search

### AutoRAG Sync Frequency

- **Automatic**: Every 6 hours (Cloudflare's default)
- **Manual**: Triggered by GitHub Actions after each deployment
- **Dashboard**: Click "Sync Index" button in AI Search dashboard

## 🚀 What Gets Deployed

### Worker Files
- `src/index.ts` - Main worker code
- `wrangler.toml` - Worker configuration
- All dependencies from `package.json`

### Wiki Files (to R2)
- All `.md` files from `sqlite-mcp-server.wiki` repository
- Uploaded to `sqlite-mcp-server-wiki` R2 bucket
- AutoRAG automatically indexes changes

## 🛠️ Troubleshooting

### Worker Not Deploying
- Check GitHub Actions logs for errors
- Verify API token has Workers:Edit permission
- Ensure `wrangler.toml` is correctly configured

### R2 Upload Failing
- Verify API token has R2:Edit permission
- Check R2 bucket exists: `sqlite-mcp-server-wiki`
- Ensure account ID is correct

### AutoRAG Not Updating
- Wait 5-10 minutes for sync to complete
- Manually trigger sync in Cloudflare dashboard
- Check AI Search Jobs tab for sync status
- AutoRAG syncs automatically every 6 hours anyway

## 📝 Local Development

To test locally before pushing:

```bash
# Install dependencies
npm install

# Test deployment (dry run)
npm run deploy
```

## 🔐 Security Notes

- API tokens are stored securely in GitHub Secrets
- Never commit tokens to the repository
- Tokens are scoped to minimum required permissions
- The repository is private for additional security

