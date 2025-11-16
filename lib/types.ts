export interface Tenant {
  id: string;
  name: string;
  phone: string;
  flatNo: string;
  active: boolean;
  electricityService: boolean;
  electricityRate?: number;
  initialMeterReading?: number;
  currentMeterReading?: number;
  rentService: boolean;
  monthlyRent?: number;
  rentDueDay?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Bill {
  id: string;
  tenantId: string;
  period: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  amount: number;
  status: 'pending' | 'paid';
  date: string;
  paidDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RentPayment {
  id: string;
  tenantId: string;
  month: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  paidDate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
