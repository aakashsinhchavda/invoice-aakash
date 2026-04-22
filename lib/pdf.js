import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function getBrowser() {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  } else {
    // For local development, try to find local chrome
    const localPuppeteer = await import('puppeteer');
    return await localPuppeteer.default.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
    });
  }
}
