# Invoice / Purchase Order Generator

A professional web application to generate, manage, and download PDF invoices/purchase orders.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** MongoDB (Mongoose)
- **Styling:** Tailwind CSS
- **PDF Generation:** Puppeteer
- **Icons:** Lucide React

## Features
- **Vendor Management:** Create and store vendors. Auto-fill details on selection.
- **Dynamic Items:** Add/remove items with auto-calculations.
- **Tax Calculation:** Automatically calculates CGST (9%) and SGST (9%).
- **PDF Generation:** Pixel-perfect A4 PDF generation using Puppeteer.
- **Watermark:** Centered "AA" watermark on all invoices.
- **Modern UI:** Responsive sidebar form with real-time preview.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file and add your MongoDB URI:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the App:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components (Form, Template).
- `/lib`: MongoDB connection utility.
- `/models`: Mongoose schemas for Vendor and Invoice.
- `/api/generate-pdf`: Backend route for PDF conversion.
