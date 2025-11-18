import { Bill, Tenant } from '../lib/types';

interface BillReceiptProps {
  bill: Bill;
  tenant: Tenant;
}

export default function BillReceipt({ bill, tenant }: BillReceiptProps) {
  return (
    <div className="bill-receipt border border-black p-2 h-full flex flex-col text-[10px] font-sans bg-white text-black">
      <h4 className="text-xs font-bold text-center mb-1 uppercase">Electricity Bill</h4>
      
      <div className="flex justify-between mb-1">
        <span>Tenant:</span>
        <span className="font-bold">{tenant.name}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Floor:</span>
        <span className="font-bold">{tenant.flatNo}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Period:</span>
        <span className="font-bold">{bill.period}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Date:</span>
        <span>{new Date(bill.date).toLocaleDateString('en-IN')}</span>
      </div>
      
      <div className="border-t border-dashed border-black my-1"></div>
      
      <div className="flex justify-between mb-1">
        <span>Current Reading:</span>
        <span>{bill.currentReading}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Prev Reading:</span>
        <span>{bill.previousReading}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Units Consumed:</span>
        <span className="font-bold">{bill.unitsConsumed}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span>Rate:</span>
        <span>Rs. {tenant.electricityRate}/kWh</span>
      </div>
      
      <div className="border-t border-dashed border-black my-1"></div>
      
      <div className="flex justify-between items-center mt-auto">
        <span className="font-bold text-xs">TOTAL:</span>
        <span className="font-bold text-sm">Rs. {bill.amount.toLocaleString()}.00</span>
      </div>
      
      <div className="text-center mt-1 text-[9px] border-t border-gray-200 pt-1 uppercase font-bold">
        PAID
      </div>
    </div>
  );
}