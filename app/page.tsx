import { getTenants, getBills, getRentPayments } from './actions';
import ClientApp from './ClientApp';

export default async function Home() {
  const [tenants, bills, rentPayments] = await Promise.all([
    getTenants(),
    getBills(),
    getRentPayments()
  ]);

  return (
    <ClientApp 
      initialTenants={tenants}
      initialBills={bills}
      initialRentPayments={rentPayments}
    />
  );
}
