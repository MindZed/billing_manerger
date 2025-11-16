# Landlord's Utility & Rent Manager

A sleek, mobile-first, dark theme Next.js application for landlords to track and manage electricity consumption and rent payments for their tenants.

## Features

### Dashboard

- Total monthly revenue tracking (electricity + rent)
- Pending bills and unpaid rent overview
- Total units consumed display
- Quick access to pending meter readings
- Summary statistics

### Tenant Management

- Add, edit, and delete tenants
- Configure electricity service with custom rates
- Configure rent service with due dates
- Toggle service status per tenant
- View all tenant information at a glance

### Electricity Management

- Track meter readings for each tenant
- Auto-calculate bills based on consumption
- Generate bills with custom rates per tenant
- View consumption trends with interactive charts
- Billing history for each customer
- Mark bills as paid

### Rent Payment Tracking

- Simple toggle interface for payment status
- Track monthly rent payments
- View payment history
- Summary of collected and pending amounts
- Due date tracking

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: Configurable (see DATABASE_SETUP.md)

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The app currently uses a mock in-memory database. To connect your own database:

1. Read the [DATABASE_SETUP.md](./DATABASE_SETUP.md) guide
2. Choose your database (PostgreSQL, MySQL, MongoDB, Supabase, Firebase, etc.)
3. Update `/lib/db.ts` with your database functions
4. Add your database credentials to `.env.local`

## Project Structure

```
/app
  ├── page.tsx              # Main entry point (Server Component)
  ├── ClientApp.tsx         # Client-side app logic
  ├── actions.ts            # Server Actions for data mutations
  ├── layout.tsx            # Root layout
  └── globals.css           # Global styles

/components
  ├── Dashboard.tsx         # Dashboard screen
  ├── Tenants.tsx           # Tenant list screen
  ├── TenantForm.tsx        # Add/Edit tenant form
  ├── Electricity.tsx       # Electricity customers list
  ├── CustomerDetail.tsx    # Individual customer detail page
  └── RentPayments.tsx      # Rent payment tracking screen

/lib
  ├── types.ts              # TypeScript type definitions
  └── db.ts                 # Database functions (customize this)
```

## Server Actions

The app uses Next.js Server Actions for all data mutations:

- `getTenants()` - Fetch all tenants
- `addTenant()` - Create a new tenant
- `editTenant()` - Update existing tenant
- `removeTenant()` - Delete a tenant
- `getBills()` - Fetch all bills
- `generateBill()` - Create a new bill
- `markBillAsPaid()` - Update bill payment status
- `getRentPayments()` - Fetch all rent payments
- `toggleRentPayment()` - Toggle rent payment status

## Customization

### Colors

The app uses a dark theme with the following color palette:

- Background: `#1A1A1A`
- Primary Accent (Blue): `#42A5F5`
- Success (Green): `#66BB6A`
- Warning (Amber): `#FFA726`

To customize, update the colors in the component files.

### Current Month

The app is currently hardcoded to "Nov 2025" for the current billing month. To make this dynamic:

1. Create a utility function to get the current month
2. Update all references to "Nov 2025" in:
   - `/components/Dashboard.tsx`
   - `/components/Electricity.tsx`
   - `/components/RentPayments.tsx`
   - `/app/actions.ts`

Example:

```typescript
const getCurrentMonth = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};
```

## Mobile-First Design

The app is designed with a mobile-first approach:

- Touch-friendly buttons and cards
- Sidebar navigation with hamburger menu
- Responsive layouts
- Optimized for portrait mobile screens
- Smooth transitions and animations

## Production Deployment

Before deploying to production:

1. **Set up a real database** (see DATABASE_SETUP.md)
2. **Add authentication** to protect the admin panel
3. **Implement proper error handling**
4. **Add input validation** on forms
5. **Set up environment variables** for sensitive data
6. **Add rate limiting** to prevent abuse
7. **Enable HTTPS** for secure connections
8. **Add logging and monitoring**

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- Render
- AWS Amplify
- Self-hosted with Docker

## Future Enhancements

- [ ] Multi-landlord support with authentication
- [ ] PDF invoice generation
- [ ] SMS/Email notifications for due payments
- [ ] Payment gateway integration
- [ ] Expense tracking
- [ ] Analytics and reporting
- [ ] Export data to Excel/CSV
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Offline support with PWA

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the documentation or create an issue in the repository.