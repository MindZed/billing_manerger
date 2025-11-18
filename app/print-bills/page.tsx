import type { Metadata } from 'next';
import { getAllTenants, getAllBills } from '../../lib/db';
import { getBillingPeriod } from '../../lib/date-utils';
import BillReceipt from '../../components/BillReceipt';
import AutoPrint from '@/components/AutoPrint';

export const dynamic = 'force-dynamic';

// --- ADDED DYNAMIC METADATA ---
export function generateMetadata(): Metadata {
  const period = getBillingPeriod();
  
  return {
    title: `Electricity Bills - ${period}`,
    description: `Printable electricity bill receipts for ${period}`,
    // Good practice: prevent search engines from indexing internal print pages
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PrintBillsPage() {
  const tenants = await getAllTenants();
  const bills = await getAllBills();
  const billingPeriod = getBillingPeriod();

  // Filter for bills belonging to the billing period (previous month)
  // We include both PENDING and PAID bills for that month
  const generatedBills = bills.filter(b => 
    b.period === billingPeriod
  );

  // Helper to get tenant details
  const getTenantForBill = (tenantId: string) => {
    return tenants.find(t => t.id === tenantId);
  };

  // Chunk bills into groups of 9 (3x3 grid)
  const chunkArray = (array: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const billPages = chunkArray(generatedBills, 9);

  return (
    <div className="bg-white min-h-screen text-black p-0 m-0">
      <AutoPrint />
      
      {generatedBills.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">No Bills Found</h1>
          <p>No bills have been generated for the period: <strong>{billingPeriod}</strong></p>
          <p className="text-sm text-gray-500 mt-2">Generate bills in the Electricity tab first.</p>
        </div>
      ) : (
        billPages.map((pageBills, pageIndex) => (
          <div key={pageIndex} className="print-page-a4">
            <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full w-full">
              {pageBills.map((bill: any) => {
                const tenant = getTenantForBill(bill.tenantId);
                if (!tenant) return null;
                return <BillReceipt key={bill.id} bill={bill} tenant={tenant} />;
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}