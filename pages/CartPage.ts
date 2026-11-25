import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object for the SauceDemo cart page (/cart.html).
 */
export class CartPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems              = page.locator('.cart_item');
    this.checkoutButton         = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Navigate directly to the cart page. */
  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  /** Return all item names currently in the cart. */
  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  /**
   * Return the price text for a specific cart item (e.g. "$9.99").
   * Returns empty string if item is not found.
   */
  async getItemPrice(productName: string): Promise<string> {
    const item = this.cartItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    return (await item.locator('.inventory_item_price').textContent()) ?? '';
  }

  /** Remove an item from the cart by product name. */
  async removeItem(productName: string): Promise<void> {
    const item = this.cartItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    await item.locator('button').click();
  }

  /** Click the Checkout button to proceed to checkout Step 1. */
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /** Click Continue Shopping to return to the inventory page. */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /** Return the total number of items in the cart. */
  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }
}
