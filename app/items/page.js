'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Library, 
  Edit2, 
  ChevronDown,
  Layers,
  Save,
  Trash
} from 'lucide-react';

const ItemsLibraryPage = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({ 
    title: '', 
    sac: '', 
    unit: 'AU', 
    defaultChildren: [] 
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = currentItem._id ? 'PUT' : 'POST';
    const url = currentItem._id ? `/api/items/${currentItem._id}` : '/api/items';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem),
      });
      if (res.ok) {
        fetchItems();
        setShowModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addChildTemplate = () => {
    const nextLabel = (currentItem.defaultChildren.length + 1) * 10;
    setCurrentItem({
      ...currentItem,
      defaultChildren: [...currentItem.defaultChildren, { label: nextLabel.toString(), description: '', qty: 1, unit: 'Nos', rate: 0 }]
    });
  };

  const removeChildTemplate = (idx) => {
    const newChildren = currentItem.defaultChildren.filter((_, i) => i !== idx);
    setCurrentItem({ ...currentItem, defaultChildren: newChildren });
  };

  const updateChildTemplate = (idx, field, value) => {
    const newChildren = [...currentItem.defaultChildren];
    newChildren[idx][field] = value;
    setCurrentItem({ ...currentItem, defaultChildren: newChildren });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service group? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sac?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Service Library</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Pre-define complex service categories and hierarchical details.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentItem({ title: '', sac: '', unit: 'AU', defaultChildren: [] });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-green-200 hover:bg-green-700 transition-all w-full md:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Service Group
        </button>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex items-center">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              className="bg-transparent border-none outline-none text-sm w-full"
              placeholder="Search library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="divide-y divide-gray-100">
          {filteredItems.map((group) => (
            <div key={group._id} className="p-6 hover:bg-gray-50 transition-colors group">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                   <div className="p-3 bg-green-50 text-green-600 rounded-xl mr-4 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
                      <Layers className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{group.title}</h3>
                      <div className="flex space-x-4 mt-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <span>SAC: {group.sac}</span>
                         <span>UNIT: {group.unit}</span>
                         <span className="text-green-500">{group.defaultChildren?.length} SUB-DETAILS</span>
                      </div>
                   </div>
                </div>
                <div className="flex space-x-2">
                   <button 
                    onClick={() => { setCurrentItem(group); setShowModal(true); }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white border border-gray-100 rounded-lg shadow-sm"
                   >
                     <Edit2 className="w-4 h-4" />
                   </button>
                   <button 
                    onClick={() => handleDelete(group._id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-white border border-gray-100 rounded-lg shadow-sm"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Collapsible Children Preview */}
              <div className="mt-4 ml-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                 {group.defaultChildren?.map((child, i) => (
                   <div key={i} className="px-3 py-2 bg-white border border-gray-100 rounded-lg text-[10px] shadow-sm">
                      <p className="font-black text-gray-800 truncate uppercase">{child.description}</p>
                      <p className="text-gray-400">₹{child.rate?.toLocaleString()}</p>
                   </div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl h-[90vh] flex flex-col">
            <h2 className="text-2xl font-black mb-6 text-gray-900">Configure Service Group</h2>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                 <div className="col-span-3">
                   <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Group Title</label>
                   <input className="w-full p-3 border border-gray-200 rounded-xl" value={currentItem.title} onChange={e => setCurrentItem({...currentItem, title: e.target.value.toUpperCase()})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">SAC Code</label>
                   <input className="w-full p-3 border border-gray-200 rounded-xl" value={currentItem.sac} onChange={e => setCurrentItem({...currentItem, sac: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Default Unit</label>
                   <input className="w-full p-3 border border-gray-200 rounded-xl uppercase" value={currentItem.unit} onChange={e => setCurrentItem({...currentItem, unit: e.target.value})} />
                 </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-gray-800 uppercase text-sm italic underline">Default Sub-Items</h3>
                  <button 
                    type="button" 
                    onClick={addChildTemplate}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black hover:bg-blue-100"
                  >
                    + ADD SUB-DETAIL
                  </button>
                </div>
                <div className="space-y-3">
                  {currentItem.defaultChildren.map((child, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3 relative group">
                       <button onClick={() => removeChildTemplate(idx)} className="absolute -top-1 -right-1 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                         <Trash className="w-3 h-3" />
                       </button>
                       <div className="w-12">
                          <input className="w-full p-2 text-center text-xs border rounded-lg bg-white" value={child.label} onChange={e => updateChildTemplate(idx, 'label', e.target.value)} />
                       </div>
                       <div className="flex-1">
                          <input className="w-full p-2 text-xs border rounded-lg bg-white" placeholder="Description" value={child.description} onChange={e => updateChildTemplate(idx, 'description', e.target.value.toUpperCase())} />
                       </div>
                       <div className="w-24">
                          <input type="number" className="w-full p-2 text-xs border rounded-lg bg-white text-right" placeholder="Rate" value={child.rate} onChange={e => updateChildTemplate(idx, 'rate', parseFloat(e.target.value) || 0)} />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-400 text-sm font-bold hover:text-gray-600">Cancel</button>
              <button onClick={handleSave} className="px-8 py-3 bg-green-600 text-white rounded-xl font-black text-sm shadow-xl shadow-green-200">
                Save to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsLibraryPage;
