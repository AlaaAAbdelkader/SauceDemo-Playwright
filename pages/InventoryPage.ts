import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object for the SauceDemo inventory page (/inventory.html).
 */
export class InventoryPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly sortDropdown: Locator;
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly cartBadge: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sortDropdown    = page.locator('[data-test="product-sort-container"]');
    this.productItems    = page.locator('.inventory_item');
    this.productNames    = page.locator('.inventory_item_name');
    this.productPrices   = page.locator('.inventory_item_price');
    this.cartBadge       = page.locator('.shopping_cart_badge');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink      = page.locator('#logout_sidebar_link');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Navigate directly to the inventory page. */
  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  /**
   * Select a sort option by its value attribute.
   * Values: 'az' | 'za' | 'lohi' | 'hilo'
   */
  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(value);
  }

  /** Add a product to the cart by its exact display name. */
  async addToCartByName(productName: string): Promise<void> {
    // Each product card wraps the button in a container alongside the name
    const productCard = this.page
      .locator('.inventory_item')
      .filter({ has: this.page.locator('.inventory_item_name', { hasText: productName }) });

    await productCard.locator('button').click();
  }

  /** Remove a product from the cart (while still on the inventory page). */
  async removeFromCartByName(productName: string): Promise<void> {
    const productCard = this.page
      .locator('.inventory_item')
      .filter({ has: this.page.locator('.inventory_item_name', { hasText: productName }) });

    await productCard.locator('button').click();
  }

  /** Get the text of the "Add to cart" / "Remove" button for a product. */
  async getButtonTextByName(productName: string): Promise<string> {
    const productCard = this.page
      .locator('.inventory_item')
      .filter({ has: this.page.locator('.inventory_item_name', { hasText: productName }) });

    return (await productCard.locator('button').textContent()) ?? '';
  }

  /** Get all visible product names in their current DOM order. */
  async getAllProductNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }

  /**
   * Get all visible product prices as numbers (e.g. "$29.99" → 29.99).
   */
  async getAllProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  /** Return the number shown on the cart badge, or 0 if the badge is absent. */
  async getCartBadgeCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.textContent();
      return parseInt(text ?? '0', 10);
    }
    return 0;
  }

  /** Click a product name to open its detail page. */
  async clickProductName(productName: string): Promise<void> {
    await this.page.locator('.inventory_item_name', { hasText: productName }).click();
  }

  /** Open the burger side-nav, then click Logout. */
  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }

  /** Navigate to the cart page via the cart icon. */
  async goToCart(): Promise<void> {
    await this.page.locator('.shopping_cart_link').click();
  }
}
