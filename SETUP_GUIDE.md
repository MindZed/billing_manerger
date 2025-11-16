# Setup Guide - Next.js Rent Manager

This guide will walk you through setting up the Rent Manager application with a real database.

## Prerequisites

- Node.js 18+ installed
- A PostgreSQL database (or MySQL/MongoDB)
- Basic knowledge of terminal/command line

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- Prisma Client
- React
- Tailwind CSS
- Recharts (for charts)
- Lucide React (for icons)

## Step 2: Set Up Your Database

### Option A: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed):
   - **macOS**: `brew install postgresql`
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)
   - **Linux**: `sudo apt-get install postgresql`

2. **Create a database**:
```bash
psql -U postgres
CREATE DATABASE rent_manager;
\q
```

### Option B: Cloud PostgreSQL (Recommended for production)

Use one of these free-tier cloud databases:
- **Supabase**: [https://supabase.com](https://supabase.com) (Free tier available)
- **Neon**: [https://neon.tech](https://neon.tech) (Free tier available)
- **Railway**: [https://railway.app](https://railway.app) (Free tier available)

After creating your database, copy the connection string.

## Step 3: Configure Environment Variables

1. **Copy the example environment file**:
```bash
cp .env.example .env.local
```

2. **Edit `.env.local`** and add your database URL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/rent_manager"
```

Replace with your actual database credentials:
- `username`: Your database username (default: `postgres`)
- `password`: Your database password
- `localhost:5432`: Your database host and port
- `rent_manager`: Your database name

**Example for cloud databases**:
```env
# Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# Neon
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

## Step 4: Initialize Prisma

1. **Run Prisma migrations** to create the database tables:
```bash
npx prisma migrate dev --name init
```

This will:
- Create the `tenants`, `bills`, and `rent_payments` tables
- Generate the Prisma Client

2. **Generate Prisma Client** (if not already done):
```bash
npx prisma generate
```

## Step 5: (Optional) Seed Sample Data

To add sample data for testing, create a seed file:

**Create `prisma/seed.ts`**:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample tenants
  const tenant1 = await prisma.tenant.create({
    data: {
      name: 'John Doe',
      phone: '+91 98765 43210',
      flatNo: 'F101',
      active: true,
      electricityService: true,
      electricityRate: 15,
      initialMeterReading: 1500,
      currentMeterReading: 1600,
      rentService: true,
      monthlyRent: 8000,
      rentDueDay: 5,
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      name: 'Jane Smith',
      phone: '+91 98765 43211',
      flatNo: 'F102',
      active: true,
      electricityService: true,
      electricityRate: 15,
      initialMeterReading: 2000,
      currentMeterReading: 2100,
      rentService: true,
      monthlyRent: 8350,
      rentDueDay: 5,
    },
  });

  // Create sample bill
  await prisma.bill.create({
    data: {
      tenantId: tenant1.id,
      period: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      previousReading: 1400,
      currentReading: 1500,
      unitsConsumed: 100,
      amount: 1500,
      status: 'paid',
      date: new Date().toISOString().split('T')[0],
      paidDate: new Date().toISOString().split('T')[0],
    },
  });

  // Create sample rent payment
  await prisma.rentPayment.create({
    data: {
      tenantId: tenant1.id,
      month: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      amount: 8000,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Add to `package.json`**:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

**Install ts-node**:
```bash
npm install -D ts-node
```

**Run the seed**:
```bash
npx prisma db seed
```

## Step 6: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Verify Everything Works

1. **Check the database connection**: The app should load without errors
2. **Add a tenant**: Click the menu → Tenants → Add button
3. **Generate a bill**: Go to Electricity → Select a customer → Record Reading
4. **Mark rent as paid**: Go to Rent Payments → Toggle a payment

## Database Management

### View your database

```bash
npx prisma studio
```

This opens a visual database browser at [http://localhost:5555](http://localhost:5555)

### Reset the database

```bash
npx prisma migrate reset
```

This will:
- Drop the database
- Recreate it
- Run migrations
- Run seed (if configured)

### Create a new migration

After changing `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name description_of_change
```

## Troubleshooting

### "Can't reach database server"
- Check your `DATABASE_URL` in `.env.local`
- Ensure your database is running
- Check firewall settings

### "Table does not exist"
- Run `npx prisma migrate dev`
- Check if migrations ran successfully

### "Prisma Client not found"
- Run `npx prisma generate`
- Restart your dev server

### "Port 3000 already in use"
- Use a different port: `npm run dev -- -p 3001`

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `DATABASE_URL` to environment variables
4. Deploy

Vercel will automatically:
- Build your Next.js app
- Run `prisma generate`
- Deploy to production

### Other Platforms

For Railway, Render, or AWS:

1. Set the `DATABASE_URL` environment variable
2. Add build command: `npm run build`
3. Add start command: `npm run start`
4. Ensure Prisma generates during build (via `postinstall` script)

## Security Checklist

Before going live:

- [ ] Change default passwords
- [ ] Add authentication (NextAuth.js recommended)
- [ ] Enable rate limiting
- [ ] Use HTTPS only
- [ ] Validate all user inputs
- [ ] Set up database backups
- [ ] Add error logging (Sentry, LogRocket)
- [ ] Review Prisma security best practices

## Support

If you encounter issues:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Check the [Prisma documentation](https://www.prisma.io/docs)
3. Review error messages in the terminal
4. Check the browser console for client-side errors

## Next Steps

- Add authentication
- Implement PDF invoice generation
- Add email/SMS notifications
- Create backup/export functionality
- Add analytics and reporting
