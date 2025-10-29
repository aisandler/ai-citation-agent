# Vercel Setup Guide

This guide covers setting up Vercel CLI and deploying the AI Visibility Dashboard.

## Prerequisites

- Node.js installed (v18 or later)
- Vercel account (free tier works fine)
- Dashboard built locally (see build_dashboard.sh)

## Installing Vercel CLI

```bash
npm install -g vercel
```

Verify installation:
```bash
vercel --version
```

## Authentication

First-time setup requires authentication:

```bash
vercel login
```

This will:
1. Open browser for authentication
2. Prompt to select your Vercel account/team
3. Save authentication token locally

Check authentication status:
```bash
vercel whoami
```

## Project Linking

When deploying for the first time, Vercel will ask setup questions:

1. **Set up and deploy**: Choose "Yes"
2. **Which scope**: Select your account/team
3. **Link to existing project**: Choose "No" (first deployment) or "Yes" (redeployment)
4. **Project name**: Accept default or customize (e.g., "ai-visibility-dashboard")
5. **Directory**: Use `./` (already in dashboard directory)
6. **Override settings**: Choose "No" (use vercel.json config)

## Deployment Commands

### Preview Deployment (staging)
```bash
cd dashboard/
vercel
```

Creates a preview URL (e.g., `https://ai-visibility-dashboard-abc123.vercel.app`)

### Production Deployment
```bash
cd dashboard/
vercel --prod
```

Deploys to production URL (e.g., `https://ai-visibility-dashboard.vercel.app`)

## Environment Configuration

The dashboard has no environment variables by default (reads from local `../output/*.md`).

If you need environment variables:

1. Set via Vercel dashboard (Project Settings → Environment Variables)
2. Or via CLI:
   ```bash
   vercel env add API_KEY
   ```

## Custom Domains

To add a custom domain:

1. Go to Vercel dashboard → Project Settings → Domains
2. Add domain (e.g., `dashboard.yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

## Redeployment

To redeploy after changes:

```bash
cd dashboard/
git pull  # Get latest changes
vercel --prod
```

Vercel automatically:
- Detects changes
- Runs build
- Deploys new version
- Maintains zero-downtime

## Vercel Project Settings

The `vercel.json` in the dashboard directory configures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

This ensures Vercel uses correct build settings.

## Troubleshooting

See `references/troubleshooting.md` for common deployment issues and solutions.
