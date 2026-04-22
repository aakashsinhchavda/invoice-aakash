'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  UserPlus, 
  Edit2, 
  MoreVertical,
  Building2,
  Mail,
  Phone
} from 'lucide-react';

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentVendor, setCurrentVendor] = useState({ name: '', address: '', gst: '', vendorCode: '', contact: '' });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/vendors');
      const data = await res.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = currentVendor._id ? 'PUT' : 'POST';
    const url = currentVendor._id ? `/api/vendors/${currentVendor._id}` : '/api/vendors';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentVendor),
      });
      if (res.ok) {
        fetchVendors();
        setShowModal(false);
        setCurrentVendor({ name: '', address: '', gst: '', vendorCode: '', contact: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchVendors();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vendorCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto text-[17px]">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Vendor Directory</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your certified suppliers and their billing credentials.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentVendor({ name: '', address: '', gst: '', vendorCode: '', contact: '' });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all w-full md:w-auto"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Register Supplier
        </button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
              placeholder="Filter by name, code or GST..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-gray-50">
          {filteredVendors.map((vendor) => (
            <div key={vendor._id} className="p-6 hover:bg-gray-50 transition-colors group relative">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <button className="text-gray-300 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
               </div>
               <h3 className="font-black text-gray-900 uppercase tracking-tight truncate mb-1">{vendor.name}</h3>
               <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">CODE: {vendor.vendorCode}</p>
               
               <div className="space-y-2 mb-6">
                 <p className="text-xs text-gray-400 font-bold uppercase flex items-center">
                   <span className="w-16">GSTIN</span>
                   <span className="text-gray-700">{vendor.gst}</span>
                 </p>
                 <p className="text-xs text-gray-400 font-bold uppercase flex items-center">
                   <span className="w-16">Contact</span>
                   <span className="text-gray-700">{vendor.contact}</span>
                 </p>
               </div>

               <div className="flex space-x-2">
                 <button 
                  onClick={() => { setCurrentVendor(vendor); setShowModal(true); }}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg transition-colors flex items-center justify-center"
                 >
                   <Edit2 className="w-3 h-3 mr-2" /> Edit
                 </button>
                 <button 
                  onClick={() => handleDelete(vendor._id)}
                  className="w-10 h-10 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black mb-6 text-gray-900">
              {currentVendor._id ? 'Edit Supplier' : 'Register New Supplier'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest pl-1">Company Name</label>
                  <input required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-inner" value={currentVendor.name} onChange={e => setCurrentVendor({...currentVendor, name: e.target.value.toUpperCase()})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest pl-1">Vendor Code</label>
                  <input required className="w-full p-3 border border-gray-200 rounded-xl" value={currentVendor.vendorCode} onChange={e => setCurrentVendor({...currentVendor, vendorCode: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest pl-1">GST Number</label>
                  <input required className="w-full p-3 border border-gray-200 rounded-xl" value={currentVendor.gst} onChange={e => setCurrentVendor({...currentVendor, gst: e.target.value.toUpperCase()})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest pl-1">Full Address</label>
                  <textarea required className="w-full p-3 border border-gray-200 rounded-xl h-24" value={currentVendor.address} onChange={e => setCurrentVendor({...currentVendor, address: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest pl-1">Contact Phone</label>
                  <input className="w-full p-3 border border-gray-200 rounded-xl" value={currentVendor.contact} onChange={e => setCurrentVendor({...currentVendor, contact: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-400 text-sm font-bold hover:text-gray-600">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-sm shadow-xl shadow-blue-200 transition-transform active:scale-95">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
