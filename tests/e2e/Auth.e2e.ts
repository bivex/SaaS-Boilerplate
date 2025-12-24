/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T23:35:00
 * Last Updated: 2025-12-23T21:27:14
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { expect, test } from '@playwright/test';

// Generate unique test user credentials
const testUser = {
  name: `Test User ${Date.now()}`,
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
};

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
  });

  // Clean up after all tests
  test.afterAll(async ({ browser }) => {
    // Close browser to clean up
    await browser.close();
  });

  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should show sign-in page', async ({ page }) => {
    await page.goto('/sign-in');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page elements - looking for the actual text from translations
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

    // Check social login buttons
    await expect(page.getByText('Google')).toBeVisible();
  });

  test('should show sign-up page', async ({ page }) => {
    await page.goto('/sign-up');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page elements - looking for the actual text from translations
    await expect(page.getByText('Create your account')).toBeVisible();
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('should navigate between sign-in and sign-up', async ({ page }) => {
    // Start at sign-in
    await page.goto('/sign-in');

    // Click sign-up link
    await page.getByText(/don't have an account/i).click();

    await expect(page).toHaveURL(/.*sign-up/);

    // Click sign-in link
    await page.getByText(/already have an account/i).click();

    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should show validation errors for invalid form data', async ({ page }) => {
    await page.goto('/sign-in');

    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should show validation or error messages
    await expect(page.getByText(/required|invalid|error/i)).toBeVisible();
  });

  test('should register a new user successfully', async ({ page }) => {
    await page.goto('/sign-up');

    // Fill in registration form
    await page.getByLabel('Full Name').fill(testUser.name);
    await page.getByLabel('Email').fill(testUser.email);
    await page.locator('#password').fill(testUser.password);
    await page.getByLabel('Confirm Password').fill(testUser.password);

    // Submit registration
    await page.getByRole('button', { name: /sign up/i }).click();

    // Wait a bit and check what happens
    await page.waitForTimeout(3000);

    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL after registration:', currentUrl);

    // Check for any error messages in the UI
    const errorLocator = page.locator('[role="alert"], .text-red-500, .text-destructive');
    const errorMessages = await errorLocator.allTextContents();
    console.log('UI Error messages:', errorMessages);

    // Check browser console for errors
    const consoleMessages = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);
    if (consoleMessages.length > 0) {
      console.log('Browser console errors:', consoleMessages);
    }

    // In Better Auth, registration might redirect to sign-in for the user to log in
    // Let's check if we're on sign-in page and if so, try to sign in
    if (currentUrl.includes('sign-in')) {
      console.log('Registration completed, now attempting to sign in...');

      // Fill in login form with the same credentials
      await page.locator('#email').fill(testUser.email);
      await page.locator('#password').fill(testUser.password);

      // Submit login
      await page.getByRole('button', { name: /sign in/i }).click();

      // Wait a bit and check what happens
      await page.waitForTimeout(2000);

      // Check for errors after sign-in attempt
      const signInErrors = await page.locator('[role="alert"], .text-red-500, .text-destructive').allTextContents();
      console.log('Sign-in errors:', signInErrors);

      // Check current URL after sign-in attempt
      const signInUrl = page.url();
      console.log('URL after sign-in attempt:', signInUrl);

      // Wait for redirect to dashboard
      await page.waitForURL('**/dashboard', { timeout: 5000 });
    } else if (currentUrl.includes('sign-up')) {
      // Still on sign-up page - registration failed
      throw new Error('Registration failed - still on sign-up page');
    } else if (currentUrl.includes('dashboard')) {
      // Successfully redirected to dashboard
      console.log('Registration successful - directly redirected to dashboard');
    } else {
      throw new Error(`Unexpected redirect to: ${currentUrl}`);
    }

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Should show welcome message or dashboard content
    await expect(page.getByText(/dashboard|welcome/i)).toBeVisible();
  });

  test('should sign in existing user and redirect to dashboard', async ({ page }) => {
    await page.goto('/sign-in');

    // Fill in login form
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);

    // Submit login
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Should show dashboard content
    await expect(page.getByText(/dashboard|welcome/i)).toBeVisible();
  });

  test('should handle organization onboarding after login', async ({ page }) => {
    // First sign in
    await page.goto('/sign-in');
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for potential redirect to organization selection
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // If redirected to org selection, handle it
    if (page.url().includes('organization-selection')) {
      // Skip organization setup for this test
      await page.getByText(/skip|continue/i).click();
      await page.waitForURL('**/dashboard');
    }

    // Verify we're on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show user menu and handle sign out', async ({ page }) => {
    // Sign in first
    await page.goto('/sign-in');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL('**/dashboard');

    // Look for user menu/avatar
    const userMenu = page.locator('[aria-label*="user" i], [data-testid*="user"], button').first();

    await expect(userMenu).toBeVisible();

    // Click to open user menu
    await userMenu.click();

    // Should show user options
    await expect(page.getByText(/profile|settings|sign out/i)).toBeVisible();

    // Click sign out
    await page.getByText(/sign out/i).click();

    // Should redirect to sign-in page
    await page.waitForURL('**/sign-in', { timeout: 5000 });

    await expect(page).toHaveURL(/.*sign-in/);

    // Try to access dashboard - should redirect back to sign-in
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should handle organization onboarding flow', async ({ page }) => {
    // This would require a mock authenticated user
    // For now, just test the page structure
    await page.goto('/onboarding/organization-selection');

    // Should show organization selection UI
    await expect(page.getByText(/organization|create/i)).toBeVisible();
  });

  test('should support internationalization', async ({ page }) => {
    // Test Ukrainian locale
    await page.goto('/uk/sign-in');

    // Should show Ukrainian text
    await expect(page.getByRole('heading', { name: /ласкаво просимо/i })).toBeVisible();
  });

  test('should handle different screen sizes', async ({ page }) => {
    await page.goto('/sign-in');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Elements should still be visible and usable
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Elements should still be visible
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should handle accessibility features', async ({ page }) => {
    await page.goto('/sign-in');

    // Check for proper ARIA labels
    const emailInput = page.getByLabel(/email/i);

    await expect(emailInput).toHaveAttribute('type', 'email');

    const passwordInput = page.getByLabel(/password/i);

    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Check keyboard navigation
    await page.keyboard.press('Tab');

    await expect(emailInput).toBeFocused();

    await page.keyboard.press('Tab');

    await expect(passwordInput).toBeFocused();
  });
});

