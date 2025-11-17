import { PrismaClient } from "@prisma/client";
import { Tenant, Bill, RentPayment } from "./types";
import { getBillingPeriod } from "./date-utils";

// Prisma Client Singleton Pattern
// This prevents multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Tenant Operations
export async function getAllTenants(): Promise<Tenant[]> {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
  });
  return tenants as Tenant[];
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { id },
  });
  return tenant as Tenant | null;
}

export async function createTenant(
  tenant: Omit<Tenant, "id" | "createdAt" | "updatedAt">
): Promise<Tenant> {
  const newTenant = await prisma.tenant.create({
    data: tenant,
  });
  return newTenant as Tenant;
}

export async function updateTenant(
  id: string,
  tenant: Partial<Omit<Tenant, "id" | "createdAt" | "updatedAt">>
): Promise<Tenant> {
  const updatedTenant = await prisma.tenant.update({
    where: { id },
    data: tenant,
  });
  return updatedTenant as Tenant;
}

export async function deleteTenant(id: string): Promise<void> {
  await prisma.tenant.delete({
    where: { id },
  });
}

// Bill Operations
export async function getAllBills(): Promise<Bill[]> {
  const bills = await prisma.bill.findMany({
    orderBy: { createdAt: "desc" },
  });
  return bills as Bill[];
}

export async function getCurrentBills(): Promise<Bill[]> {
  const currentPeriod = getBillingPeriod();
  const bills = await prisma.bill.findMany({
    where: { period: currentPeriod },
    orderBy: { createdAt: "desc" },
  });
  return bills as Bill[];
}

export async function getBillsByTenantId(tenantId: string): Promise<Bill[]> {
  const bills = await prisma.bill.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
  return bills as Bill[];
}

export async function createBill(
  bill: Omit<Bill, "id" | "createdAt" | "updatedAt">
): Promise<Bill> {
  const newBill = await prisma.bill.create({
    data: bill,
  });
  return newBill as Bill;
}

export async function updateBill(
  id: string,
  bill: Partial<Omit<Bill, "id" | "createdAt" | "updatedAt">>
): Promise<Bill> {
  const updatedBill = await prisma.bill.update({
    where: { id },
    data: bill,
  });
  return updatedBill as Bill;
}

// Rent Payment Operations
export async function getAllRentPayments(): Promise<RentPayment[]> {
  const payments = await prisma.rentPayment.findMany({
    orderBy: { createdAt: "desc" },
  });
  return payments as RentPayment[];
}

export async function getRentPaymentsByTenantId(
  tenantId: string
): Promise<RentPayment[]> {
  const payments = await prisma.rentPayment.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
  return payments as RentPayment[];
}

export async function createRentPayment(
  payment: Omit<RentPayment, "id" | "createdAt" | "updatedAt">
): Promise<RentPayment> {
  const newPayment = await prisma.rentPayment.create({
    data: payment,
  });
  return newPayment as RentPayment;
}

export async function updateRentPayment(
  id: string,
  payment: Partial<Omit<RentPayment, "id" | "createdAt" | "updatedAt">>
): Promise<RentPayment> {
  const updatedPayment = await prisma.rentPayment.update({
    where: { id },
    data: payment,
  });
  return updatedPayment as RentPayment;
}
