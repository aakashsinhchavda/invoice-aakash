import { NextResponse } from 'next/server';
import { getBrowser } from '@/lib/pdf';

export async function POST(req) {
  try {
    const { html } = await req.json();
    const browser = await getBrowser();

    const page = await browser.newPage();
    
    // Set viewport to A4 standard
    await page.setViewport({
      width: 794, // 210mm at 96dpi
      height: 1123, // 297mm at 96dpi
      deviceScaleFactor: 2, // High quality
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      displayHeaderFooter: false,
      preferCSSPageSize: true
    });

    await browser.close();

    return new Response(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="invoice.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
