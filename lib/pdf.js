import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function getBrowser() {
  if (process.env.VERCEL && process.platform !== 'win32') {
    // Vercel specific configuration
    chromium.setHeadlessMode = true;
    chromium.setGraphicsMode = false;
    
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  } else {
    // Local development
    try {
      const localPuppeteer = await import('puppeteer');
      return await localPuppeteer.default.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
      });
    } catch (e) {
      console.warn("Local puppeteer import failed, trying puppeteer-core with local chrome path");
      // Fallback for some local environments
      return await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Common Windows path
      });
    }
  }
}
