# Deployment Guide - Dupree Ops Website

## Overview
The Dupree Ops website is configured for deployment on Vercel with Next.js.

## Prerequisites
- Node.js 18+ installed
- Vercel CLI installed (`npm install -g vercel`)
- Vercel account with project configured

## Development Deployment

### Local Testing
```bash
npm install
npm run dev
```
The site will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Vercel Deployment

### First-time Setup
```bash
vercel login
vercel link
```

### Deploy to Production
```bash
vercel deploy --prod --yes
```

### Deploy to Preview
```bash
vercel deploy --yes
```

## Environment Variables

The following environment variables must be configured in Vercel:

| Variable | Value | Source |
|----------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ivhfuhxorppptyuofbgq.supabase.co` | Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Supabase dashboard |

See `vercel.json` for configuration details.

## Health Check

The deployment can be verified by checking the health endpoint:

```bash
curl https://dupreeops.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-04-18T21:50:35.020Z",
  "service": "dupreeops-website",
  "version": "1.0.0"
}
```

## Monitoring

After deployment:
1. Visit https://dupreeops.com to verify site is live
2. Check all main pages load correctly:
   - `/` (homepage)
   - `/services` (services)
   - `/contact` (contact form)
3. Test the contact form submission
4. Verify API health endpoint responds with 200

## Rollback

To rollback to a previous deployment:
1. Go to Vercel Dashboard → Deployments
2. Find the desired previous deployment
3. Click the deployment and select "Promote to Production"

## Continuous Deployment

The project is configured for automatic deployment when pushing to the main branch if integrated with GitHub.

## Troubleshooting

### Build Fails
- Check Node version: `node --version` (should be 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### API Errors
- Verify Supabase environment variables are correct
- Check Supabase project status
- Verify database tables exist (contact_submissions)

### Deployment Stuck
- Check Vercel deployment logs in dashboard
- Verify all environment variables are set
- Ensure build command completes within timeout (15 min)

## Support

For deployment issues, consult:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