test.describe('Dashboard Authentication', () => {
  test('should protect dashboard routes', async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();

    // Try to access dashboard without authentication
    await page.goto('/dashboard');

    // Should redirect to sign-in
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should maintain session across page refreshes', async ({ page }) => {
    // Sign in
    await page.goto('/sign-in');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    await page.waitForURL('**/dashboard');

    // Refresh the page
    await page.reload();

    // Should still be on dashboard (session maintained)
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText(/dashboard|welcome/i)).toBeVisible();
  });

  test('should handle multiple authentication attempts', async ({ page }) => {
    // Try wrong password first
    await page.goto('/sign-in');
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should show error and stay on sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
    await expect(page.getByText(/error|invalid/i)).toBeVisible();

    // Now try correct password
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to dashboard
    await page.waitForURL('**/dashboard');

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle concurrent sessions', async ({ browser }) => {
    // Create two browser contexts (simulating two users/tabs)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Sign in with first context
      await page1.goto('/sign-in');
      await page1.getByLabel(/email/i).fill(testUser.email);
      await page1.getByLabel(/password/i).fill(testUser.password);
      await page1.getByRole('button', { name: /sign in/i }).click();
      await page1.waitForURL('**/dashboard');

      // Sign in with second context (same user)
      await page2.goto('/sign-in');
      await page2.getByLabel(/email/i).fill(testUser.email);
      await page2.getByLabel(/password/i).fill(testUser.password);
      await page2.getByRole('button', { name: /sign in/i }).click();
      await page2.waitForURL('**/dashboard');

      // Both should be authenticated
      await expect(page1).toHaveURL(/.*dashboard/);
      await expect(page2).toHaveURL(/.*dashboard/);
    } finally {
      await context1.close();
      await context2.close();
    }
  });
});
