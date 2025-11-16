import { Tenant } from '../lib/types';
import { UserPlus, Edit2, Trash2, Zap, Home, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface TenantsProps {
  tenants: Tenant[];
  onAddTenant: () => void;
  onEditTenant: (tenant: Tenant) => void;
  onDeleteTenant: (id: string) => void;
}

export default function Tenants({ tenants, onAddTenant, onEditTenant, onDeleteTenant }: TenantsProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this tenant?')) {
      onDeleteTenant(id);
      setActiveMenu(null);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Add Tenant Button */}
      <button
        onClick={onAddTenant}
        className="w-full bg-[#42A5F5] text-white rounded-xl p-4 flex items-center justify-center gap-2 active:bg-[#1E88E5] transition-colors"
      >
        <UserPlus className="w-5 h-5" />
        <span>Add New Tenant</span>
      </button>

      {/* Tenant List */}
      <div className="space-y-3">
        {tenants.length === 0 ? (
          <div className="bg-[#1F1F1F] rounded-xl p-8 border border-[#2A2A2A] text-center">
            <div className="text-[#A0A0A0] mb-4">No tenants yet</div>
            <button
              onClick={onAddTenant}
              className="text-[#42A5F5] hover:underline"
            >
              Add your first tenant
            </button>
          </div>
        ) : (
          tenants.map(tenant => (
            <div
              key={tenant.id}
              className="bg-[#1F1F1F] rounded-xl p-4 border border-[#2A2A2A] relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg">{tenant.name}</h3>
                    {tenant.active ? (
                      <span className="px-2 py-0.5 bg-[#66BB6A]/20 text-[#66BB6A] rounded text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#A0A0A0]/20 text-[#A0A0A0] rounded text-xs">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[#A0A0A0]">{tenant.flatNo}</div>
                  <div className="text-sm text-[#A0A0A0]">{tenant.phone}</div>
                </div>
                <button
                  onClick={() => setActiveMenu(activeMenu === tenant.id ? null : tenant.id)}
                  className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Services Badges */}
              <div className="flex gap-2 mb-3">
                {tenant.electricityService && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-[#42A5F5]/20 text-[#42A5F5] rounded-full text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Electricity</span>
                  </div>
                )}
                {tenant.rentService && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-[#FFA726]/20 text-[#FFA726] rounded-full text-sm">
                    <Home className="w-4 h-4" />
                    <span>Rent</span>
                  </div>
                )}
              </div>

              {/* Service Details */}
              <div className="space-y-2 text-sm">
                {tenant.electricityService && (
                  <div className="flex justify-between text-[#A0A0A0]">
                    <span>Electricity Rate:</span>
                    <span>Rs. {tenant.electricityRate}/kWh</span>
                  </div>
                )}
                {tenant.rentService && (
                  <div className="flex justify-between text-[#A0A0A0]">
                    <span>Monthly Rent:</span>
                    <span>Rs. {tenant.monthlyRent?.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Action Menu */}
              {activeMenu === tenant.id && (
                <div className="absolute right-4 top-16 bg-[#2A2A2A] rounded-lg shadow-lg border border-[#3A3A3A] overflow-hidden z-10">
                  <button
                    onClick={() => {
                      onEditTenant(tenant);
                      setActiveMenu(null);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[#3A3A3A] transition-colors text-left"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(tenant.id)}
                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[#3A3A3A] transition-colors text-left text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}