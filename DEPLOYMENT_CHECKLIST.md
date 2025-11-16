# Production Deployment Checklist

Before deploying your Rent Manager app to production, complete this checklist.

## Pre-Deployment

### Database Setup
- [ ] Production database created
- [ ] Database URL added to environment variables
- [ ] Migrations run on production database
- [ ] Database backups configured
- [ ] Connection pooling enabled (for serverless)

### Security
- [ ] Authentication implemented (NextAuth.js recommended)
- [ ] User roles and permissions configured
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Environment variables secured
- [ ] Database credentials rotated from defaults
- [ ] SQL injection protection verified (Prisma handles this)
- [ ] XSS protection enabled

### Code Quality
- [ ] TypeScript errors resolved: `npm run build`
- [ ] ESLint warnings addressed
- [ ] All console.logs removed or replaced with proper logging
- [ ] Error boundaries added
- [ ] Loading states implemented
- [ ] Error messages user-friendly

### Performance
- [ ] Images optimized
- [ ] Large dependencies reviewed
- [ ] Code splitting implemented
- [ ] Database queries optimized
- [ ] Indexes added to database tables
- [ ] Caching strategy implemented

### Testing
- [ ] Manual testing completed
- [ ] All features tested on mobile
- [ ] Cross-browser testing done
- [ ] Edge cases handled
- [ ] Error scenarios tested

## Deployment Steps

### 1. Environment Variables

Set these in your hosting platform:

```env
DATABASE_URL="postgresql://..."
NODE_ENV="production"

# Optional but recommended
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 2. Build Configuration

Verify `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Add if using images from external sources
  images: {
    domains: ['your-domain.com'],
  },
};

module.exports = nextConfig;
```

### 3. Prisma Production Setup

Add to `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "next build"
  }
}
```

### 4. Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL

# Deploy to production
vercel --prod
```

Or connect via GitHub:
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### 5. Deploy to Other Platforms

**Railway**:
```bash
railway login
railway init
railway up
```

**Render**:
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set start command: `npm run start`
4. Add environment variables

**AWS/Digital Ocean**:
1. Set up Node.js environment
2. Install dependencies: `npm ci`
3. Build: `npm run build`
4. Start: `npm run start`
5. Set up reverse proxy (nginx)

## Post-Deployment

### Immediate Checks
- [ ] Application loads without errors
- [ ] Database connection working
- [ ] All pages accessible
- [ ] Forms submit correctly
- [ ] Data persists correctly
- [ ] Mobile view works
- [ ] SSL/HTTPS enabled

### Monitoring Setup
- [ ] Error tracking configured (Sentry)
- [ ] Analytics setup (Google Analytics, Plausible)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring
- [ ] Database monitoring

### Backup & Recovery
- [ ] Database backup schedule configured
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented

### Documentation
- [ ] User guide created
- [ ] Admin documentation written
- [ ] API documentation updated
- [ ] Deployment process documented

## Security Hardening

### Authentication (Critical!)

This app currently has NO authentication. Add before production:

**Option 1: NextAuth.js** (Recommended)

```bash
npm install next-auth
```

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Implement your auth logic here
        if (credentials?.username === "admin" && credentials?.password === "your-secure-password") {
          return { id: "1", name: "Admin" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Option 2: Clerk** (Easier)

```bash
npm install @clerk/nextjs
```

Follow: https://clerk.com/docs/quickstarts/nextjs

### Rate Limiting

Add to prevent abuse:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

### Input Validation

Use Zod for validation:

```bash
npm install zod
```

```typescript
import { z } from 'zod';

const tenantSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().regex(/^\+91 \d{5} \d{5}$/),
  flatNo: z.string().min(1).max(20),
  // ... other fields
});
```

## Maintenance

### Regular Tasks
- [ ] Weekly database backups reviewed
- [ ] Monthly security updates
- [ ] Quarterly performance audit
- [ ] User feedback reviewed

### Update Strategy
- [ ] Development → Staging → Production pipeline
- [ ] Version control with tags
- [ ] Rollback procedure documented

## Performance Targets

Set and monitor these:
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90
- [ ] Database queries < 100ms
- [ ] API responses < 200ms

## Legal & Compliance

- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] Cookie consent (if applicable)
- [ ] GDPR compliance (if serving EU)
- [ ] Data retention policy

## Support & Maintenance

- [ ] Support email configured
- [ ] Bug reporting process set up
- [ ] Change log maintained
- [ ] Known issues documented

## Final Check

Before going live:

```bash
# 1. Build succeeds
npm run build

# 2. No TypeScript errors
npm run build | grep "error"

# 3. Prisma client generated
npx prisma generate

# 4. Database accessible
npx prisma db push

# 5. Start production build locally
npm run start
```

## Emergency Contacts

Document these:
- Database provider support
- Hosting platform support
- DNS provider
- Domain registrar
- Security contact

## Post-Launch

First 24 hours:
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify database backups
- [ ] Test critical paths
- [ ] Be available for issues

First week:
- [ ] Gather user feedback
- [ ] Monitor resource usage
- [ ] Review costs
- [ ] Plan next iteration

---

## ⚠️ Critical Warning

**DO NOT deploy to production without:**
1. ✅ Authentication system
2. ✅ HTTPS/SSL certificate
3. ✅ Database backups
4. ✅ Environment variables secured
5. ✅ Rate limiting

This app handles sensitive tenant data. Secure it properly!

---

Good luck with your deployment! 🚀
