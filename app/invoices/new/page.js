'use client';

import React, { useState } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoiceTemplate from '@/components/InvoiceTemplate';
import { Eye, Edit3 } from 'lucide-react';

export default function NewInvoicePage() {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const [invoiceData, setInvoiceData] = useState({
    poNumber: '4400026168',
    date: '2026-04-15',
    vendor: {},
    jobDetails: 'E/24/0022 500MW / 625 MWp Solar Project GIPCL-II K',
    jobStateCode: 'Gujarat',
    paymentTerms: '30 DAYS FROM BILL CERTIFIED',
    items: [
      {
        description: 'HIRING CHARGES OF VEHICLE',
        sac: '9966',
        unit: 'AU',
        qty: 1,
        rate: 2727500,
        amount: 2727500,
        isGroup: true,
        children: [
          { label: '10', description: 'HIRING CHARGES FOR SCORPIO', notes: "Feburary'2026 To June '2026", qty: 10, unit: 'MON', rate: 69000, amount: 690000 },
          { label: '20', description: 'HIRING CHARGES FOR BOLERO', notes: "Feburary'2026 To June '2026", qty: 15, unit: 'MON', rate: 64000, amount: 960000 },
          { label: '30', description: 'Toll Tax & Parking Charges', notes: "EXTRA KM FEB'26 TO JUN'26 SCORPIO", qty: 5, unit: 'MON', rate: 10000, amount: 50000 },
          { label: '40', description: "EXTRA KM FEB'26 TO JUN'26 SCORPIO", notes: "", qty: 37500, unit: 'KM', rate: 12, amount: 450000 },
          { label: '50', description: "EXTRA KM FEB'26 TO JUN'26 BOLERO", notes: "", qty: 52500, unit: 'KM', rate: 11, amount: 577500 },
        ]
      }
    ],
    subTotal: 2727500,
    cgst: 245475,
    sgst: 245475,
    finalTotal: 3218450,
  });

  const handlePreviewUpdate = (data) => {
    setInvoiceData(data);
  };

  const handleDownloadPDF = async () => {
    const invoiceHtml = document.getElementById('invoice-template').outerHTML;
    
    // Save to database first
    try {
      await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...invoiceData,
          vendorId: invoiceData.vendor?._id
        }),
      });
    } catch (e) {
      console.warn("Failed to save invoice to history", e);
    }

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4; margin: 0 !important; }
            body { margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${invoiceHtml}
        </body>
      </html>
    `;

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: fullHtml }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoiceData.poNumber || 'New'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-gray-50">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex bg-white border-b sticky top-0 z-20">
        <button 
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center border-b-2 transition-all ${activeTab === 'edit' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-400'}`}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Details
        </button>
        <button 
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-sm font-bold flex items-center justify-center border-b-2 transition-all ${activeTab === 'preview' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-400'}`}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Preview
        </button>
      </div>

      {/* Form Area */}
      <div className={`
        ${activeTab === 'edit' ? 'flex' : 'hidden'} lg:flex
        w-full lg:w-[480px] xl:w-[500px] lg:border-r bg-white overflow-y-auto h-full lg:shrink-0
      `}>
         <div className="w-full h-full">
           <InvoiceForm 
              onPreviewUpdate={handlePreviewUpdate} 
              onDownload={handleDownloadPDF} 
            />
         </div>
      </div>

      {/* Preview Area */}
      <div className={`
        ${activeTab === 'preview' ? 'flex' : 'hidden'} lg:flex
        flex-1 p-4 md:p-8 overflow-y-auto justify-center items-start bg-gray-100/50 backdrop-blur-sm
      `}>
        <div className="w-full flex justify-center py-10 lg:py-0">
          <div className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.75] xl:scale-[0.85] origin-top shadow-2xl transition-transform duration-300">
            <InvoiceTemplate data={invoiceData} />
          </div>
        </div>
      </div>
    </div>
  );
}
