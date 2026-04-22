'use client';

import React, { useState } from 'react';
import InvoiceForm from '@/components/InvoiceForm';
import InvoiceTemplate from '@/components/InvoiceTemplate';

export default function NewInvoicePage() {
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
          vendorId: invoiceData.vendor?._id // ensure ID is passed
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
    <div className="flex h-full overflow-hidden">
      {/* Form Area */}
      <div className="w-[500px] border-r bg-white overflow-y-auto h-full">
         <InvoiceForm 
            onPreviewUpdate={handlePreviewUpdate} 
            onDownload={handleDownloadPDF} 
          />
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-8 overflow-y-auto flex justify-center items-start bg-gray-100">
        <div className="transform scale-[0.7] xl:scale-[0.8] origin-top shadow-2xl mb-20">
          <InvoiceTemplate data={invoiceData} />
        </div>
      </div>
    </div>
  );
}
