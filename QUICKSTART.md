# Quick Start Guide

Get your Rent Manager up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- A PostgreSQL database (local or cloud)

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Database

### Local PostgreSQL

```bash
# Create database
createdb rent_manager

# Or using psql
psql -U postgres -c "CREATE DATABASE rent_manager;"
```

### Cloud Database (Recommended)

Sign up for a free database at:
- [Supabase](https://supabase.com) (Recommended)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)

Copy your connection string.

## 3. Configure Environment

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rent_manager"
```

## 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates the necessary tables in your database.

## 5. (Optional) Add Sample Data

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.tenant.create({
    data: {
      name: 'John Doe',
      phone: '+91 98765 43210',
      flatNo: 'F101',
      active: true,
      electricityService: true,
      electricityRate: 15,
      initialMeterReading: 1500,
      currentMeterReading: 1500,
      rentService: true,
      monthlyRent: 8000,
      rentDueDay: 5,
    },
  });

  console.log('✅ Sample data added!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Install ts-node and run:

```bash
npm install -D ts-node
npx ts-node prisma/seed.ts
```

## 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 7. Test the App

1. ✅ Dashboard loads with stats
2. ✅ Add a new tenant
3. ✅ Record electricity reading
4. ✅ Toggle rent payment

## You're Done! 🎉

The app is now running with a real database.

## Useful Commands

```bash
# View database in browser
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# Build for production
npm run build

# Start production server
npm run start
```

## Troubleshooting

### "Can't connect to database"
- Check your `DATABASE_URL` in `.env.local`
- Make sure PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### "Prisma Client not found"
Run: `npx prisma generate`

### "Port 3000 in use"
Use different port: `npm run dev -- -p 3001`

## Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- Read [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) to understand the architecture
- Add authentication before deploying to production

## Need Help?

Check these resources:
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
