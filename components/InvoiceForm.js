'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, UserPlus, Library, Save } from 'lucide-react';

const MOCK_VENDORS = [
  {
    _id: 'mock1',
    name: 'A J ENTERPRISE',
    address: 'KHALIFA VAAS, MAIN BAJAR, Panandhro,\nKachchh, 370601, India',
    gst: '24EEUPA7436G1ZB',
    contact: '916351724788',
    vendorCode: '576675'
  }
];

const InvoiceForm = ({ onPreviewUpdate, onDownload }) => {
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [masterItems, setMasterItems] = useState([]);
  const [formData, setFormData] = useState({
    poNumber: '4400026168',
    date: '2026-04-15',
    vendorId: 'mock1',
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
  });

  const [selectedVendor, setSelectedVendor] = useState(MOCK_VENDORS[0]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', address: '', gst: '', contact: '', vendorCode: '' });

  useEffect(() => {
    fetchVendors();
    fetchMasterItems();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.poNumber, formData.date, formData.jobDetails, formData.jobStateCode, formData.paymentTerms, selectedVendor]);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/vendors');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setVendors(data.length > 0 ? data : MOCK_VENDORS);
          if (data.length > 0) setSelectedVendor(data[0]);
        }
      }
    } catch (e) {
      setVendors(MOCK_VENDORS);
    }
  };

  const fetchMasterItems = async () => {
    try {
      const res = await fetch('/api/items');
      if (res.ok) {
        const data = await res.json();
        setMasterItems(data);
      }
    } catch (e) {
      console.warn("Fetch master items failed", e);
    }
  };

  const handleVendorChange = (e) => {
    const id = e.target.value;
    const vendor = vendors.find(v => v._id === id);
    setSelectedVendor(vendor || MOCK_VENDORS[0]);
    setFormData(prev => ({ ...prev, vendorId: id }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSubItemChange = (itemIndex, subIndex, field, value) => {
    const newItems = [...formData.items];
    const subItem = newItems[itemIndex].children[subIndex];
    subItem[field] = value;
    
    if (field === 'qty' || field === 'rate') {
      subItem.amount = subItem.qty * subItem.rate;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { 
        description: '', 
        sac: '', 
        unit: 'AU', 
        qty: 1, 
        rate: 0, 
        amount: 0, 
        isGroup: true, 
        children: [] 
      }]
    });
  };

  const addSubItem = (index) => {
    const newItems = [...formData.items];
    const nextLabel = (newItems[index].children.length + 1) * 10;
    newItems[index].children.push({ 
      label: nextLabel.toString(), 
      description: '', 
      notes: '', 
      qty: 1, 
      unit: 'Nos', 
      rate: 0, 
      amount: 0 
    });
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const removeSubItem = (itemIndex, subIndex) => {
    const newItems = [...formData.items];
    newItems[itemIndex].children = newItems[itemIndex].children.filter((_, i) => i !== subIndex);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotals = () => {
    const updatedItems = formData.items.map(item => {
      if (item.isGroup && item.children) {
        const itemTotal = item.children.reduce((sum, child) => sum + (child.amount || 0), 0);
        return { ...item, amount: itemTotal };
      }
      return item;
    });

    const subTotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const cgst = subTotal * 0.09;
    const sgst = subTotal * 0.09;
    const finalTotal = subTotal + cgst + sgst;

    const updatedData = { ...formData, items: updatedItems, subTotal, cgst, sgst, finalTotal, vendor: selectedVendor };
    onPreviewUpdate(updatedData);
  };

  const applyMasterItem = (index, masterItemId) => {
    const master = masterItems.find(m => m._id === masterItemId);
    if (!master) return;

    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      description: master.title,
      sac: master.sac,
      unit: master.unit,
      children: master.defaultChildren.map(child => ({ ...child, amount: child.qty * child.rate }))
    };
    setFormData({ ...formData, items: newItems });
  };

  const saveToLibrary = async (index) => {
    const item = formData.items[index];
    const payload = {
      title: item.description,
      sac: item.sac,
      unit: item.unit,
      defaultChildren: item.children.map(({ label, description, qty, unit, rate }) => ({
        label, description, qty, unit, rate
      }))
    };

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const saved = await res.json();
        setMasterItems([...masterItems, saved]);
        alert('Saved to library!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveVendor = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor),
      });
      if (res.ok) {
        const savedVendor = await res.json();
        setVendors([...vendors, savedVendor]);
        setShowVendorModal(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Invoice Details</h2>
        <button 
          onClick={() => onDownload()}
          className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-bold shadow-md"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 px-1">PO Number</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={formData.poNumber}
            onChange={(e) => setFormData({...formData, poNumber: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 px-1">Date</label>
          <input 
            type="date" 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-inner"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1 px-1">
          <label className="block text-xs font-bold text-gray-400 uppercase">Select Vendor</label>
          <button 
            onClick={() => setShowVendorModal(true)}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center"
          >
            <UserPlus className="w-3 h-3 mr-1" />
            Add Vendor
          </button>
        </div>
        <select 
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
          value={formData.vendorId}
          onChange={handleVendorChange}
        >
          {vendors.map(v => (
            <option key={v._id || v.vendorCode} value={v._id}>{v.name} ({v.vendorCode})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 px-1">Job State Code</label>
          <input 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
            value={formData.jobStateCode}
            onChange={(e) => setFormData({...formData, jobStateCode: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 px-1">Payment Terms</label>
          <input 
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
            value={formData.paymentTerms}
            onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 px-1">Job Details</label>
        <textarea 
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-16 shadow-inner"
          value={formData.jobDetails}
          onChange={(e) => setFormData({...formData, jobDetails: e.target.value})}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 uppercase mb-3 border-b pb-2 flex items-center">
          <Plus className="w-4 h-4 mr-2 text-blue-600" />
          Service Groups
        </h3>
        <div className="space-y-6">
          {formData.items.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 relative group shadow-sm">
              <button 
                onClick={() => removeItem(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-12 gap-3 mb-4">
                <div className="col-span-12 flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 px-1">Service Category</label>
                    <input 
                      placeholder="e.g. HIRING CHARGES OF VEHICLE"
                      className="w-full p-2 text-sm font-bold border rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-blue-500 outline-none"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="w-40 mr-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 px-1 flex items-center">
                      <Library className="w-2.5 h-2.5 mr-1" />
                      Library
                    </label>
                    <select 
                      className="w-full p-2 text-[10px] border rounded-lg bg-blue-50 border-blue-100 font-bold text-blue-700 outline-none"
                      onChange={(e) => applyMasterItem(index, e.target.value)}
                      value=""
                    >
                      <option value="">Load...</option>
                      {masterItems.map(m => (
                        <option key={m._id} value={m._id}>{m.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-span-4">
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 px-1">SAC Code</label>
                   <input className="w-full p-2 text-xs border rounded-lg bg-white" value={item.sac} onChange={(e) => handleItemChange(index, 'sac', e.target.value)} />
                </div>
                <div className="col-span-4">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 px-1">Unit</label>
                  <input className="w-full p-2 text-xs border rounded-lg bg-white uppercase" value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} />
                </div>
                <div className="col-span-4 pt-4 px-1">
                   <button 
                    onClick={() => saveToLibrary(index)}
                    className="w-full h-9 flex items-center justify-center bg-white text-green-600 border border-green-200 rounded-lg text-[10px] font-bold uppercase hover:bg-green-50"
                   >
                     <Save className="w-3 h-3 mr-1" />
                     Save Group
                   </button>
                </div>
              </div>

              {/* Sub-items (Children) */}
              <div className="ml-4 pl-4 border-l-2 border-blue-100 space-y-2">
                {item.children?.map((child, sIdx) => (
                  <div key={sIdx} className="grid grid-cols-12 gap-2 bg-white p-2 rounded-xl border border-gray-100 relative group/sub">
                    <button 
                      onClick={() => removeSubItem(index, sIdx)}
                      className="absolute -top-1 -right-1 p-0.5 bg-red-50 text-red-400 rounded-full opacity-0 group-hover/sub:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="col-span-1 flex items-center">
                      <input 
                        className="w-full text-center text-[10px] font-bold text-gray-400 bg-transparent"
                        value={child.label}
                        onChange={(e) => handleSubItemChange(index, sIdx, 'label', e.target.value)}
                      />
                    </div>
                    <div className="col-span-11">
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-7">
                          <input 
                            placeholder="Detail..."
                            className="w-full p-1.5 text-xs border rounded-md"
                            value={child.description}
                            onChange={(e) => handleSubItemChange(index, sIdx, 'description', e.target.value)}
                          />
                          <input 
                            placeholder="Note..."
                            className="w-full p-1 mt-0.5 text-[10px] italic border-b outline-none border-gray-50"
                            value={child.notes}
                            onChange={(e) => handleSubItemChange(index, sIdx, 'notes', e.target.value)}
                          />
                        </div>
                        <div className="col-span-1 pt-1 text-[10px]">
                           <span className="block text-gray-300 font-bold text-center">QT</span>
                           <input type="number" className="w-full text-center p-0.5 outline-none font-bold" value={child.qty} onChange={(e) => handleSubItemChange(index, sIdx, 'qty', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="col-span-1 pt-1 text-[10px]">
                            <span className="block text-gray-300 font-bold text-center">UN</span>
                            <input className="w-full text-center p-0.5 uppercase outline-none font-bold" value={child.unit} onChange={(e) => handleSubItemChange(index, sIdx, 'unit', e.target.value)} />
                        </div>
                        <div className="col-span-3 pt-1 text-[10px]">
                            <span className="block text-gray-300 font-bold text-right pr-2">RATE</span>
                            <input type="number" className="w-full text-right p-0.5 outline-none font-bold pr-2" value={child.rate} onChange={(e) => handleSubItemChange(index, sIdx, 'rate', parseFloat(e.target.value) || 0)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addSubItem(index)}
                  className="w-full py-1 border border-dashed border-blue-200 rounded-lg text-blue-500 hover:bg-blue-50 flex items-center justify-center text-[10px] font-bold uppercase transition-colors"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Service Detail
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={addItem}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center text-sm font-black uppercase tracking-widest"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Service Category
        </button>
      </div>

      {/* Vendor Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Register Vendor</h2>
            <form onSubmit={handleSaveVendor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company Name</label>
                <input required className="w-full p-2 border rounded-lg" value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                <textarea required className="w-full p-2 border rounded-lg h-20" value={newVendor.address} onChange={e => setNewVendor({...newVendor, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">GSTIN</label>
                  <input required className="w-full p-2 border rounded-lg" value={newVendor.gst} onChange={e => setNewVendor({...newVendor, gst: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code</label>
                  <input required className="w-full p-2 border rounded-lg" value={newVendor.vendorCode} onChange={e => setNewVendor({...newVendor, vendorCode: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact</label>
                <input required className="w-full p-2 border rounded-lg" value={newVendor.contact} onChange={e => setNewVendor({...newVendor, contact: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-2">
                <button type="button" onClick={() => setShowVendorModal(false)} className="px-4 py-2 text-gray-500 text-sm font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
