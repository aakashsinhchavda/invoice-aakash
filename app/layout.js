import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Invoice Pro | Managed Generator',
  description: 'Professional purchase order management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
