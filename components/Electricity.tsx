import { Tenant, Bill } from '../lib/types';
import { Zap, ChevronRight } from 'lucide-react';
import { getBillingPeriod } from '../lib/date-utils';
import PrintWindowButton from './PrintWindowButton';

interface ElectricityProps {
  tenants: Tenant[];
  bills: Bill[];
  onSelectCustomer: (tenant: Tenant) => void;
}

export default function Electricity({ tenants, bills, onSelectCustomer }: ElectricityProps) {
  const electricityCustomers = tenants.filter(t => t.electricityService);
  const currentPeriod = getBillingPeriod();
  const currentMonthBills = bills

  const getCustomerStatus = (tenant: Tenant) => {
    const bill = currentMonthBills.find((b) => b.tenantId === tenant.id);

    if (!bill) {
      return { status: "Pending Reading", color: "amber", bgColor: "#FFA726" };
    }

    if (bill.status === "paid") {
      return { status: "Paid", color: "green", bgColor: "#66BB6A" };
    }

    return { status: "Bill Generated", color: "blue", bgColor: "#42A5F5" };
  };

  const getLastReadingDate = (tenant: Tenant) => {
    const tenantBills = bills
      .filter((b) => b.tenantId === tenant.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (tenantBills.length === 0) return "No readings!";

    const lastBill = tenantBills[0];
    const date = new Date(lastBill.date);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const totalBills = currentMonthBills.filter((b) => b.status === "pending").length;
  const paidBills = currentMonthBills.filter((b) => b.status === "paid").length;


  return (
    <div className="p-4 space-y-4">
      {/* Summary Stats */}
      {electricityCustomers.length > 0 && (
        <div className="bg-[#1F1F1F] rounded-xl p-5 border border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm">Summary</h2>
            <span className="text-xs font-semibold uppercase px-2 py-1 rounded-full bg-[#8a8a8a] text-[#000000]">
              {currentPeriod}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="flex flex-col">
              <span className="text-[#A0A0A0] text-sm">Bills</span>
              <span className="font-semibold text-2xl text-[#42A5F5]">
                {totalBills}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[#A0A0A0] text-sm">Paid</span>
              <span className="font-semibold text-2xl text-[#66BB6A]">
                {paidBills}
              </span>
            </div>
          </div>
          {electricityCustomers.length === totalBills && totalBills !== 0 && 
          <PrintWindowButton />
          }

        </div>
      )}
      {electricityCustomers.length === 0 ? (
        <div className="bg-[#1F1F1F] rounded-xl p-8 border border-[#2A2A2A] text-center">
          <div className="p-4 bg-[#42A5F5]/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Zap className="w-8 h-8 text-[#42A5F5]" />
          </div>
          <div className="text-lg mb-2">No Electricity Customers</div>
          <div className="text-sm text-[#A0A0A0]">
            Add tenants with electricity service to start tracking their
            consumption
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {electricityCustomers.map((tenant) => {
            const statusInfo = getCustomerStatus(tenant);
            const lastReading = getLastReadingDate(tenant);

            return (
              <div
                key={tenant.id}
                onClick={() => onSelectCustomer(tenant)}
                className="bg-gradient-to-r from-gray-700/30 to-gray-900/30 rounded-xl p-4 border border-teal-950/50 active:bg-[#252525] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-teal-700/20 rounded-lg">
                      <Zap className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg">{tenant.name}</h3>
                      </div>
                      <div className="text-sm text-[#A0A0A0] mb-2">
                        {tenant.flatNo}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[#A0A0A0]">Last Reading:</span>
                        <span>{lastReading}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-[#A0A0A0]">Rate:</span>
                        <span>Rs. {tenant.electricityRate}/kWh</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs whitespace-nowrap"
                      style={{
                        backgroundColor: `${statusInfo.bgColor}20`,
                        color: statusInfo.bgColor,
                      }}
                    >
                      {statusInfo.status}
                    </span>
                    <ChevronRight className="w-5 h-5 text-[#A0A0A0]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
