'use server';

import { revalidatePath } from 'next/cache';
import {
  getAllTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  getAllBills,
  createBill,
  updateBill,
  getAllRentPayments,
  updateRentPayment
} from '../lib/db';
import { Tenant, Bill, RentPayment } from '../lib/types';
import { getCurrentPeriod, formatDateToISO } from '../lib/date-utils';

// Tenant Actions
export async function getTenants() {
  return await getAllTenants();
}

export async function addTenant(tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) {
  const newTenant = await createTenant(tenant);
  revalidatePath('/');
  return newTenant;
}

export async function editTenant(id: string, tenant: Partial<Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>>) {
  const updatedTenant = await updateTenant(id, tenant);
  revalidatePath('/');
  return updatedTenant;
}

export async function removeTenant(id: string) {
  await deleteTenant(id);
  revalidatePath('/');
}

// Bill Actions
export async function getBills() {
  return await getAllBills();
}

export async function generateBill(tenantId: string, currentReading: number) {
  const tenants = await getAllTenants();
  const tenant = tenants.find(t => t.id === tenantId);
  
  if (!tenant || !tenant.electricityRate) {
    throw new Error('Tenant not found or electricity rate not set');
  }

  const previousReading = tenant.currentMeterReading || tenant.initialMeterReading || 0;
  const unitsConsumed = currentReading - previousReading;
  const amount = unitsConsumed * tenant.electricityRate;

  const newBill = await createBill({
    tenantId,
    period: getCurrentPeriod(),
    previousReading,
    currentReading,
    unitsConsumed,
    amount,
    status: 'pending',
    date: formatDateToISO()
  });

  // Update tenant's current meter reading
  await updateTenant(tenantId, { currentMeterReading: currentReading });

  revalidatePath('/');
  return newBill;
}

export async function markBillAsPaid(billId: string) {
  const updatedBill = await updateBill(billId, {
    status: 'paid',
    paidDate: formatDateToISO()
  });
  revalidatePath('/');
  return updatedBill;
}

// Rent Payment Actions
export async function getRentPayments() {
  return await getAllRentPayments();
}

export async function toggleRentPayment(paymentId: string) {
  const payments = await getAllRentPayments();
  const payment = payments.find(p => p.id === paymentId);
  
  if (!payment) {
    throw new Error('Payment not found');
  }

  const updatedPayment = await updateRentPayment(paymentId, {
    status: payment.status === 'paid' ? 'pending' : 'paid',
    paidDate: payment.status === 'pending' ? formatDateToISO() : undefined
  });

  revalidatePath('/');
  return updatedPayment;
}