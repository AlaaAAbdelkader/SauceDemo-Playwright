/**
 * Centralised test data for SauceDemo automation suite.
 * All credentials, product details and form values live here —
 * no magic strings inside spec files.
 */

// ─── User credentials ────────────────────────────────────────────────────────

export const USERS = {
  /** Standard account — used for all happy-path tests */
  standard: { username: 'standard_user', password: 'secret_sauce' },

  /** Account that is blocked from logging in */
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },

  /** Account with intentional ~5 s login delay */
  performanceGlitch: { username: 'performance_glitch_user', password: 'secret_sauce' },

  /** Account that surfaces broken product images */
  problem: { username: 'problem_user', password: 'secret_sauce' },

  /** Account that surfaces checkout errors */
  error: { username: 'error_user', password: 'secret_sauce' },
} as const;

// ─── Products ────────────────────────────────────────────────────────────────

export const PRODUCTS = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: 29.99,
    priceText: '$29.99',
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    priceText: '$9.99',
  },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    priceText: '$15.99',
  },
  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    priceText: '$49.99',
  },
  onesie: {
    name: 'Sauce Labs Onesie',
    price: 7.99,
    priceText: '$7.99',
  },
  redTShirt: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    priceText: '$15.99',
  },
} as const;

/** Total number of products on the inventory page */
export const TOTAL_PRODUCT_COUNT = 6;

/** Expected price order: low → high */
export const PRICES_LOW_TO_HIGH = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];

/** Expected price order: high → low */
export const PRICES_HIGH_TO_LOW = [49.99, 29.99, 15.99, 15.99, 9.99, 7.99];

// ─── Checkout form data ───────────────────────────────────────────────────────

export const CHECKOUT_INFO = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
  missingFirstName: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
  },
  missingLastName: {
    firstName: 'John',
    lastName: '',
    postalCode: '12345',
  },
  missingPostalCode: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
  },
} as const;

// ─── Error messages ───────────────────────────────────────────────────────────

export const ERROR_MESSAGES = {
  lockedOut:          'Epic sadface: Sorry, this user has been locked out.',
  wrongCredentials:   'Epic sadface: Username and password do not match any user in this service',
  usernameRequired:   'Epic sadface: Username is required',
  passwordRequired:   'Epic sadface: Password is required',
  firstNameRequired:  'Error: First Name is required',
  lastNameRequired:   'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
} as const;

// ─── Thresholds ───────────────────────────────────────────────────────────────

/** Max acceptable login duration for performance_glitch_user (ms) */
export const PERF_GLITCH_LOGIN_TIMEOUT_MS = 10_000;
