'use client';

import React, { useState } from 'react';
import { Menu, FileText } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Navigation({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-900 text-white p-4 flex justify-between items-center z-40 border-b border-gray-800 w-full fixed top-0">
        <h1 className="text-lg font-black italic tracking-tighter flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-500" />
          INVOICE <span className="text-blue-500 ml-1">PRO</span>
        </h1>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto relative bg-gray-50 h-screen mt-[60px] lg:mt-0">
        {children}
      </main>
    </>
  );
}
