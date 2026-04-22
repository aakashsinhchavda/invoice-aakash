import React from 'react';

const InvoiceTemplate = ({ data }) => {
  const safeData = data || {};
  const vendor = safeData.vendor || {};

  const {
    poNumber = '4400026168',
    date = '2026-04-15',
    jobDetails = 'E/24/0022 500MW / 625 MWp Solar Project GIPCL-II K',
    jobStateCode = 'Gujarat',
    paymentTerms = '30 DAYS FROM BILL CERTIFIED',
    items = [],
    subTotal = 0,
    cgst = 0,
    sgst = 0,
    finalTotal = 0,
  } = safeData;

  const totalTax = cgst + sgst;

  const Logo = () => (
    <img
      src="logo.png"
      alt="SW Logo"
      className="w-16 h-auto"
    />
  );

  const formatCurrency = (val) => (val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatSubCurrency = (val) => (val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 });

  return (
    <div
      id="invoice-template"
      className="relative bg-white mx-auto print:m-0"
      style={{
        width: '210mm',
        minHeight: '297mm',
        color: '#000',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '10.5px',
        lineHeight: '1.1',
        padding: '8mm',
        boxSizing: 'border-box'
      }}
    >
      {/* Watermark */}
      <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ fontSize: '180px', fontWeight: '900', color: 'rgba(0,0,0,0.06)', letterSpacing: '15px', userSelect: 'none' }}>DRAFT</div>
      </div>

      <div className="relative z-10 border-[1.2px] border-black flex flex-col">
        {/* Header Section */}
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b-[1.2px] border-black">
              <td className="w-[125px] p-4 border-r-[1.2px] border-black text-center">
                <div className="inline-block"><Logo /></div>
              </td>
              <td className="p-1 text-center">
                <h1 className="text-[17px] font-black uppercase tracking-tighter">STERLING AND WILSON RENEWABLE ENERGY LIMITED</h1>
                <p className="text-[10.5px] font-bold">Khavda, Gujrat, 999999, India</p>
                <p className="text-[10px]">Tel : Fax : </p>
                <div className="mt-1 border-t-[1.2px] border-black py-0.5 font-bold text-[12px] uppercase">Service Purchase Order</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Metadata section with precise weights */}
        <table className="w-full border-collapse border-b-[1.2px] border-black">
          <tbody>
            <tr>
              <td className="w-1/2 p-1.5 border-r-[1.2px] border-black align-top">
                <div className="flex justify-between font-bold text-[9px] mb-0.5">
                  <span>Supplier Name & Address :</span>
                  <span className="font-bold">Vendor Code : {vendor.vendorCode}</span>
                </div>
                <div className="font-bold uppercase leading-tight">
                  <p className="text-[11.5px] mb-0.5">{vendor.name}</p>
                  <p className="font-bold text-[10px] whitespace-pre-line">{vendor.address}</p>
                  <div className="mt-2 text-[10px] space-y-0.5">
                    <p className="font-bold">Contact Name : </p>
                    <p className="font-bold">Tel No : {vendor.contact} &nbsp; Fax No : </p>
                    <p className="font-bold mt-1 text-[11px]">GSTIN: {vendor.gst}</p>
                  </div>
                </div>
              </td>
              <td className="w-1/2 align-top">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b-[1.2px] border-black h-8">
                      <td className="w-1/2 p-1.5 border-r-[1.2px] border-black font-bold text-[11px]">PO No : {poNumber}</td>
                      <td className="w-1/2 p-1.5 font-bold text-[11px]">Date : {new Date(date).toLocaleDateString('en-GB').replace(/\//g, '.')}</td>
                    </tr>
                    <tr className="border-b-[1.2px] border-black h-9">
                      <td className="w-1/2 p-1 border-r-[1.2px] border-black">
                        <span className="text-[8px] font-bold uppercase text-gray-700 block">Job State Code :</span>
                        <span className="text-[10.5px] font-bold">{jobStateCode}</span>
                      </td>
                      <td className="w-1/2 p-1">
                        <span className="text-[8px] font-bold uppercase text-gray-700 block">Currency :</span>
                        <span className="text-[10.5px] font-bold">INR</span>
                      </td>
                    </tr>
                    <tr className="border-b-[1.2px] border-black h-11">
                      <td colSpan="2" className="p-1 align-top">
                        <span className="text-[8px] font-bold uppercase text-gray-700 block">Job No :</span>
                        <span className="text-[11px] font-bold leading-tight">{jobDetails}</span>
                      </td>
                    </tr>
                    <tr className="h-8">
                      <td colSpan="2" className="p-1.5 italic font-bold text-[10px]">Payment Terms: {paymentTerms}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Dispatch/Invoice section */}
        <table className="w-full border-collapse border-b-[1.2px] border-black">
          <tbody>
            <tr>
              <td className="w-1/2 p-2 border-r-[1.2px] border-black align-top h-24 font-bold">
                <p className="text-[9px] border-b border-black inline-block mb-1">Dispatch to :</p>
                <p className="text-[10.5px] uppercase">STERLING AND WILSON RENEWABLE ENERGY LIMITED</p>
                <p className="text-[10px] mt-1 font-bold uppercase leading-tight">Khavda, Gujarat, 999999, India</p>
                <p className="text-[10px] font-bold mt-2">Place of Supply :</p>
              </td>
              <td className="w-1/2 p-2 align-top h-24 font-bold">
                <p className="text-[9px] border-b border-black inline-block mb-1">Invoice to :</p>
                <p className="text-[10.5px] uppercase">STERLING AND WILSON RENEWABLE ENERGY LIMITED</p>
                <div className="text-[9.5px] mt-1 uppercase leading-tight font-bold">
                  <p>115, Meghpravas, Mepaivandhni Bajuma, Bhuj, Godpar, Khavda, Kachchh, Gujarat, 370510</p>
                  <p className="mt-1">GSTIN: 24AAICR1703J1ZK</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Items Table with exact weight contrast */}
        <div className="flex-1 w-full bg-white">
          <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="border-b-[1.2px] border-black font-black h-7 text-center text-[10px] uppercase">
                <th className="border-r-[1.2px] border-black w-[45px]">Sr.No.</th>
                <th className="border-r-[1.2px] border-black text-left pl-3">Item Description</th>
                <th className="border-r-[1.2px] border-black w-[60px]">SAC</th>
                <th className="border-r-[1.2px] border-black w-[50px]">Qty</th>
                <th className="border-r-[1.2px] border-black w-[50px]">Unit</th>
                <th className="border-r-[1.2px] border-black w-[90px]">Rate</th>
                <th className="w-[100px]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const itemCGST = (item.amount || 0) * 0.09;
                const itemSGST = (item.amount || 0) * 0.09;
                return (
                  <React.Fragment key={index}>
                    {/* Parent row is BOLD */}
                    <tr className="align-top text-[10.5px] font-bold">
                      <td className="border-r-[1.2px] border-black p-1 text-center">{String((index + 1) * 10).padStart(5, '0')}</td>
                      <td className="border-r-[1.2px] border-black p-1 px-2 uppercase relative">
                         {item.description}
                         <div className="absolute right-2 top-1 italic font-black text-[10px]">
                            CGST<br />SGST
                         </div>
                      </td>
                      <td className="border-r-[1.2px] border-black p-1 text-center">{item.sac}</td>
                      <td className="border-r-[1.2px] border-black p-1 text-center underline font-black">{item.qty}</td>
                      <td className="border-r-[1.2px] border-black p-1 text-center uppercase">{item.unit}</td>
                      <td className="border-r-[1.2px] border-black p-1 text-right">
                        {formatCurrency(item.rate)}
                        <div className="mt-0 italic font-black text-[9.5px]">
                           9.00 %<br />9.00 %
                        </div>
                      </td>
                      <td className="p-1 text-right font-black">
                        {formatCurrency(item.amount)}
                        <div className="mt-0 text-[10px]">
                           {formatCurrency(itemCGST)}<br />{formatCurrency(itemSGST)}
                        </div>
                      </td>
                    </tr>

                    {/* Hierarchy sub-header (Bold/Italic) */}
                    {item.children?.length > 0 && (
                      <tr className="align-top text-[9.5px] font-bold italic">
                        <td className="border-r-[1.2px] border-black"></td>
                        <td className="border-r-[1.2px] border-black p-1 px-3">
                          The item covers the following services :
                        </td>
                        <td className="border-r-[1.2px] border-black"></td>
                        <td className="border-r-[1.2px] border-black"></td>
                        <td className="border-r-[1.2px] border-black"></td>
                        <td className="border-r-[1.2px] border-black"></td>
                        <td></td>
                      </tr>
                    )}

                    {/* Child rows are REGULAR weight (matching screenshot contrast) */}
                    {item.children?.map((child, sIdx) => (
                      <tr key={sIdx} className="align-top text-[10px]">
                        <td className="border-r-[1.2px] border-black p-1 text-right font-bold pr-2">{child.label}</td>
                        <td className="border-r-[1.2px] border-black p-1 px-2 uppercase">
                           {child.description}
                           {child.notes && <p className="text-[8.5px] italic text-gray-500 mt-0.5">{child.notes}</p>}
                        </td>
                        <td className="border-r-[1.2px] border-black p-1"></td>
                        <td className="border-r-[1.2px] border-black p-1 text-center font-bold">{child.qty}</td>
                        <td className="border-r-[1.2px] border-black p-1 text-center uppercase">{child.unit}</td>
                        <td className="border-r-[1.2px] border-black p-1 text-right">{formatSubCurrency(child.rate)}</td>
                        <td className="p-1 text-right">{formatSubCurrency(child.amount)}</td>
                      </tr>
                    ))}

                    {/* Section Separator */}
                    <tr className="border-b-[1.2px] border-black"><td colSpan="7" className="p-0.5"></td></tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals Section (Heavy Bold) */}
        <table className="w-full border-collapse text-[10.5px] font-black">
          <tbody>
            <tr className="border-b-[1.2px] border-black h-7 uppercase">
              <td colSpan="6" className="border-r-[1.2px] border-black p-1 text-right pr-3">Total Net Amount</td>
              <td className="w-[100px] p-1 text-right underline">{formatCurrency(subTotal)}</td>
            </tr>
            <tr className="border-b-[0.5px] border-black h-6">
              <td colSpan="6" className="border-r-[1.2px] border-black p-1 text-right pr-3">CGST</td>
              <td className="p-1 text-right">{formatCurrency(cgst)}</td>
            </tr>
            <tr className="border-b-[0.5px] border-black h-6">
              <td colSpan="6" className="border-r-[1.2px] border-black p-1 text-right pr-3">SGST</td>
              <td className="p-1 text-right">{formatCurrency(sgst)}</td>
            </tr>
            <tr className="border-b-[1.2px] border-black h-7 uppercase italic">
              <td colSpan="6" className="border-r-[1.2px] border-black p-1 text-right pr-3">Total TAX</td>
              <td className="p-1 text-right underline font-black">{formatCurrency(totalTax)}</td>
            </tr>
            <tr className="h-10 text-[13px] uppercase font-black">
              <td colSpan="6" className="border-r-[1.2px] border-black p-1.5 text-right pr-3 align-middle">Total Amount Including Tax</td>
              <td className="p-1.5 text-right border-b-[5px] border-double border-black underline align-middle">{formatCurrency(finalTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-[9.5px] font-bold text-right italic uppercase tracking-wider">Page 1 of 1</div>
    </div>
  );
};

export default InvoiceTemplate;
