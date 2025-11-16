import { Tenant, Bill, RentPayment } from '../lib/types';
import { Zap, DollarSign, AlertCircle, TrendingUp, ChevronRight } from 'lucide-react';
import { getCurrentPeriod } from '../lib/date-utils';

interface DashboardProps {
  tenants: Tenant[];
  bills: Bill[];
  rentPayments: RentPayment[];
  onNavigate: (page: 'electricity' | 'rent', tenant?: Tenant) => void;
}

export default function Dashboard({ tenants, bills, rentPayments, onNavigate }: DashboardProps) {
  const currentPeriod = getCurrentPeriod();
  
  // Calculate stats
  const currentMonthBills = bills.filter(b => b.period === currentPeriod);
  const pendingBills = currentMonthBills.filter(b => b.status === 'pending');
  const paidBills = currentMonthBills.filter(b => b.status === 'paid');
  
  const totalElectricityRevenue = paidBills.reduce((sum, b) => sum + b.amount, 0);
  
  const currentMonthRent = rentPayments.filter(r => r.month === currentPeriod);
  const unpaidRent = currentMonthRent.filter(r => r.status === 'pending');
  const paidRent = currentMonthRent.filter(r => r.status === 'paid');
  
  const totalRentRevenue = paidRent.reduce((sum, r) => sum + r.amount, 0);
  
  const totalRevenue = totalElectricityRevenue + totalRentRevenue;
  
  const totalUnitsConsumed = currentMonthBills.reduce((sum, b) => sum + b.unitsConsumed, 0);
  
  // Pending meter readings
  const needsReading = tenants.filter(t => 
    t.electricityService && 
    !currentMonthBills.find(b => b.tenantId === t.id)
  );

  return (
    <div className="p-4 space-y-4">
      {/* Key Stats Cards */}
      <div className="space-y-4">
        {/* Total Monthly Revenue */}
        <div className="bg-[#1F1F1F] rounded-xl p-6 border-2 border-[#42A5F5]">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-[#42A5F5]/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#42A5F5]" />
            </div>
            <span className="px-3 py-1 bg-[#FFA726]/20 text-[#FFA726] rounded-full text-xs">
              {currentPeriod}
            </span>
          </div>
          <div className="text-sm text-[#A0A0A0] mb-1">Total Monthly Revenue</div>
          <div className="text-3xl mb-1">Rs. {totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-[#A0A0A0]">
            Electricity: Rs. {totalElectricityRevenue.toLocaleString()} + Rent: Rs. {totalRentRevenue.toLocaleString()}
          </div>
        </div>

        {/* Pending Bills */}
        <div 
          className="bg-[#1F1F1F] rounded-xl p-6 border border-[#2A2A2A] active:bg-[#252525] transition-colors cursor-pointer"
          onClick={() => onNavigate('electricity')}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-[#FFA726]/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-[#FFA726]" />
            </div>
            <span className="px-3 py-1 bg-[#FFA726]/20 text-[#FFA726] rounded-full text-xs">
              To Bill
            </span>
          </div>
          <div className="text-sm text-[#A0A0A0] mb-1">Pending Bills</div>
          <div className="text-3xl mb-1">{pendingBills.length}</div>
          <div className="text-xs text-[#A0A0A0]">Unpaid electricity bills</div>
        </div>

        {/* Unpaid Rent */}
        <div 
          className="bg-[#1F1F1F] rounded-xl p-6 border border-[#2A2A2A] active:bg-[#252525] transition-colors cursor-pointer"
          onClick={() => onNavigate('rent')}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-[#FFA726]/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-[#FFA726]" />
            </div>
            <span className="px-3 py-1 bg-[#FFA726]/20 text-[#FFA726] rounded-full text-xs">
              To Collect
            </span>
          </div>
          <div className="text-sm text-[#A0A0A0] mb-1">Unpaid Rent</div>
          <div className="text-3xl mb-1">{unpaidRent.length}</div>
          <div className="text-xs text-[#A0A0A0]">
            Amount: Rs. {unpaidRent.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
          </div>
        </div>

        {/* Total Units Consumed */}
        <div className="bg-[#1F1F1F] rounded-xl p-6 border border-[#2A2A2A]">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-[#66BB6A]/20 rounded-lg">
              <Zap className="w-6 h-6 text-[#66BB6A]" />
            </div>
            <TrendingUp className="w-5 h-5 text-[#66BB6A]" />
          </div>
          <div className="text-sm text-[#A0A0A0] mb-1">Total Units Consumed</div>
          <div className="text-3xl mb-1">{totalUnitsConsumed} kWh</div>
          <div className="text-xs text-[#A0A0A0]">This month ({currentPeriod})</div>
        </div>
      </div>

      {/* Pending Actions Section */}
      {needsReading.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg px-2">Pending Actions</h2>
          <div className="space-y-2">
            {needsReading.map(tenant => (
              <div
                key={tenant.id}
                onClick={() => onNavigate('electricity', tenant)}
                className="bg-[#1F1F1F] rounded-xl p-4 border border-[#FFA726]/30 active:bg-[#252525] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FFA726]/20 rounded-lg">
                      <Zap className="w-5 h-5 text-[#FFA726]" />
                    </div>
                    <div>
                      <div className="mb-1">{tenant.flatNo} - Needs Reading</div>
                      <div className="text-sm text-[#A0A0A0]">{tenant.name}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#A0A0A0]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Summary */}
      <div className="bg-[#1F1F1F] rounded-xl p-6 border border-[#2A2A2A]">
        <h2 className="text-lg mb-4">Quick Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[#A0A0A0]">Total Tenants</span>
            <span>{tenants.filter(t => t.active).length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#A0A0A0]">Electricity Customers</span>
            <span>{tenants.filter(t => t.electricityService).length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#A0A0A0]">Rent Customers</span>
            <span>{tenants.filter(t => t.rentService).length}</span>
          </div>
          <div className="h-px bg-[#2A2A2A] my-2" />
          <div className="flex justify-between items-center">
            <span className="text-[#A0A0A0]">Bills Generated</span>
            <span className="text-[#66BB6A]">{currentMonthBills.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#A0A0A0]">Payments Received</span>
            <span className="text-[#66BB6A]">{paidBills.length + paidRent.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}