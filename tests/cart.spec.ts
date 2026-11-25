/**
 * TC-CART-01 to TC-CART-07
 * Feature: Shopping Cart (add, remove, badge, persistence)
 * Pages: /inventory.html, /cart.html
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS, PRODUCTS } from '../utils/test-data';

test.describe('Shopping Cart', () => {

  // Log in as standard_user before every test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // ── TC-CART-01 ─────────────────────────────────────────────────────────────
  test('TC-CART-01: Add single item — cart badge updates to 1', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCartByName(PRODUCTS.backpack.name);

    // Badge should show 1
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);

    // Button should now read "Remove"
    const buttonText = await inventoryPage.getButtonTextByName(PRODUCTS.backpack.name);
    expect(buttonText).toBe('Remove');
  });

  // ── TC-CART-02 ─────────────────────────────────────────────────────────────
  test('TC-CART-02: Add two items — cart badge shows 2', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCartByName(PRODUCTS.backpack.name);
    await inventoryPage.addToCartByName(PRODUCTS.bikeLight.name);

    expect(await inventoryPage.getCartBadgeCount()).toBe(2);
  });

  // ── TC-CART-03 ─────────────────────────────────────────────────────────────
  test('TC-CART-03: Remove item from inventory page reverts button', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Add then immediately remove
    await inventoryPage.addToCartByName(PRODUCTS.backpack.name);
    await inventoryPage.removeFromCartByName(PRODUCTS.backpack.name);

    // Badge should be gone (count = 0)
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);

    // Button should revert to "Add to cart"
    const buttonText = await inventoryPage.getButtonTextByName(PRODUCTS.backpack.name);
    expect(buttonText).toBe('Add to cart');
  });

  // ── TC-CART-04 ─────────────────────────────────────────────────────────────
  test('TC-CART-04: Cart page shows correct item and price', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await inventoryPage.addToCartByName(PRODUCTS.bikeLight.name);
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/cart\.html/);

    const names = await cartPage.getItemNames();
    expect(names).toContain(PRODUCTS.bikeLight.name);

    const price = await cartPage.getItemPrice(PRODUCTS.bikeLight.name);
    expect(price).toBe(PRODUCTS.bikeLight.priceText);
  });

  // ── TC-CART-05 ─────────────────────────────────────────────────────────────
  test('TC-CART-05: Remove item from cart page empties the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await inventoryPage.addToCartByName(PRODUCTS.backpack.name);
    await inventoryPage.goToCart();

    await cartPage.removeItem(PRODUCTS.backpack.name);

    // Cart should be empty
    expect(await cartPage.getItemCount()).toBe(0);
  });

  // ── TC-CART-06 ─────────────────────────────────────────────────────────────
  test('TC-CART-06: Cart persists after navigating away and back', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    // Add item, then browse away back to inventory
    await inventoryPage.addToCartByName(PRODUCTS.fleeceJacket.name);
    await page.goto('/inventory.html');

    // Now go to cart — item must still be there
    await inventoryPage.goToCart();

    const names = await cartPage.getItemNames();
    expect(names).toContain(PRODUCTS.fleeceJacket.name);
  });

  // ── TC-CART-07 ─────────────────────────────────────────────────────────────
  test('TC-CART-07: "Continue Shopping" navigates back to inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);

    await inventoryPage.addToCartByName(PRODUCTS.backpack.name);
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

});
