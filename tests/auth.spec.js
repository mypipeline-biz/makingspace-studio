const { test, expect } = require('@playwright/test');
const { TEST_USER, clearStorage, signup, login, logout } = require('./helpers');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await clearStorage(page);
  await page.reload();
});

test('signup creates account and auto-logs in', async ({ page }) => {
  await signup(page);
  await expect(page.locator('#accountMenu')).toBeVisible();
  await expect(page.locator('#navSignIn')).toBeHidden();
});

test('signup with duplicate email shows error', async ({ page }) => {
  await signup(page);
  await logout(page);
  await page.reload();

  await page.click('#navSignIn');
  await page.click('button.auth-tab:has-text("Create Account")');
  await page.fill('#signupName', 'Another User');
  await page.fill('#signupEmail', TEST_USER.email);
  await page.fill('#signupPassword', TEST_USER.password);
  await page.click('#signupForm button[type="submit"]');

  await expect(page.locator('#signupError')).toBeVisible();
  await expect(page.locator('#signupError')).toContainText('already exists');
});

test('signup with short password shows error', async ({ page }) => {
  await page.click('#navSignIn');
  await page.click('button.auth-tab:has-text("Create Account")');
  await page.fill('#signupName', TEST_USER.name);
  await page.fill('#signupEmail', TEST_USER.email);
  await page.fill('#signupPassword', 'short');
  await page.click('#signupForm button[type="submit"]');

  await expect(page.locator('#signupError')).toBeVisible();
  await expect(page.locator('#signupError')).toContainText('8 characters');
});

test('login with valid credentials succeeds', async ({ page }) => {
  await signup(page);
  await logout(page);
  await page.reload();

  await login(page);
  await expect(page.locator('#accountMenu')).toBeVisible();
});

test('login with wrong password shows error', async ({ page }) => {
  await signup(page);
  await logout(page);
  await page.reload();

  await page.click('#navSignIn');
  await page.fill('#loginEmail', TEST_USER.email);
  await page.fill('#loginPassword', 'WrongPassword99');
  await page.click('#loginForm button[type="submit"]');

  await expect(page.locator('#loginError')).toBeVisible();
  await expect(page.locator('#loginError')).toContainText('incorrect');
});

test('logout hides account menu and shows sign in link', async ({ page }) => {
  await signup(page);
  await logout(page);

  await expect(page.locator('#navSignIn')).toBeVisible();
  await expect(page.locator('#accountMenu')).toBeHidden();
});

test('Google OAuth shows name modal, not browser prompt', async ({ page }) => {
  let promptFired = false;
  page.on('dialog', () => { promptFired = true; });

  await page.click('#navSignIn');
  await page.click('button.auth-tab:has-text("Create Account")');
  await page.click('button:has-text("Google")');

  await expect(page.locator('#oauthNameModal')).toBeVisible();
  expect(promptFired).toBe(false);
});

test('Apple OAuth shows name modal, not browser prompt', async ({ page }) => {
  let promptFired = false;
  page.on('dialog', () => { promptFired = true; });

  await page.click('#navSignIn');
  await page.click('button.auth-tab:has-text("Create Account")');
  await page.click('button:has-text("Apple")');

  await expect(page.locator('#oauthNameModal')).toBeVisible();
  expect(promptFired).toBe(false);
});

test('OAuth signup completes with name entry', async ({ page }) => {
  await page.click('#navSignIn');
  await page.click('button.auth-tab:has-text("Create Account")');
  await page.click('button:has-text("Google")');

  await page.fill('#oauthNameInput', 'Google User');
  await page.click('#oauthNameModal button:has-text("Create Account")');

  await expect(page.locator('#accountMenu')).toBeVisible();
});

test('OAuth signup with empty name shows error', async ({ page }) => {
  await page.click('#navSignIn');
  await page.click('button.auth-tab:has-text("Create Account")');
  await page.click('button:has-text("Google")');

  await page.click('#oauthNameModal button:has-text("Create Account")');

  await expect(page.locator('#oauthNameError')).toBeVisible();
  await expect(page.locator('#oauthNameError')).toContainText('name');
});
