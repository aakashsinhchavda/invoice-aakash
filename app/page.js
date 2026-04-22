'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Users, 
  Library, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalVendors: 0,
    totalItems: 0,
    recentInvoices: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [invRes, venRes, itemRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/vendors'),
        fetch('/api/items')
      ]);

      const invoices = await invRes.json();
      const vendors = await venRes.json();
      const items = await itemRes.json();

      setStats({
        totalInvoices: Array.isArray(invoices) ? invoices.length : 0,
        totalVendors: Array.isArray(vendors) ? vendors.length : 0,
        totalItems: Array.isArray(items) ? items.length : 0,
        recentInvoices: Array.isArray(invoices) ? invoices.slice(0, 5) : []
      });
    } catch (e) {
      console.warn("Error fetching dashboard data", e);
    }
  };

  const statCards = [
    { name: 'Total Invoices', value: stats.totalInvoices, icon: FileText, color: 'bg-blue-500' },
    { name: 'Active Vendors', value: stats.totalVendors, icon: Users, color: 'bg-purple-500' },
    { name: 'Library Groups', value: stats.totalItems, icon: Library, color: 'bg-green-500' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here is what is happening with your invoices.</p>
        </div>
        <Link 
          href="/invoices/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Invoice
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
            <div className={`${card.color} p-4 rounded-xl mr-4 text-white shadow-lg`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.name}</p>
              <p className="text-2xl font-black text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-[17px]">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Recent Generation History
            </h3>
            <Link href="/invoices" className="text-xs font-bold text-blue-600 hover:underline flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentInvoices.length > 0 ? (
              stats.recentInvoices.map((inv, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 uppercase text-sm">#{inv.poNumber}</p>
                      <p className="text-xs text-gray-400">{new Date(inv.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">₹{inv.finalTotal?.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{inv.vendor?.name || 'Unknown Vendor'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400 italic text-sm">
                No invoices generated yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Links / Tips */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
            <TrendingUp className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black mb-2">Service Library Tool</h3>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Don't repeat yourself. Save your common Service Groups to the library and load them in 1-click.
            </p>
            <Link 
              href="/items" 
              className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-xs uppercase"
            >
              Manage Library
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
               <Users className="w-5 h-5 mr-2 text-purple-500" />
               Vendor Shortcut
            </h3>
            <div className="space-y-3">
              <Link 
                href="/vendors"
                className="block p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <p className="text-xs font-black text-gray-700 uppercase">Manage Suppliers</p>
                <p className="text-[10px] text-gray-400">View and edit your registered vendors.</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
