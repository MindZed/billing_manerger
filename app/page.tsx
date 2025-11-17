import { getTenants, getRentPayments, getCurrentMonthBills } from './actions';
import ClientApp from './ClientApp';

export default async function Home() {
  const [tenants, bills, rentPayments] = await Promise.all([
    getTenants(),
    getCurrentMonthBills(),
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
