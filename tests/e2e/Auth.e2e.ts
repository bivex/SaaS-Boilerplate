/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T23:35:00
 * Last Updated: 2025-12-23T23:35:00
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
  });

  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to sign-in page
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should show sign-in page', async ({ page }) => {
    await page.goto('/sign-in');

    // Check page elements
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

    // Check social login buttons
    await expect(page.getByText('Google')).toBeVisible();
    await expect(page.getByText('GitHub')).toBeVisible();
  });

  test('should show sign-up page', async ({ page }) => {
    await page.goto('/sign-up');

    // Check page elements
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
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
    // Try to access dashboard without authentication
    await page.goto('/dashboard');

    // Should redirect to sign-in
    await expect(page).toHaveURL(/.*sign-in/);
  });

  test('should show user menu when authenticated', async ({ page }) => {
    // This test would require setting up authentication
    // For now, just test the UI structure exists
    test.skip('Requires authentication setup');
  });

  test('should handle sign out', async ({ page }) => {
    // This test would require setting up authentication
    test.skip('Requires authentication setup');
  });
});
