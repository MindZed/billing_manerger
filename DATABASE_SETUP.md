# Database Setup Guide

This application is designed to work with any database. The database layer is abstracted in `/lib/db.ts`, which you can configure to connect to your preferred database.

## Current Setup

The app currently uses a **mock in-memory database** for demonstration purposes. All data is stored in memory and will be lost when the server restarts.

## Connecting Your Database

### Option 1: PostgreSQL with Prisma (Recommended)

1. **Install Prisma**
```bash
npm install @prisma/client
npm install -D prisma
```

2. **Initialize Prisma**
```bash
npx prisma init
```

3. **Update `prisma/schema.prisma`**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Tenant {
  id                   String         @id @default(cuid())
  name                 String
  phone                String
  flatNo               String
  active               Boolean        @default(true)
  electricityService   Boolean        @default(false)
  electricityRate      Float?
  initialMeterReading  Int?
  currentMeterReading  Int?
  rentService          Boolean        @default(false)
  monthlyRent          Int?
  rentDueDay           Int?
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
  bills                Bill[]
  rentPayments         RentPayment[]
}

model Bill {
  id              String   @id @default(cuid())
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  period          String
  previousReading Int
  currentReading  Int
  unitsConsumed   Int
  amount          Float
  status          String   @default("pending")
  date            String
  paidDate        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model RentPayment {
  id        String   @id @default(cuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  month     String
  amount    Int
  dueDate   String
  status    String   @default("pending")
  paidDate  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

4. **Add Database URL to `.env`**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/rent_manager"
```

5. **Run Migrations**
```bash
npx prisma migrate dev --name init
```

6. **Update `/lib/db.ts`**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllTenants() {
  return await prisma.tenant.findMany();
}

export async function getTenantById(id: string) {
  return await prisma.tenant.findUnique({ where: { id } });
}

export async function createTenant(tenant: any) {
  return await prisma.tenant.create({ data: tenant });
}

export async function updateTenant(id: string, tenant: any) {
  return await prisma.tenant.update({ where: { id }, data: tenant });
}

export async function deleteTenant(id: string) {
  await prisma.tenant.delete({ where: { id } });
}

export async function getAllBills() {
  return await prisma.bill.findMany();
}

export async function getBillsByTenantId(tenantId: string) {
  return await prisma.bill.findMany({ where: { tenantId } });
}

export async function createBill(bill: any) {
  return await prisma.bill.create({ data: bill });
}

export async function updateBill(id: string, bill: any) {
  return await prisma.bill.update({ where: { id }, data: bill });
}

export async function getAllRentPayments() {
  return await prisma.rentPayment.findMany();
}

export async function getRentPaymentsByTenantId(tenantId: string) {
  return await prisma.rentPayment.findMany({ where: { tenantId } });
}

export async function createRentPayment(payment: any) {
  return await prisma.rentPayment.create({ data: payment });
}

export async function updateRentPayment(id: string, payment: any) {
  return await prisma.rentPayment.update({ where: { id }, data: payment });
}
```

### Option 2: MySQL with Prisma

Same as PostgreSQL, but change the `provider` in `schema.prisma` to `"mysql"` and use a MySQL connection string:

```env
DATABASE_URL="mysql://user:password@localhost:3306/rent_manager"
```

### Option 3: MongoDB with Mongoose

1. **Install Mongoose**
```bash
npm install mongoose
```

2. **Create schemas in `/lib/db.ts`**
```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rent_manager';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const TenantSchema = new mongoose.Schema({
  name: String,
  phone: String,
  flatNo: String,
  active: Boolean,
  electricityService: Boolean,
  electricityRate: Number,
  initialMeterReading: Number,
  currentMeterReading: Number,
  rentService: Boolean,
  monthlyRent: Number,
  rentDueDay: Number,
}, { timestamps: true });

const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', TenantSchema);

// Similar schemas for Bill and RentPayment...

export async function getAllTenants() {
  await connectDB();
  return await Tenant.find({}).lean();
}

// ... rest of the functions
```

### Option 4: Supabase

1. **Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

2. **Update `/lib/db.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function getAllTenants() {
  const { data, error } = await supabase.from('tenants').select('*');
  if (error) throw error;
  return data;
}

// ... rest of the functions
```

### Option 5: Firebase Firestore

1. **Install Firebase**
```bash
npm install firebase-admin
```

2. **Update `/lib/db.ts`**
```typescript
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export async function getAllTenants() {
  const snapshot = await db.collection('tenants').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ... rest of the functions
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# For PostgreSQL/MySQL with Prisma
DATABASE_URL="your_database_url"

# For Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
SUPABASE_SERVICE_KEY="your_service_key"

# For MongoDB
MONGODB_URI="your_mongodb_connection_string"

# For Firebase
FIREBASE_PROJECT_ID="your_project_id"
FIREBASE_CLIENT_EMAIL="your_client_email"
FIREBASE_PRIVATE_KEY="your_private_key"
```

## Important Notes

1. **Server Actions**: The app uses Next.js Server Actions for all database operations. These are defined in `/app/actions.ts`.

2. **Type Safety**: All TypeScript types are defined in `/lib/types.ts`. Make sure your database schema matches these types.

3. **Revalidation**: The app uses `revalidatePath('/')` to refresh data after mutations. This ensures the UI stays in sync with the database.

4. **Error Handling**: Add proper error handling in production. The current implementation has basic error logging.

5. **Security**: Make sure to:
   - Never expose database credentials in client-side code
   - Use environment variables for all sensitive data
   - Implement proper authentication before deploying
   - Add rate limiting and input validation

## Testing

To test your database connection:

1. Replace the mock functions in `/lib/db.ts` with your database functions
2. Restart the Next.js development server: `npm run dev`
3. Open the app and try adding a tenant
4. Check your database to confirm the data was saved

## Migration from Mock Data

To migrate your mock data to a real database:

1. Set up your database connection as described above
2. Optionally create a seed script to import the mock data:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add your mock data here
  await prisma.tenant.create({
    data: {
      name: 'John Doe',
      phone: '+91 98765 43210',
      flatNo: 'F101',
      // ... rest of the data
    }
  });
}

main();
```

Run the seed: `npx prisma db seed`

## Support

If you need help connecting a specific database, refer to:
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Database Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Supabase Documentation](https://supabase.com/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/drivers/node/)
