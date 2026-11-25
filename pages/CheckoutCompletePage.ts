import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object for the SauceDemo order-complete page (/checkout-complete.html).
 */
export class CheckoutCompletePage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.confirmationText   = page.locator('[data-test="complete-text"]');
    this.backHomeButton     = page.locator('[data-test="back-to-products"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Return the large confirmation heading text. */
  async getHeaderText(): Promise<string> {
    return (await this.confirmationHeader.textContent()) ?? '';
  }

  /** Click the Back Home button to return to the inventory page. */
  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
