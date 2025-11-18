'use client';

import { useEffect, useState } from 'react';
import { X, Printer } from 'lucide-react';

export default function AutoPrint() {
  const [isMobile, setIsMobile] = useState(false);
  const [status, setStatus] = useState('Preparing...');

  useEffect(() => {
    const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);

    const triggerPrint = () => {
      setStatus('Ready to Print');
      // Small buffer to ensure the UI update (removing "Preparing...") paints first
      setTimeout(() => {
        window.print();
        
        // Only auto-close on Desktop
        if (!mobileCheck) {
           // Optional: window.close() logic here
        }
      }, 100);
    };

    // If document is already loaded, print immediately. Otherwise wait.
    if (document.readyState === 'complete') {
      triggerPrint();
    } else {
      window.addEventListener('load', triggerPrint);
      return () => window.removeEventListener('load', triggerPrint);
    }
  }, []);

  const handleClose = () => {
    window.close();
  };

  const handleManualPrint = () => {
    window.print();
  };

  return (
    <div className="fixed top-4 left-4 z-50 no-print flex gap-2">
      {/* Manual Print Button (Helpful if auto-print fails on mobile) */}
      <button 
        onClick={handleManualPrint}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>

      <button 
        onClick={handleClose}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-colors"
      >
        <X className="w-4 h-4" />
        Close
      </button>
    </div>
  );
}