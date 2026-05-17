const { test, expect } = require('@playwright/test');
const { clearStorage, signup } = require('./helpers');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearStorage(page);
  await page.reload();
});

test('home page loads with hero content', async ({ page }) => {
  await expect(page.locator('#home')).toBeVisible();
});

test('Sessions nav link shows sessions page', async ({ page }) => {
  await page.click('text=Sessions');
  await expect(page.locator('#sessions')).toBeVisible();
  await expect(page.locator('#home')).toBeHidden();
});

test('Instructors nav link shows instructors page', async ({ page }) => {
  await page.click('text=Instructors');
  await expect(page.locator('#instructors')).toBeVisible();
  await expect(page.locator('#home')).toBeHidden();
});

test('Gallery nav link shows gallery page', async ({ page }) => {
  await page.click('text=Gallery');
  await expect(page.locator('#gallery')).toBeVisible();
  await expect(page.locator('#home')).toBeHidden();
});

test('logo click returns to home page', async ({ page }) => {
  await page.click('text=Sessions');
  await expect(page.locator('#sessions')).toBeVisible();
  await page.click('.nav-logo');
  await expect(page.locator('#home')).toBeVisible();
});

test('profile page accessible after login', async ({ page }) => {
  await signup(page);
  await page.click('.account-btn');
  await page.click('text=My Profile');
  await expect(page.locator('#profile')).toBeVisible();
});

test('profile page shows user name', async ({ page }) => {
  await signup(page);
  await page.click('.account-btn');
  await page.click('text=My Profile');
  await expect(page.locator('#profileName')).toContainText('Test User');
});

test('instructors page renders instructor cards', async ({ page }) => {
  await page.click('text=Instructors');
  const cards = page.locator('.instructor-card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
});

test('gallery page renders gallery items', async ({ page }) => {
  await page.click('text=Gallery');
  const items = page.locator('.gallery-item');
  const count = await items.count();
  expect(count).toBeGreaterThan(0);
});
