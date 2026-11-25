/**
 * TC-INV-01 to TC-INV-05
 * Feature: Product Inventory (listing, sorting, detail navigation)
 * Page: /inventory.html
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import {
  USERS,
  TOTAL_PRODUCT_COUNT,
  PRICES_LOW_TO_HIGH,
  PRICES_HIGH_TO_LOW,
  PRODUCTS,
} from '../utils/test-data';

test.describe('Product Inventory', () => {

  // Log in as standard_user before every test in this suite
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  // ── TC-INV-01 ──────────────────────────────────────────────────────────────
  test('TC-INV-01: Inventory page displays exactly 6 products', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    const count = await inventoryPage.productItems.count();
    expect(count).toBe(TOTAL_PRODUCT_COUNT);
  });

  // ── TC-INV-02 ──────────────────────────────────────────────────────────────
  test('TC-INV-02: Sort products by Name (Z to A)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('za');

    const names = await inventoryPage.getAllProductNames();

    // Verify names are in reverse-alphabetical order
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  // ── TC-INV-03 ──────────────────────────────────────────────────────────────
  test('TC-INV-03: Sort products by Price (low to high)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getAllProductPrices();
    expect(prices).toEqual(PRICES_LOW_TO_HIGH);
  });

  // ── TC-INV-04 ──────────────────────────────────────────────────────────────
  test('TC-INV-04: Sort products by Price (high to low)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getAllProductPrices();
    expect(prices).toEqual(PRICES_HIGH_TO_LOW);
  });

  // ── TC-INV-05 ──────────────────────────────────────────────────────────────
  test('TC-INV-05: Navigate to product detail page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.clickProductName(PRODUCTS.backpack.name);

    // Should land on the item detail URL
    await expect(page).toHaveURL(/inventory-item\.html/);

    // Key detail-page elements must be visible
    await expect(page.locator('.inventory_details_name')).toHaveText(PRODUCTS.backpack.name);
    await expect(page.locator('.inventory_details_price')).toHaveText(PRODUCTS.backpack.priceText);
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
  });

});
