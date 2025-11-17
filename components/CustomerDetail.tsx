import { useState } from "react";
import { Tenant, Bill } from "../lib/types";
import {
  ArrowLeft,
  Zap,
  TrendingUp,
  Calendar,
  IndianRupee,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getBillingPeriod } from "@/lib/date-utils";

interface CustomerDetailProps {
  tenant: Tenant;
  bills: Bill[];
  onBack: () => void;
  onGenerateBill: (tenantId: string, currentReading: number) => void;
  onMarkAsPaid: (billId: string) => void;
}

export default function CustomerDetail({
  tenant,
  bills,
  onBack,
  onGenerateBill,
  onMarkAsPaid,
}: CustomerDetailProps) {
  const [currentReading, setCurrentReading] = useState<string>("");
  const previousReading =
    tenant.currentMeterReading || tenant.initialMeterReading || 0;
  const unitsConsumed = currentReading
    ? parseInt(currentReading) - previousReading
    : 0;
  const estimatedBill = unitsConsumed * (tenant.electricityRate || 0);

  const handleGenerateBill = () => {
    if (currentReading && parseInt(currentReading) > previousReading) {
      onGenerateBill(tenant.id, parseInt(currentReading));
      setCurrentReading("");
    }
  };

  // Sort bills by date descending
  const sortedBills = [...bills].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const isBillGenerated = sortedBills[0]?.period === getBillingPeriod();

  // Prepare chart data
  const chartData = [...bills]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-6)
    .map((bill) => ({
      month: bill.period.split(" ")[0],
      units: bill.unitsConsumed,
    }));

  return (
    <div className="p-4 space-y-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-600 mb-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Customers</span>
      </button>

      {/* Tenant Info */}
      <div className="bg-gradient-to-t from-teal-950/60 to-teal-950/20 rounded-xl p-6 border border-[#2A2A2A]">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-3 bg-teal-700/20 rounded-lg">
            <Zap className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl mb-1">{tenant.name}</h2>
            <div className="text-sm text-[#A0A0A0]">{tenant.flatNo}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-[#A0A0A0] mb-1">Billing Rate</div>
            <div>Rs. {tenant.electricityRate}/kWh</div>
          </div>
          <div>
            <div className="text-[#A0A0A0] mb-1">Phone</div>
            <div>{tenant.phone}</div>
          </div>
        </div>
      </div>

      {/* Enter Meter Reading */}

      {!isBillGenerated && (
        <div className="bg-gradient-to-br from-green-600/30 to-green-950/10 rounded-xl p-6 border-2 border-green-600/30">
          <h3 className="text-lg mb-4">Enter Meter Reading</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#A0A0A0]">Previous Reading:</span>
              <span className="text-lg">{previousReading} kWh</span>
            </div>

            <div>
              <label className="block text-sm text-[#A0A0A0] mb-2">
                Current Meter Reading (kWh)
              </label>
              <input
                type="number"
                value={currentReading}
                onChange={(e) => setCurrentReading(e.target.value)}
                className="w-full bg-black/40 border border-[#3A3A3A] rounded-lg px-4 py-4 text-2xl text-center focus:outline-none focus:border-green-500 transition-colors"
                placeholder={previousReading.toString()}
                min={previousReading + 1}
              />
            </div>

            {currentReading && parseInt(currentReading) > previousReading && (
              <div className="space-y-3 p-4 bg-teal-950/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[#A0A0A0]">Units Consumed:</span>
                  <span className="text-xl text-emerald-600">
                    {unitsConsumed} kWh
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#A0A0A0]">Rate:</span>
                  <span>Rs. {tenant.electricityRate}/kWh</span>
                </div>
                <div className="h-px bg-[#3A3A3A]" />
                <div className="flex justify-between items-center">
                  <span>Estimated Bill:</span>
                  <span className="text-2xl text-emerald-600">
                    Rs. {estimatedBill.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateBill}
              disabled={
                !currentReading || parseInt(currentReading) <= previousReading
              }
              className="w-full bg-emerald-700 text-white rounded-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed active:bg-[#1E88E5] transition-colors"
            >
              Generate Bill
            </button>
          </div>
        </div>
      )}

      {/* Consumption Trend Chart */}
      {chartData.length > 0 && (
        <div className="bg-teal-950/40 rounded-xl p-6 border border-[#2A2A2A]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg">Consumption Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="emeraldGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />

              <XAxis
                dataKey="month"
                stroke="#A0A0A0"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#A0A0A0"
                style={{ fontSize: "12px" }}
                label={{
                  value: "kWh",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#A0A0A0",
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#2A2A2A",
                  border: "1px solid #3A3A3A",
                  borderRadius: "8px",
                  color: "#E0E0E0",
                }}
              />

              <Area
                type="monotone"
                dataKey="units"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#emeraldGradient)"
                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Billing History */}
      <div className="bg-teal-950/40 rounded-xl p-6 border border-[#2A2A2A]">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg">Billing History</h3>
        </div>

        {sortedBills.length === 0 ? (
          <div className="text-center py-8 text-[#A0A0A0]">
            No billing history yet
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBills.map((bill) => (
              <div
                key={bill.id}
                className="bg-emerald-800/20 rounded-lg p-4 border border-emerald-950"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{bill.period}</span>
                      {bill.status === "paid" ? (
                        <span className="px-2 py-0.5 bg-[#66BB6A]/20 text-[#66BB6A] rounded text-xs">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#FFA726]/20 text-[#FFA726] rounded text-xs">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#A0A0A0]">
                      {new Date(bill.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-400 mb-1">
                      <IndianRupee className="w-4 h-4" />
                      <span>{bill.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-[#A0A0A0]">
                      {bill.unitsConsumed} kWh
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-[#A0A0A0] mb-3">
                  <span>
                    Reading: {bill.previousReading} → {bill.currentReading}
                  </span>
                  <span>@ Rs. {tenant.electricityRate}/kWh</span>
                </div>

                {bill.status === "pending" && (
                  <button
                    onClick={() => onMarkAsPaid(bill.id)}
                    className="w-full bg-[#66BB6A] text-white rounded-lg py-2 text-sm active:bg-[#4CAF50] transition-colors"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
