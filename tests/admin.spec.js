const { test, expect } = require('@playwright/test');

const NEW_SESSION = {
  title: 'Playwright Test Session',
  instructor: 'Rosa Chen',
  day: '15',
  month: 'August',
  time: '10:00 AM',
  price: '£45',
  spots: '8',
  maxSpots: '10',
};

test.beforeEach(async ({ page }) => {
  await page.goto('/admin.html');
  await page.evaluate(() => {
    Object.keys(localStorage)
      .filter(k => k.startsWith('mks_'))
      .forEach(k => localStorage.removeItem(k));
  });
  await page.reload();
});

test('admin dashboard loads with stats', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
  const statCards = page.locator('.stat-card, .stats-card, [class*="stat"]');
  await expect(statCards.first()).toBeVisible();
});

test('sessions panel shows existing sessions', async ({ page }) => {
  await page.click('text=Sessions');
  const rows = page.locator('.session-item, .admin-row, tr').filter({ hasText: /pottery|painting|drawing/i });
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
});

test('can add a new session', async ({ page }) => {
  await page.click('text=Sessions');
  await page.click('button:has-text("Add Session")');

  await page.fill('#sf-title', NEW_SESSION.title);
  await page.fill('#sf-instructor', NEW_SESSION.instructor);
  await page.fill('#sf-day', NEW_SESSION.day);
  await page.fill('#sf-time', NEW_SESSION.time);
  await page.fill('#sf-price', NEW_SESSION.price);
  await page.fill('#sf-spots', NEW_SESSION.spots);
  await page.fill('#sf-maxspots', NEW_SESSION.maxSpots);

  await page.click('button:has-text("Add Session")');

  await expect(page.locator('body')).toContainText(NEW_SESSION.title);
});

test('new session appears on public site', async ({ page }) => {
  await page.click('text=Sessions');
  await page.click('button:has-text("Add Session")');
  await page.fill('#sf-title', NEW_SESSION.title);
  await page.fill('#sf-instructor', NEW_SESSION.instructor);
  await page.fill('#sf-day', NEW_SESSION.day);
  await page.fill('#sf-time', NEW_SESSION.time);
  await page.fill('#sf-price', NEW_SESSION.price);
  await page.fill('#sf-spots', NEW_SESSION.spots);
  await page.fill('#sf-maxspots', NEW_SESSION.maxSpots);
  await page.click('button:has-text("Add Session")');

  await page.goto('/index.html');
  await page.click('text=Sessions');
  await expect(page.locator('#sessions')).toContainText(NEW_SESSION.title);
});

test('can edit an existing session', async ({ page }) => {
  await page.click('text=Sessions');
  await page.locator('button:has-text("Edit")').first().click();

  await page.fill('#sf-title', 'Updated Session Title');
  await page.click('button:has-text("Update Session")');

  await expect(page.locator('body')).toContainText('Updated Session Title');
});

test('can delete a session', async ({ page }) => {
  await page.click('text=Sessions');

  const rows = page.locator('.session-item, [data-id], tr').filter({ hasText: /pottery|painting|drawing/i });
  const initialCount = await rows.count();

  page.on('dialog', dialog => dialog.accept());
  await page.locator('button:has-text("Delete")').first().click();

  await page.waitForTimeout(500);
  const newCount = await rows.count();
  expect(newCount).toBe(initialCount - 1);
});

test('can add a new instructor', async ({ page }) => {
  await page.click('text=Instructors');
  await page.click('button:has-text("Add Instructor")');

  await page.fill('#if-name', 'Test Instructor');
  await page.fill('#if-role', 'Ceramics Teacher');
  await page.fill('#if-specialty', 'Wheel throwing');
  await page.fill('#if-bio', 'A short bio for testing.');

  await page.click('button:has-text("Add Instructor")');
  await expect(page.locator('body')).toContainText('Test Instructor');
});

test('site info can be updated', async ({ page }) => {
  await page.click('text=Site Info');

  const taglineField = page.locator('input[id*="tagline"], textarea[id*="tagline"]').first();
  await taglineField.fill('Updated Tagline for Tests');
  await page.click('button:has-text("Save")');

  await page.reload();
  await page.click('text=Site Info');
  await expect(taglineField).toHaveValue('Updated Tagline for Tests');
});
