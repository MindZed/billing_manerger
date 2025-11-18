"use client";

import { Printer } from "lucide-react";

export default function PrintWindowButton() {
  const openPrintWindow = () => {
    // Open the dedicated print page in a new popup window
    window.open(
      "/print-bills",
      "PrintBills",
      "height=600,width=800,resizable=yes,scrollbars=yes"
    );
  };

  return (
    <button
      onClick={openPrintWindow}
      className="w-full mt-2 border-teal-800/70 border-2 bg-gradient-to-r from-teal-800/70 to-emerald-900/30 flex items-center justify-center rounded-md mx-2 py-2"
      title="Open Print View"
    >
      
        <Printer className="w-5 h-5" />
        <span className="ml-2">Print Bills</span>
    </button>
  );
}
