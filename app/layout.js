import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'Invoice Pro | Managed Generator',
  description: 'Professional purchase order management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex h-screen overflow-hidden flex-col lg:flex-row font-sans text-[17px]">
        <Navigation>
          {children}
        </Navigation>
      </body>
    </html>
  );
}
