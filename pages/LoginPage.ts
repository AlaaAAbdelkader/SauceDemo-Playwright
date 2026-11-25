import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object for the SauceDemo login page (/).
 * Encapsulates all selectors and interactions so spec files stay clean.
 */
export class LoginPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────────────────
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton   = page.locator('[data-test="login-button"]');
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Navigate to the login page. */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Fill in credentials and click Login.
   * Does NOT assert any outcome — callers decide what to expect.
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Return the visible error banner text, or empty string if not visible. */
  async getErrorText(): Promise<string> {
    if (await this.errorMessage.isVisible()) {
      return (await this.errorMessage.textContent()) ?? '';
    }
    return '';
  }
}
