const TEST_USER = {
  name: 'Test User',
  email: 'test@makingspace.local',
  password: 'TestPassword123',
  phone: '07700900000',
  experience: 'Complete beginner',
};

async function clearStorage(page) {
  await page.evaluate(() => {
    Object.keys(localStorage)
      .filter(k => k.startsWith('mks_'))
      .forEach(k => localStorage.removeItem(k));
  });
}

async function signup(page, user = TEST_USER) {
  await page.click('#navSignIn');
  await page.click('button.auth-tab:has-text("Create Account")');
  await page.fill('#signupName', user.name);
  await page.fill('#signupEmail', user.email);
  await page.fill('#signupPassword', user.password);
  await page.fill('#signupPhone', user.phone);
  await page.selectOption('#signupExperience', user.experience);
  await page.click('#signupForm button[type="submit"]');
  await page.waitForSelector('#accountMenu', { state: 'visible' });
}

async function login(page, user = TEST_USER) {
  await page.click('#navSignIn');
  await page.fill('#loginEmail', user.email);
  await page.fill('#loginPassword', user.password);
  await page.click('#loginForm button[type="submit"]');
  await page.waitForSelector('#accountMenu', { state: 'visible' });
}

async function logout(page) {
  await page.click('.account-btn');
  await page.click('#accountDropdown button:has-text("Logout")');
}

module.exports = { TEST_USER, clearStorage, signup, login, logout };
