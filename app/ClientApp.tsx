"use client";

import { useState, useTransition } from "react";
import Dashboard from "../components/Dashboard";
import Tenants from "../components/Tenants";
import Electricity from "../components/Electricity";
import CustomerDetail from "../components/CustomerDetail";
import RentPayments from "../components/RentPayments";
import TenantForm from "../components/TenantForm";
import { Menu, X } from "lucide-react";
import { Tenant, Bill, RentPayment } from "../lib/types";
import {
  addTenant,
  editTenant,
  removeTenant,
  generateBill,
  markBillAsPaid,
  toggleRentPayment,
} from "./actions";

interface ClientAppProps {
  initialTenants: Tenant[];
  initialBills: Bill[];
  initialRentPayments: RentPayment[];
}

export default function ClientApp({
  initialTenants,
  initialBills,
  initialRentPayments,
}: ClientAppProps) {
  const [currentPage, setCurrentPage] = useState<
    | "dashboard"
    | "tenants"
    | "electricity"
    | "rent"
    | "customer-detail"
    | "tenant-form"
  >("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isPending, startTransition] = useTransition();

  const navigateTo = (page: typeof currentPage, tenant?: Tenant) => {
    if (tenant) {
      if (page === "customer-detail") {
        setSelectedTenant(tenant);
      } else if (page === "tenant-form") {
        setEditingTenant(tenant);
      }
    }
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const handleAddTenant = () => {
    setEditingTenant(null);
    setCurrentPage("tenant-form");
    setSidebarOpen(false);
  };

  const handleSaveTenant = async (tenant: Tenant) => {
    startTransition(async () => {
      try {
        if (editingTenant) {
          // Update existing tenant
          const { id, createdAt, updatedAt, ...tenantData } = tenant;
          await editTenant(id, tenantData);
        } else {
          // Create new tenant
          const { id, createdAt, updatedAt, ...tenantData } = tenant;
          await addTenant(tenantData);
        }
        setCurrentPage("tenants");
      } catch (error) {
        console.error("Error saving tenant:", error);
        alert("Failed to save tenant. Please try again.");
      }
    });
  };

  const handleDeleteTenant = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tenant?")) return;

    startTransition(async () => {
      try {
        await removeTenant(id);
      } catch (error) {
        console.error("Error deleting tenant:", error);
        alert("Failed to delete tenant. Please try again.");
      }
    });
  };

  const handleGenerateBill = async (
    tenantId: string,
    currentReading: number
  ) => {
    startTransition(async () => {
      try {
        await generateBill(tenantId, currentReading);
      } catch (error) {
        console.error("Error generating bill:", error);
        alert("Failed to generate bill. Please try again.");
      }
    });
  };

  const handleMarkBillAsPaid = async (billId: string) => {
    startTransition(async () => {
      try {
        await markBillAsPaid(billId);
      } catch (error) {
        console.error("Error marking bill as paid:", error);
        alert("Failed to mark bill as paid. Please try again.");
      }
    });
  };

  const handleToggleRentPayment = async (paymentId: string) => {
    startTransition(async () => {
      try {
        await toggleRentPayment(paymentId);
      } catch (error) {
        console.error("Error toggling rent payment:", error);
        alert("Failed to update payment status. Please try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#E0E0E0]">
      {/* Loading indicator */}
      {isPending && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-[#42A5F5] z-50 animate-pulse" />
      )}

      {/* Mobile Navigation */}
      <div className="sticky top-0 z-50 bg-[#111010] border-b border-[#2A2A2A]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <h1 className="text-lg">
            {currentPage === "dashboard" && "Dashboard"}
            {currentPage === "tenants" && "Tenants"}
            {currentPage === "electricity" && "Electricity Customers"}
            {currentPage === "rent" && "Rent Payments"}
            {currentPage === "customer-detail" && selectedTenant?.name}
            {currentPage === "tenant-form" &&
              (editingTenant ? "Edit Tenant" : "Add Tenant")}
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1F1F1F] border-r border-[#2A2A2A] z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl mb-8">Rent Manager</h2>
          <nav className="space-y-2">
            <button
              onClick={() => navigateTo("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === "dashboard"
                  ? "bg-[#42A5F5] text-white"
                  : "hover:bg-[#2A2A2A]"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateTo("tenants")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === "tenants"
                  ? "bg-[#42A5F5] text-white"
                  : "hover:bg-[#2A2A2A]"
              }`}
            >
              Tenants
            </button>
            <button
              onClick={() => navigateTo("electricity")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === "electricity"
                  ? "bg-[#42A5F5] text-white"
                  : "hover:bg-[#2A2A2A]"
              }`}
            >
              Electricity
            </button>
            <button
              onClick={() => navigateTo("rent")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === "rent"
                  ? "bg-[#42A5F5] text-white"
                  : "hover:bg-[#2A2A2A]"
              }`}
            >
              Rent Payments
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20">
        {currentPage === "dashboard" && (
          <Dashboard
            tenants={initialTenants}
            bills={initialBills}
            rentPayments={initialRentPayments}
            onNavigate={navigateTo}
          />
        )}
        {currentPage === "tenants" && (
          <Tenants
            tenants={initialTenants}
            onAddTenant={handleAddTenant}
            onEditTenant={(tenant) => navigateTo("tenant-form", tenant)}
            onDeleteTenant={handleDeleteTenant}
          />
        )}
        {currentPage === "electricity" && (
          <Electricity
            tenants={initialTenants}
            bills={initialBills}
            onSelectCustomer={(tenant) => navigateTo("customer-detail", tenant)}
          />
        )}
        {currentPage === "rent" && (
          <RentPayments
            tenants={initialTenants}
            rentPayments={initialRentPayments}
            onTogglePayment={handleToggleRentPayment}
          />
        )}
        {currentPage === "customer-detail" && selectedTenant && (
          <CustomerDetail
            tenant={selectedTenant}
            bills={initialBills.filter((b) => b.tenantId === selectedTenant.id)}
            onBack={() => setCurrentPage("electricity")}
            onGenerateBill={handleGenerateBill}
            onMarkAsPaid={handleMarkBillAsPaid}
          />
        )}
        {currentPage === "tenant-form" && (
          <TenantForm
            tenant={editingTenant}
            onSave={handleSaveTenant}
            onCancel={() => setCurrentPage("tenants")}
          />
        )}
      </main>
    </div>
  );
}
