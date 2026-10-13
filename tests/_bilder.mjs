import { chromium } from 'playwright';
const SP = process.argv[2];
const b = await chromium.launch();
const PH = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
const trips = Array.from({ length: 9 }, (_, i) => ({ id: 't' + i, title: ['Italien 2026', 'Frankreich', 'Spanien', 'Holland', 'Kreta', 'Island', 'Malta', 'Toskana', 'Wien Kurztrip'][i], participants: 'Anna, Ben', start: `${2026 - i}-06-01`, end: `${2026 - i}-06-10`, transport: ['pkw'], days: {} }));
const open = async (w, h, dark) => {
  const phone = w < 700 || h < 500;
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: phone, colorScheme: dark ? 'dark' : 'light', userAgent: phone ? PH : undefined });
  await p.goto(new URL('../index.html', import.meta.url).href);
  await p.evaluate(t => localStorage.setItem('reiselogbuch.v1', JSON.stringify({ settings: {}, trips: t })), trips);
  await p.reload(); await p.waitForTimeout(400);
  return p;
};
const longLast = async p => {
  await p.evaluate(() => { const l = document.querySelector('#side .side-list'); l.scrollTop = l.scrollHeight; }); await p.waitForTimeout(200);
  const rb = await p.locator('#side .side-row').last().boundingBox();
  await p.mouse.move(rb.x + 40, rb.y + rb.height / 2); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(500);
};
{ const p = await open(1180, 820, false); await p.click('#sideMore'); await p.waitForTimeout(300); await p.screenshot({ path: `${SP}/V3110-1-ipad-quer-hell-version.png` }); await p.close(); }
{ const p = await open(1180, 820, true); await p.setViewportSize({ width: 820, height: 820 }); await p.waitForTimeout(60); await p.setViewportSize({ width: 820, height: 1180 }); await p.waitForTimeout(600);
  await p.screenshot({ path: `${SP}/V3110-2-ipad-gedreht-hoch-dunkel-seitenleiste.png` }); await p.close(); }
{ const p = await open(852, 393, true); await p.click('#back'); await p.waitForTimeout(300); await longLast(p); await p.screenshot({ path: `${SP}/V3110-3-iphone-quer-dunkel-kontextmenue-letzter.png` }); await p.close(); }
{ const p = await open(393, 852, false); await p.click('#back'); await p.waitForTimeout(300); await longLast(p); await p.screenshot({ path: `${SP}/V3110-4-iphone-hoch-hell-kontextmenue-letzter.png` }); await p.close(); }
await b.close();
