// Full click-through of the Appointments template against its in-memory demo data (AUDIENCE = 'both').
// SPA navigation only after the first load, because demo changes live in memory.
const puppeteer = require('puppeteer-core');
const [base, out] = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', defaultViewport: { width: 1400, height: 1000 } });
  const page = await browser.newPage();
  page.on('pageerror', (e) => { failures++; console.log('[pageerror]', e.message); });
  page.on('dialog', (d) => d.accept());
  const visible = async (xp) => {
    for (const e of await page.$$(`xpath/${xp}`)) { const b = await e.boundingBox(); if (b && b.width > 0) return e; }
    return null;
  };
  const el = async (text, tag = '*') => {
    const e = await visible(`.//${tag}[normalize-space(.)='${text}']`);
    if (!e) throw new Error(`"${text}" not found`);
    return e;
  };
  const click = async (text, tag) => { await (await el(text, tag)).click(); await sleep(500); };
  const body = async () => (await page.evaluate(() => document.body.innerText)).toLowerCase();
  const has = async (t) => (await body()).includes(t.toLowerCase());
  const path = () => new URL(page.url()).pathname;
  const count = async () => Number(((await body()).match(/(\d+) appointments?/) || [])[1]);
  const check = (name, ok) => { if (!ok) failures++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}`); };
  const step = async (name, fn) => { try { await fn(); } catch (e) { failures++; console.log(`FAIL ${name}: ${e.message.slice(0, 160)}`); await page.screenshot({ path: `${out}-fail-${name.replace(/\W+/g, '_')}.png` }); } };
  const dialog = () => page.$('[role="dialog"]');
  const typeTime = async (fieldIndex, hour, minute, period) => {
    const groups = await page.$$('[role="dialog"] [role="group"]');
    const segs = await groups[fieldIndex].$$('[role="spinbutton"]');
    await segs[0].click(); await page.keyboard.type(hour); await page.keyboard.type(minute); await page.keyboard.type(period); await sleep(200);
  };
  const pickDay = async (buttonIndex, dayText) => {
    const pickers = await page.$$('[role="dialog"] button[id="startDate"], [role="dialog"] button[id="endDate"]');
    await pickers[buttonIndex].click(); await sleep(400);
    const day = await visible(`//div[@data-radix-popper-content-wrapper]//button[normalize-space(.)='${dayText}' and not(@disabled)]`);
    await day.click(); await sleep(300);
  };

  await page.goto(`${base}/month-view`, { waitUntil: 'networkidle2' }); await sleep(1500);

  await step('calendar and header', async () => {
    check('month view shows the appointment count', (await count()) > 0);
    check('no "Calendar settings" panel', !(await has('Calendar settings')));
    check('no year view button', !(await page.$('[aria-label="View by year"]')));
    check('header shows "Booking page" (both)', await has('Booking page'));
    const before = await page.evaluate(() => document.documentElement.className);
    await (await page.$$('header button'))[0].click(); await sleep(300);
    const after = await page.evaluate(() => document.documentElement.className);
    check(`light / dark switch changes the theme (${before} → ${after})`, before !== after && /light|dark/.test(after));
    await (await page.$$('header button'))[0].click(); await sleep(300);
  });

  await step('views and navigation', async () => {
    for (const [label, p] of [['View by day', '/day-view'], ['View by week', '/week-view'], ['View by agenda', '/agenda-view'], ['View by month', '/month-view']]) {
      await (await page.$(`[aria-label="${label}"]`)).click(); await sleep(600);
      check(`${label} → ${p}`, path() === p);
    }
    const month = async () => (await page.$eval('span.text-lg.font-heading', (e) => e.textContent.trim()));
    const m0 = await month();
    const navButtons = await page.$$('button:has(svg.lucide-chevron-right), button:has(svg.lucide-chevron-left)');
    await navButtons[navButtons.length - 1].click(); await sleep(400);
    const m1 = await month();
    check(`next goes to the next month (${m0} → ${m1})`, m0 !== m1);
    await navButtons[0].click(); await sleep(400);
    check('previous comes back', (await month()) === m0);
    await navButtons[navButtons.length - 1].click(); await navButtons[navButtons.length - 1].click(); await sleep(400);
    await (await page.$('button[aria-label="Today"]')).click(); await sleep(400);
    check(`today button returns to this month (${m0})`, (await month()) === m0);
    const dayNumber = await visible(`//button[contains(@class,'rounded-full') and normalize-space(.)='${new Date().getDate()}']`);
    await dayNumber.click(); await sleep(600);
    check('clicking a day number opens the day view', path() === '/day-view');
    await (await page.$('[aria-label="View by month"]')).click(); await sleep(600);
  });

  await step('staff filter', async () => {
    const all = await count();
    const combos = await page.$$('button[role="combobox"]');
    await combos[0].click(); await sleep(400);
    const opts = await page.$$('[role="option"]');
    await opts[1].click(); await sleep(500);
    const one = await count();
    check(`filtering by one staff member shows fewer (${all} → ${one})`, one < all);
    await (await page.$$('button[role="combobox"]'))[0].click(); await sleep(300);
    await (await page.$$('[role="option"]'))[0].click(); await sleep(400);
    check('"All" shows everyone again', (await count()) === all);
  });

  let created = 'Consultation - Test Client';
  await step('add appointment', async () => {
    const before = await count();
    await click('Add Appointment', 'button');
    check('add dialog opens', !!(await dialog()));
    await click('Create Appointment', 'button');
    check('empty form is refused (title + staff)', (await has('Title is required')) && (await has('Pick a staff member')));
    await (await page.$('[role="dialog"] button[role="combobox"]')).click(); await sleep(300);
    await (await page.$$('[role="option"]'))[0].click(); await sleep(300);
    await page.type('#title', created);
    await page.type('#clientName', 'Test Client');
    await page.type('#clientEmail', 'not-an-email');
    await page.type('#clientPhone', '555-0199');
    const d = String(new Date().getDate());
    await pickDay(0, d);
    await typeTime(0, '10', '00', 'A');
    await pickDay(1, d);
    await typeTime(1, '09', '00', 'A');
    const colorCombo = (await page.$$('[role="dialog"] button[role="combobox"]'))[1];
    await colorCombo.click(); await sleep(300);
    await click('Purple', '*[@role="option"]');
    await click('Create Appointment', 'button');
    check('invalid email is refused', await has('Enter a valid email address'));
    await page.click('#clientEmail', { clickCount: 3 }); await page.keyboard.type('test@example.com');
    await click('Create Appointment', 'button');
    check('end before start is refused', await has('The end must be after the start'));
    await typeTime(1, '11', '00', 'A');
    await click('Create Appointment', 'button'); await sleep(500);
    check('dialog closes after create', !(await dialog()));
    check(`count goes up (${before} → ${await count()})`, (await count()) === before + 1);
  });

  await step('details, edit, delete', async () => {
    await (await page.$('[aria-label="View by agenda"]')).click(); await sleep(600);
    await click(created); await sleep(400);
    check('details show the client', (await has('Test Client')) && (await has('test@example.com')) && (await has('555-0199')));
    await click('Edit', 'button');
    await page.click('#title', { clickCount: 3 }); created = 'Follow-up - Test Client'; await page.keyboard.type(created);
    await click('Save Changes', 'button'); await sleep(500);
    check('edit saves the new title', await has(created));
    await page.keyboard.press('Escape'); await sleep(300);
    await click(created); await sleep(300);
    await click('Delete', 'button'); await sleep(600);
    check('details dialog closes after delete', !(await dialog()));
    check('deleted appointment is gone', !(await has(created)));
  });

  await step('booking page', async () => {
    await click('Booking page'); await sleep(800);
    check('booking page at /book', path() === '/book');
    await page.click('button[role="combobox"]'); await sleep(300);
    const opts = await page.$$('[role="option"]');
    const staffName = await opts[1].evaluate((e) => e.textContent.trim());
    await opts[1].click(); await sleep(300);
    const days = await page.$$('[role="grid"] button:not([disabled])');
    await days[days.length > 1 ? 1 : 0].click(); await sleep(500);
    const times = async () => Promise.all((await page.$$('xpath/.//button[string-length(normalize-space(.))=5 and contains(., ":")]')).map((t) => t.evaluate((e) => e.textContent.trim())));
    const before = await times();
    check(`free times shown (${before.length})`, before.length > 0);
    await (await page.$$('xpath/.//button[string-length(normalize-space(.))=5 and contains(., ":")]'))[0].click(); await sleep(300);
    await page.type('#book-name', 'Web Client'); await page.type('#book-email', 'web@example.com'); await page.type('#book-phone', '555-0123');
    await click('Confirm booking', 'button'); await sleep(600);
    check(`confirmation for ${before[0]} with ${staffName}`, (await has("You're booked")) && (await has(before[0])) && (await has(staffName)));
    await click('Book another', 'button'); await sleep(400);
    check('booked time no longer offered', !(await times()).includes(before[0]));
    check('contact line shown', await has('Questions? Email us at'));
  });

  await page.screenshot({ path: `${out}-end.png` });
  console.log(failures === 0 ? '\nALL PASSED' : `\n${failures} FAILED`);
  await browser.close();
})().catch((e) => { console.log('FAIL', e.message); process.exit(1); });
