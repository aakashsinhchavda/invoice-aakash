import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import puppeteer from 'puppeteer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import InvoiceTemplate from '@/components/InvoiceTemplate';

export async function GET(req, { params }) {
  const { id } = await params;
  await dbConnect();

  try {
    const invoice = await Invoice.findById(id).populate('vendorId');
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Prepare data for template
    const invoiceData = {
      ...invoice.toObject(),
      vendor: invoice.vendorId // The template expects 'vendor' object
    };

    // Render HTML
    const invoiceHtml = renderToString(<InvoiceTemplate data={invoiceData} />);

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4; margin: 0 !important; }
            body { margin: 0 !important; padding: 0 !important; -webkit-print-color-adjust: exact; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <div id="invoice-template">
            ${invoiceHtml}
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
    });

    const page = await browser.newPage();
    
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    });

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      displayHeaderFooter: false,
      preferCSSPageSize: true
    });

    await browser.close();

    return new Response(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice_${invoice.poNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
