/**
 * TC-CHK-01 to TC-CHK-06
 * Feature: Checkout flow (Step 1 info → Step 2 overview → Order complete)
 * Pages: /checkout-step-one.html, /checkout-step-two.html, /checkout-complete.html
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import {
  USERS,
  PRODUCTS,
  CHECKOUT_INFO,
  ERROR_MESSAGES,
} from '../utils/test-data';

test.describe('Checkout Flow', () => {

  // Log in and add one item before every test so we always reach checkout
  test.beforeEach(async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // Add Sauce Labs Backpack as the default item for most tests
    await inventoryPage.addToCartByName(PRODUCTS.backpack.name);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
  });

  // ── TC-CHK-01 ──────────────────────────────────────────────────────────────
  test('TC-CHK-01: Full happy-path checkout end-to-end', async ({ page }) => {
    const cartPage             = new CartPage(page);
    const checkoutPage         = new CheckoutPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    // Proceed from cart → Step 1
    await cartPage.checkout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Fill valid info and continue
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode,
    );
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Finish the order
    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Confirm the success message
    const header = await checkoutCompletePage.getHeaderText();
    expect(header).toBe('Thank you for your order!');
  });

  // ── TC-CHK-02 ──────────────────────────────────────────────────────────────
  test('TC-CHK-02: Checkout Step 1 fails without first name', async ({ page }) => {
    const cartPage     = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await cartPage.checkout();
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.missingFirstName.firstName,
      CHECKOUT_INFO.missingFirstName.lastName,
      CHECKOUT_INFO.missingFirstName.postalCode,
    );

    // Should stay on Step 1 with an error
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    const error = await checkoutPage.getErrorText();
    expect(error).toContain(ERROR_MESSAGES.firstNameRequired);
  });

  // ── TC-CHK-03 ──────────────────────────────────────────────────────────────
  test('TC-CHK-03: Checkout Step 1 fails without last name', async ({ page }) => {
    const cartPage     = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await cartPage.checkout();
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.missingLastName.firstName,
      CHECKOUT_INFO.missingLastName.lastName,
      CHECKOUT_INFO.missingLastName.postalCode,
    );

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    const error = await checkoutPage.getErrorText();
    expect(error).toContain(ERROR_MESSAGES.lastNameRequired);
  });

  // ── TC-CHK-04 ──────────────────────────────────────────────────────────────
  test('TC-CHK-04: Checkout Step 1 fails without postal code', async ({ page }) => {
    const cartPage     = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await cartPage.checkout();
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.missingPostalCode.firstName,
      CHECKOUT_INFO.missingPostalCode.lastName,
      CHECKOUT_INFO.missingPostalCode.postalCode,
    );

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    const error = await checkoutPage.getErrorText();
    expect(error).toContain(ERROR_MESSAGES.postalCodeRequired);
  });

  // ── TC-CHK-05 ──────────────────────────────────────────────────────────────
  test('TC-CHK-05: Order summary shows correct item total and tax', async ({ page }) => {
    // This test uses Fleece Jacket to get a distinct price to verify
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);
    const checkoutPage  = new CheckoutPage(page);

    // Override: start fresh with Fleece Jacket instead of Backpack
    await page.goto('/inventory.html');
    // Remove backpack added in beforeEach (if still showing as Remove)
    const backpackBtn = await inventoryPage.getButtonTextByName(PRODUCTS.backpack.name);
    if (backpackBtn === 'Remove') {
      await inventoryPage.removeFromCartByName(PRODUCTS.backpack.name);
    }
    await inventoryPage.addToCartByName(PRODUCTS.fleeceJacket.name);
    await inventoryPage.goToCart();

    await cartPage.checkout();
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode,
    );

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    const itemTotal = await checkoutPage.getItemTotal();
    const tax       = await checkoutPage.getTax();
    const total     = await checkoutPage.getTotal();

    // Item total must match the product's known price
    expect(itemTotal).toBe(PRODUCTS.fleeceJacket.price);

    // Tax must be a positive number
    expect(tax).toBeGreaterThan(0);

    // Final total must equal itemTotal + tax (floating-point safe rounding)
    expect(parseFloat((itemTotal + tax).toFixed(2))).toBe(total);
  });

  // ── TC-CHK-06 ──────────────────────────────────────────────────────────────
  test('TC-CHK-06: "Back Home" after order resets cart and returns to inventory', async ({ page }) => {
    const cartPage             = new CartPage(page);
    const checkoutPage         = new CheckoutPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);
    const inventoryPage        = new InventoryPage(page);

    // Complete the full flow
    await cartPage.checkout();
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode,
    );
    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);

    // Click Back Home
    await checkoutCompletePage.backHome();

    await expect(page).toHaveURL(/inventory\.html/);

    // Cart badge should be gone — cart is reset after a completed order
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

});
