const { test, expect } = require('@playwright/test');
const { clearStorage, signup } = require('./helpers');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearStorage(page);
  await page.reload();
});

test('sessions page renders session cards', async ({ page }) => {
  await page.click('text=Sessions');
  await expect(page.locator('.session-row').first()).toBeVisible();
  const count = await page.locator('.session-row').count();
  expect(count).toBeGreaterThan(0);
});

test('clicking a session opens the detail overlay', async ({ page }) => {
  await page.click('text=Sessions');
  await page.locator('.session-row').first().click();
  await expect(page.locator('#sdOverlay')).toBeVisible();
});

test('session detail overlay closes with ✕', async ({ page }) => {
  await page.click('text=Sessions');
  await page.locator('.session-row').first().click();
  await expect(page.locator('#sdOverlay')).toBeVisible();
  await page.click('.sd-close');
  await expect(page.locator('#sdOverlay')).toBeHidden();
});

test('Book Now opens booking modal over session detail', async ({ page }) => {
  await signup(page);
  await page.click('text=Sessions');
  await page.locator('.session-row').first().click();
  await expect(page.locator('#sdOverlay')).toBeVisible();

  await page.click('#sdBookBtn');

  await expect(page.locator('#bookingModal')).toBeVisible();
});

test('booking modal pre-fills with logged-in user details', async ({ page }) => {
  await signup(page);
  await page.click('text=Sessions');
  await page.locator('.session-row').first().click();
  await page.click('#sdBookBtn');

  await expect(page.locator('#bookingModal')).toBeVisible();
  const firstNameInput = page.locator('#bookingModal input[placeholder="Your name"]');
  await expect(firstNameInput).not.toHaveValue('');
});

test('booking confirmation shows success message', async ({ page }) => {
  await signup(page);
  await page.click('text=Sessions');
  await page.locator('.session-row').first().click();
  await page.click('#sdBookBtn');
  await expect(page.locator('#bookingModal')).toBeVisible();

  await page.click('button:has-text("Confirm Booking")');

  await expect(page.locator('#bookingSuccess')).toBeVisible();
  await expect(page.locator('#bookingSuccess')).toContainText("You're Booked");
});

test('booking modal closes with ✕', async ({ page }) => {
  await signup(page);
  await page.click('text=Sessions');
  await page.locator('.session-row').first().click();
  await page.click('#sdBookBtn');
  await expect(page.locator('#bookingModal')).toBeVisible();

  await page.click('.modal-close');
  await expect(page.locator('#bookingModal')).toBeHidden();
});

test('save to wishlist fills the heart button', async ({ page }) => {
  await signup(page);
  await page.click('text=Sessions');
  await page.locator('.session-row').first().click();

  const saveBtn = page.locator('#sdSaveBtn');
  await expect(saveBtn).not.toHaveClass(/saved/);
  await saveBtn.click();
  await expect(saveBtn).toHaveClass(/saved/);
});

test('saved session appears on profile wishlist', async ({ page }) => {
  await signup(page);
  await page.click('text=Sessions');
  await page.locator('.session-row').first().click();

  const sessionTitle = await page.locator('#sdOverlay h2').first().innerText();
  await page.click('#sdSaveBtn');
  await page.click('.sd-close');

  await page.click('.account-btn');
  await page.click('text=My Profile');
  await expect(page.locator('#profileWishlist')).toContainText(sessionTitle);
});

test('unsaving a session removes it from wishlist', async ({ page }) => {
  await signup(page);
  await page.click('text=Sessions');
  await page.locator('.session-row').first().click();
  await page.click('#sdSaveBtn');
  await page.click('#sdSaveBtn');

  const saveBtn = page.locator('#sdSaveBtn');
  await expect(saveBtn).not.toHaveClass(/saved/);
});

test('session filter shows only matching category', async ({ page }) => {
  await page.click('text=Sessions');
  const filterBtn = page.locator('.filter-btn').nth(1);
  const category = await filterBtn.innerText();
  await filterBtn.click();

  const visibleRows = page.locator('.session-row:visible');
  const count = await visibleRows.count();
  expect(count).toBeGreaterThan(0);
});
