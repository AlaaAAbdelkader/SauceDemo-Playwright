import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object for SauceDemo checkout pages.
 *
 * Covers both steps:
 *   Step 1 — /checkout-step-one.html  (personal info form)
 *   Step 2 — /checkout-step-two.html  (order overview / summary)
 */
export class CheckoutPage {
  readonly page: Page;

  // ── Step 1 locators ───────────────────────────────────────────────────────
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // ── Step 2 locators ───────────────────────────────────────────────────────
  readonly summaryItems: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton  = page.locator('[data-test="continue"]');
    this.errorMessage    = page.locator('[data-test="error"]');

    // Step 2
    this.summaryItems  = page.locator('.cart_item');
    this.itemTotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel       = page.locator('.summary_tax_label');
    this.totalLabel     = page.locator('.summary_total_label');
    this.finishButton   = page.locator('[data-test="finish"]');
    this.cancelButton   = page.locator('[data-test="cancel"]');
  }

  // ── Step 1 actions ────────────────────────────────────────────────────────

  /**
   * Fill the checkout info form and click Continue.
   * Pass an empty string to leave a field blank (triggers validation errors).
   */
  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Return the error banner text from Step 1 validation. */
  async getErrorText(): Promise<string> {
    if (await this.errorMessage.isVisible()) {
      return (await this.errorMessage.textContent()) ?? '';
    }
    return '';
  }

  // ── Step 2 actions ────────────────────────────────────────────────────────

  /**
   * Parse the item sub-total from the summary label.
   * Label text example: "Item total: $29.99"  →  returns 29.99
   */
  async getItemTotal(): Promise<number> {
    const text = (await this.itemTotalLabel.textContent()) ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Parse the tax amount from the summary label.
   * Label text example: "Tax: $2.40"  →  returns 2.40
   */
  async getTax(): Promise<number> {
    const text = (await this.taxLabel.textContent()) ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Parse the final total from the summary label.
   * Label text example: "Total: $32.39"  →  returns 32.39
   */
  async getTotal(): Promise<number> {
    const text = (await this.totalLabel.textContent()) ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /** Click the Finish button to complete the order. */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
