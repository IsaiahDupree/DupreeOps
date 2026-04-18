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

## Custom Domain Configuration

To set up a custom domain (e.g., dupreeops.com):

### In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., dupreeops.com)
4. Choose one of the following:
   - **Nameservers** (Recommended): Update your domain registrar's nameservers to Vercel's
   - **CNAME**: Add a CNAME record pointing to Vercel (for subdomains)
5. For SSL certificate: Vercel automatically provisions free SSL via Let's Encrypt

### In Your Domain Registrar:
1. If using nameservers:
   - Login to your domain registrar
   - Update nameservers to Vercel's provided nameservers
   - Wait 24-48 hours for DNS propagation
2. If using CNAME:
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record for root domain to Vercel IP

### Verification:
```bash
# Check DNS propagation
dig dupreeops.com
nslookup dupreeops.com

# Verify SSL certificate
curl -I https://dupreeops.com
```

## Monitoring and Error Tracking

### Client-Side Monitoring:
The application includes built-in monitoring via `lib/monitoring.ts`:
- Error tracking with stack traces
- Performance metrics
- API call tracking
- User session tracking

### Accessing Monitoring Data:
```javascript
// In browser console
window.__MONITORING__.errors  // Number of errors
window.__MONITORING__.metrics  // Array of performance metrics
```

### Integrating External Services (Future):
To send data to external monitoring services like Sentry or LogRocket:

1. Install the monitoring SDK:
```bash
npm install @sentry/nextjs  # For Sentry
# or
npm install @logrocket/next  # For LogRocket
```

2. Update `lib/monitoring.ts` to implement `sendToMonitoringService()`:
```typescript
private sendToMonitoringService(log: ErrorLog) {
  Sentry.captureException(log, { level: log.level });
}
```

3. Configure in `next.config.js` or `_app.tsx`

### Key Metrics to Monitor:
- **API Response Times**: Track `/api/contact` and `/api/health` endpoints
- **Error Rate**: Monitor error logs in Vercel dashboard
- **Page Load Performance**: Use Core Web Vitals (LCP, FID, CLS)
- **Contact Form Conversion**: Track successful submissions in Supabase
- **Database Performance**: Monitor Supabase query times

### Vercel Analytics:
1. In Vercel Dashboard: Analytics tab
2. View:
   - Page views and traffic
   - Response times
   - Error rates
   - Deployment health
3. Set up alerts for high error rates

### Monitoring After Deployment:
After deployment:
1. Visit https://dupreeops.com to verify site is live
2. Check all main pages load correctly:
   - `/` (homepage)
   - `/services` (services)
   - `/contact` (contact form)
3. Test the contact form submission
4. Verify API health endpoint responds with 200
5. Check Vercel Analytics for traffic
6. Monitor browser console for errors (open DevTools)

## Rollback Procedures

### Method 1: Vercel Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the "dupreeops-website" project
3. Navigate to the "Deployments" tab
4. Find the desired previous deployment (look for commit message or timestamp)
5. Hover over the deployment and click the three dots menu
6. Select "Promote to Production"
7. Verify the rollback was successful by visiting https://dupreeops.com/api/health

### Method 2: Using Vercel CLI
```bash
# List recent deployments
vercel deployments --limit 10

# Rollback to a specific deployment
vercel deploy <deployment-url> --prod --yes

# Example: vercel deploy https://dupreeops-abc123.vercel.app --prod --yes
```

### Method 3: Git Rollback
If the previous deployment is associated with a git commit:
```bash
# View git log to find the commit to rollback to
git log --oneline | head -10

# Checkout and push the previous commit
git checkout <commit-hash>
git push origin main --force  # Only if necessary and coordinated with team

# Or create a revert commit (safer):
git revert <commit-hash>
git push origin main
```

### Rollback Verification Checklist
After performing a rollback, verify:
- [ ] Site is accessible at https://dupreeops.com
- [ ] All pages load correctly (/, /services, /contact)
- [ ] API health endpoint responds: `curl https://dupreeops.com/api/health`
- [ ] Contact form still functions
- [ ] No console errors in browser dev tools
- [ ] Vercel deployment shows "Ready" status
- [ ] Monitor error logs for 10-15 minutes post-rollback

### Emergency Rollback (Immediate)
If the current deployment has critical issues:
1. In Vercel Dashboard, find the last known good deployment
2. Click "Promote to Production" immediately (no approval needed)
3. If needed, disable new deployments temporarily:
   - Go to Vercel Project Settings
   - Disable GitHub integration temporarily
   - Re-enable after issue is resolved

### Prevention Best Practices
- Always test on preview deployment first before production
- Run `npm run build && npm run test` locally before pushing
- Use semantic versioning for releases
- Document the reason for each major deployment
- Keep previous 5 deployments available for quick rollback
- Monitor application errors continuously post-deployment

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
