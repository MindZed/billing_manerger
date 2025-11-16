import { Tenant, RentPayment } from '../lib/types';
import { Home, Calendar, DollarSign } from 'lucide-react';
import { getCurrentPeriod } from '../lib/date-utils';

interface RentPaymentsProps {
  tenants: Tenant[];
  rentPayments: RentPayment[];
  onTogglePayment: (paymentId: string) => void;
}

export default function RentPayments({ tenants, rentPayments, onTogglePayment }: RentPaymentsProps) {
  const rentCustomers = tenants.filter(t => t.rentService);
  const currentPeriod = getCurrentPeriod();
  const currentMonthPayments = rentPayments.filter(p => p.month === currentPeriod);

  const getPaymentForTenant = (tenantId: string) => {
    return currentMonthPayments.find(p => p.tenantId === tenantId);
  };

  const getTenantPaymentHistory = (tenantId: string) => {
    return rentPayments
      .filter(p => p.tenantId === tenantId && p.month !== currentPeriod)
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
      .slice(0, 3);
  };

  return (
    <div className="p-4 space-y-4">
      {rentCustomers.length === 0 ? (
        <div className="bg-[#1F1F1F] rounded-xl p-8 border border-[#2A2A2A] text-center">
          <div className="p-4 bg-[#FFA726]/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Home className="w-8 h-8 text-[#FFA726]" />
          </div>
          <div className="text-lg mb-2">No Rent Customers</div>
          <div className="text-sm text-[#A0A0A0]">
            Add tenants with rent service to start tracking their payments
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {rentCustomers.map(tenant => {
            const payment = getPaymentForTenant(tenant.id);
            const history = getTenantPaymentHistory(tenant.id);
            const isPaid = payment?.status === 'paid';
            const dueDate = payment ? new Date(payment.dueDate) : new Date();
            const formattedDueDate = dueDate.toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short' 
            });

            return (
              <div
                key={tenant.id}
                className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-[#FFA726]/20 rounded-lg">
                      <Home className="w-5 h-5 text-[#FFA726]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg mb-1">{tenant.name}</h3>
                      <div className="text-sm text-[#A0A0A0] mb-2">{tenant.flatNo}</div>
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <DollarSign className="w-4 h-4 text-[#A0A0A0]" />
                        <span>Rs. {tenant.monthlyRent?.toLocaleString()}/month</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-[#A0A0A0]" />
                        <span>Due: {formattedDueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Month Payment Status */}
                <div className={`p-4 rounded-lg mb-3 ${
                  isPaid ? 'bg-[#66BB6A]/20' : 'bg-[#FFA726]/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-[#A0A0A0] mb-1">{currentPeriod} Payment</div>
                      <div className={`text-lg ${isPaid ? 'text-[#66BB6A]' : 'text-[#FFA726]'}`}>
                        {isPaid ? 'Paid' : 'Pending'}
                      </div>
                    </div>
                    <button
                      onClick={() => payment && onTogglePayment(payment.id)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        isPaid ? 'bg-[#66BB6A]' : 'bg-[#3A3A3A]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          isPaid ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  {isPaid && payment?.paidDate && (
                    <div className="text-xs text-[#A0A0A0] mt-2">
                      Paid on: {new Date(payment.paidDate).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </div>
                  )}
                </div>

                {/* Payment History */}
                {history.length > 0 && (
                  <div className="border-t border-[#2A2A2A] pt-3">
                    <div className="text-sm text-[#A0A0A0] mb-2">Recent History</div>
                    <div className="space-y-2">
                      {history.map(p => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-[#A0A0A0]">{p.month}</span>
                          <span className={
                            p.status === 'paid' ? 'text-[#66BB6A]' : 'text-[#FFA726]'
                          }>
                            {p.status === 'paid' ? '✓ Paid' : '⚠ Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {rentCustomers.length > 0 && (
        <div className="bg-[#1F1F1F] rounded-xl p-6 border border-[#2A2A2A]">
          <h2 className="text-lg mb-4">Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#A0A0A0]">Total Rent Customers</span>
              <span>{rentCustomers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#A0A0A0]">Paid This Month</span>
              <span className="text-[#66BB6A]">
                {currentMonthPayments.filter(p => p.status === 'paid').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#A0A0A0]">Pending This Month</span>
              <span className="text-[#FFA726]">
                {currentMonthPayments.filter(p => p.status === 'pending').length}
              </span>
            </div>
            <div className="h-px bg-[#2A2A2A] my-2" />
            <div className="flex justify-between items-center">
              <span className="text-[#A0A0A0]">Total Collected</span>
              <span className="text-[#66BB6A]">
                Rs. {currentMonthPayments
                  .filter(p => p.status === 'paid')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#A0A0A0]">Pending Amount</span>
              <span className="text-[#FFA726]">
                Rs. {currentMonthPayments
                  .filter(p => p.status === 'pending')
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}