import { Tenant, Bill, RentPayment } from '../lib/types';
import { Zap, IndianRupee, AlertCircle, TrendingUp, ChevronRight, TicketCheck, ReceiptIndianRupee   } from 'lucide-react';
import { getBillingPeriod } from '../lib/date-utils';

interface DashboardProps {
  tenants: Tenant[];
  bills: Bill[];
  rentPayments: RentPayment[];
  onNavigate: (page: 'electricity' | 'rent', tenant?: Tenant) => void;
}

export default function Dashboard({ tenants, bills, rentPayments, onNavigate }: DashboardProps) {
  const currentPeriod = getBillingPeriod();
  
  // Calculate stats
  const currentMonthBills = bills
  const pendingBills = currentMonthBills.filter(b => b.status === 'pending');
  const paidBills = currentMonthBills.filter(b => b.status === 'paid');

  const totalElectricityRevenue = paidBills.reduce((sum, b) => sum + b.amount, 0);
  const expectedElectricityRevenue = currentMonthBills.reduce((sum, b) => sum + b.amount, 0);
  const pendingElectricityRevenue =  expectedElectricityRevenue - totalElectricityRevenue;
  
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
        <div className="bg-gradient-to-br from-teal-950 to-teal-900/10 rounded-xl p-6 border-2 border-teal-950">
          <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-emerald-900/50 rounded-lg">
              <IndianRupee className="w-6 h-6 text-green-500" />
            </div>
            <span className="px-3 py-1 bg-white/20 text-green-400 rounded-full text-xs">
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
          className="bg-[#121010] rounded-xl p-6 border border-[#2A2A2A] active:bg-[#252525] transition-colors cursor-pointer"
          onClick={() => onNavigate('electricity')}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-teal-700/20 rounded-lg">
              <TicketCheck className="w-6 h-6 text-teal-600" />
            </div>
            <span className={`px-3 py-1  ${pendingBills.length === 0? 'bg-green-800/50 text-emerald-400' :'text-yellow-600 bg-orange-900/50'} rounded-full text-xs`}>
              {pendingBills.length === 0? 'Relax!' :'To Collect'}
            </span>
          </div>
          <div className="text-sm text-[#A0A0A0] mb-1">Pending Electricity Bills</div>
          <div className="text-3xl mb-1">0{pendingBills.length}</div>
          <div className="text-xs text-[#A0A0A0]">Expected: {expectedElectricityRevenue}, Remaining: {pendingElectricityRevenue} </div>
        </div>

        {/* Unpaid Rent */}
        <div 
          className="bg-[#121010] rounded-xl p-6 border border-[#2A2A2A] active:bg-[#252525] transition-colors cursor-pointer"
          onClick={() => onNavigate('rent')}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-teal-700/20 rounded-lg">
              <ReceiptIndianRupee className="w-6 h-6 text-teal-600" />
            </div>
            <span className={`px-3 py-1  ${pendingBills.length === 0? 'bg-green-800/50 text-emerald-400' :'text-yellow-600 bg-orange-900/50'} rounded-full text-xs`}>
              {pendingBills.length === 0? 'Relax!' :'To Collect'}
            </span>
          </div>
          <div className="text-sm text-[#A0A0A0] mb-1">Unpaid Rent</div>
          <div className="text-3xl mb-1">{unpaidRent.length}</div>
          <div className="text-xs text-[#A0A0A0]">
            Amount: Rs. {unpaidRent.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
          </div>
        </div>

        {/* Total Units Consumed */}
        <div className="bg-gradient-to-t from-emerald-500/30 to-emerald-900/30 rounded-xl p-6 border border-[#2A2A2A]">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-teal-700/20 rounded-lg">
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
                className="bg-orange-500/10 rounded-xl p-4 border border-[#FFA726]/30 active:bg-[#252525] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Zap className="w-5 h-5 text-[#FFA726]" />
                    </div>
                    <div>
                      <div className="mb-1">{tenant.name} - Needs Reading</div>
                      <div className="text-sm text-[#A0A0A0]">{tenant.phone}</div>
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