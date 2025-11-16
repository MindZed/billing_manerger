import { useState, useEffect } from 'react';
import { Tenant } from '../lib/types';
import { Save, X } from 'lucide-react';

interface TenantFormProps {
  tenant: Tenant | null;
  onSave: (tenant: Tenant) => void;
  onCancel: () => void;
}

export default function TenantForm({ tenant, onSave, onCancel }: TenantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    flatNo: '',
    active: true,
    electricityService: false,
    electricityRate: 15,
    initialMeterReading: 0,
    rentService: false,
    monthlyRent: 0,
    rentDueDay: 1
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        phone: tenant.phone,
        flatNo: tenant.flatNo,
        active: tenant.active,
        electricityService: tenant.electricityService,
        electricityRate: tenant.electricityRate || 15,
        initialMeterReading: tenant.initialMeterReading || 0,
        rentService: tenant.rentService,
        monthlyRent: tenant.monthlyRent || 0,
        rentDueDay: tenant.rentDueDay || 1
      });
    }
  }, [tenant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant: Tenant = {
      id: tenant?.id || '',
      ...formData
    };
    onSave(newTenant);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-[#1F1F1F] rounded-xl p-6 border border-[#2A2A2A] space-y-4">
          <h2 className="text-lg mb-4">Basic Information</h2>
          
          <div>
            <label className="block text-sm text-[#A0A0A0] mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 focus:outline-none focus:border-[#42A5F5] transition-colors"
              placeholder="Enter tenant name"
            />
          </div>

          <div>
            <label className="block text-sm text-[#A0A0A0] mb-2">Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 focus:outline-none focus:border-[#42A5F5] transition-colors"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-sm text-[#A0A0A0] mb-2">Flat / Unit No. *</label>
            <input
              type="text"
              required
              value={formData.flatNo}
              onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 focus:outline-none focus:border-[#42A5F5] transition-colors"
              placeholder="F101"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Active Status</span>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, active: !formData.active })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                formData.active ? 'bg-[#66BB6A]' : 'bg-[#3A3A3A]'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  formData.active ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Electricity Service */}
        <div className="bg-[#1F1F1F] rounded-xl p-6 border border-[#2A2A2A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Electricity Service</h2>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, electricityService: !formData.electricityService })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                formData.electricityService ? 'bg-[#42A5F5]' : 'bg-[#3A3A3A]'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  formData.electricityService ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {formData.electricityService && (
            <>
              <div>
                <label className="block text-sm text-[#A0A0A0] mb-2">Electricity Rate (Rs. per kWh) *</label>
                <input
                  type="number"
                  step="0.01"
                  required={formData.electricityService}
                  value={formData.electricityRate}
                  onChange={(e) => setFormData({ ...formData, electricityRate: parseFloat(e.target.value) })}
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 focus:outline-none focus:border-[#42A5F5] transition-colors"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A0A0A0] mb-2">Initial Meter Reading (kWh) *</label>
                <input
                  type="number"
                  required={formData.electricityService}
                  value={formData.initialMeterReading}
                  onChange={(e) => setFormData({ ...formData, initialMeterReading: parseInt(e.target.value) })}
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 focus:outline-none focus:border-[#42A5F5] transition-colors"
                  placeholder="1000"
                />
              </div>
            </>
          )}
        </div>

        {/* Rent Service */}
        <div className="bg-[#1F1F1F] rounded-xl p-6 border border-[#2A2A2A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Flat Rent Service</h2>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, rentService: !formData.rentService })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                formData.rentService ? 'bg-[#FFA726]' : 'bg-[#3A3A3A]'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  formData.rentService ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {formData.rentService && (
            <>
              <div>
                <label className="block text-sm text-[#A0A0A0] mb-2">Monthly Rent Amount (Rs.) *</label>
                <input
                  type="number"
                  required={formData.rentService}
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) })}
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 focus:outline-none focus:border-[#42A5F5] transition-colors"
                  placeholder="8000"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A0A0A0] mb-2">Rent Due Day *</label>
                <select
                  required={formData.rentService}
                  value={formData.rentDueDay}
                  onChange={(e) => setFormData({ ...formData, rentDueDay: parseInt(e.target.value) })}
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 focus:outline-none focus:border-[#42A5F5] transition-colors"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-[#2A2A2A] text-[#E0E0E0] rounded-xl p-4 flex items-center justify-center gap-2 active:bg-[#3A3A3A] transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="flex-1 bg-[#42A5F5] text-white rounded-xl p-4 flex items-center justify-center gap-2 active:bg-[#1E88E5] transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Save Tenant</span>
          </button>
        </div>
      </form>
    </div>
  );
}