/**
 * TC-AUTH-01 to TC-AUTH-07
 * Feature: Authentication (login / logout)
 * Page: https://www.saucedemo.com/
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import {
  USERS,
  ERROR_MESSAGES,
  PERF_GLITCH_LOGIN_TIMEOUT_MS,
} from '../utils/test-data';

test.describe('Authentication', () => {

  // Navigate to login page before every test in this suite
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ── TC-AUTH-01 ─────────────────────────────────────────────────────────────
  test('TC-AUTH-01: Successful login with standard user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(USERS.standard.username, USERS.standard.password);

    // Should land on the inventory page
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  // ── TC-AUTH-02 ─────────────────────────────────────────────────────────────
  test('TC-AUTH-02: Login blocked for locked-out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);

    // Error banner must appear; URL must stay on login page
    await expect(page).toHaveURL('/');
    const error = await loginPage.getErrorText();
    expect(error).toContain(ERROR_MESSAGES.lockedOut);
  });

  // ── TC-AUTH-03 ─────────────────────────────────────────────────────────────
  test('TC-AUTH-03: Login fails with wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(USERS.standard.username, 'wrong_password');

    const error = await loginPage.getErrorText();
    expect(error).toContain(ERROR_MESSAGES.wrongCredentials);
  });

  // ── TC-AUTH-04 ─────────────────────────────────────────────────────────────
  test('TC-AUTH-04: Login fails with empty username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login('', USERS.standard.password);

    const error = await loginPage.getErrorText();
    expect(error).toContain(ERROR_MESSAGES.usernameRequired);
  });

  // ── TC-AUTH-05 ─────────────────────────────────────────────────────────────
  test('TC-AUTH-05: Login fails with empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(USERS.standard.username, '');

    const error = await loginPage.getErrorText();
    expect(error).toContain(ERROR_MESSAGES.passwordRequired);
  });

  // ── TC-AUTH-06 ─────────────────────────────────────────────────────────────
  test('TC-AUTH-06: Successful logout via burger menu', async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Log in first
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // Then log out via the side nav
    await inventoryPage.logout();

    // Should be back on the login page
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  // ── TC-AUTH-07 ─────────────────────────────────────────────────────────────
  test('TC-AUTH-07: Performance glitch user logs in within acceptable time', async ({ page }) => {
    const loginPage = new LoginPage(page);

    const start = Date.now();

    await loginPage.login(
      USERS.performanceGlitch.username,
      USERS.performanceGlitch.password,
    );

    // Wait for inventory page to fully appear
    await expect(page).toHaveURL(/inventory\.html/, {
      timeout: PERF_GLITCH_LOGIN_TIMEOUT_MS,
    });

    const elapsed = Date.now() - start;
    console.log(`TC-AUTH-07: performance_glitch_user login took ${elapsed} ms`);

    // Assert the login completed within our threshold
    expect(elapsed).toBeLessThan(PERF_GLITCH_LOGIN_TIMEOUT_MS);
  });

});
