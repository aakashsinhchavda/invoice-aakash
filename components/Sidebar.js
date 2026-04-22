'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Library, 
  PlusCircle, 
  History,
  FilePlus2
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Generated Invoices', icon: History, path: '/invoices' },
    { name: 'Vendor Manager', icon: Users, path: '/vendors' },
    { name: 'Item Library', icon: Library, path: '/items' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col text-white shadow-2xl relative z-30">
      <div className="p-6 border-b border-gray-800 bg-gray-900">
        <h1 className="text-xl font-black italic tracking-tighter flex items-center">
          <FileText className="w-6 h-6 mr-2 text-blue-500" />
          INVOICE <span className="text-blue-500 ml-1">PRO</span>
        </h1>
        <p className="text-[10px] text-gray-500 uppercase font-bold mt-1 tracking-widest">v2.1 Managed</p>
      </div>

      <div className="flex-1 py-6 space-y-1">
        <div className="px-4 mb-4">
          <Link 
            href="/invoices/new"
            className="flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20 group"
          >
            <FilePlus2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Create Invoice
          </Link>
        </div>

        <p className="px-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Main Menu</p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-all border-l-4 ${
                active 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500' 
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-400' : 'text-gray-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-6 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold">Admin Panel</span>
            <span className="text-[10px] text-gray-500">v2.1.0-stable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
