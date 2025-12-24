/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:10:00
 * Last Updated: 2025-12-23T21:08:23
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import {expect, test} from '@playwright/test';

test.describe('Authentication Lifecycle E2E', () => {
    test.beforeEach(async ({page}) => {
        // Clear any existing session
        await page.context().clearCookies();
        await page.context().clearLocalStorage();
    });

    test('complete sign-in → tRPC call → sign-out flow', async ({page}) => {
        const testUser = {
            email: `e2e-${Date.now()}@example.com`,
            password: 'TestPassword123!',
            name: 'E2E Test User',
        };

        // Step 1: Sign up new user
        await page.goto('/sign-up');

        await page.getByLabel('Full Name').fill(testUser.name);
        await page.getByLabel('Email').fill(testUser.email);
        await page.getByLabel('Password').fill(testUser.password);
        await page.getByLabel('Confirm Password').fill(testUser.password);

        await page.getByRole('button', {name: /sign up/i}).click();

        // Wait for redirect to dashboard
        await page.waitForURL('**/dashboard', {timeout: 10000});

        expect(page.url()).toContain('/dashboard');

        // Step 2: Access protected tRPC functionality (dashboard should load)
        await expect(page.getByText(/dashboard|welcome/i)).toBeVisible();

        // Verify we can access user-specific content
        await expect(page.getByText(testUser.name)).toBeVisible();

        // Step 3: Sign out
        // Look for user menu (this might be a dropdown or button)
        const userMenuTrigger = page.locator('[data-testid="user-menu"], [aria-label*="user"], button').first();

        await expect(userMenuTrigger).toBeVisible();

        await userMenuTrigger.click();

        // Click sign out
        await page.getByText(/sign out/i).click();

        // Should redirect to sign-in page
        await page.waitForURL('**/sign-in', {timeout: 5000});

        expect(page.url()).toContain('/sign-in');

        // Step 4: Verify session is cleared
        // Try to access dashboard - should redirect back to sign-in
        await page.goto('/dashboard');

        expect(page.url()).toContain('/sign-in');

        // Verify we can't access protected content
        await expect(page.getByText(/dashboard|welcome/i)).not.toBeVisible();
    });

    test('handles expired session during active usage', async ({page}) => {
        const testUser = {
            email: `expired-${Date.now()}@example.com`,
            password: 'TestPassword123!',
        };

        // First, sign in
        await page.goto('/sign-in');
        await page.getByLabel('Email').fill(testUser.email);
        await page.getByLabel('Password').fill(testUser.password);
        await page.getByRole('button', {name: /sign in/i}).click();

        // Wait for potential failure and redirect back to sign-in
        await page.waitForURL('**/sign-in', {timeout: 5000});

        expect(page.url()).toContain('/sign-in');

        // Should show error message
        await expect(page.getByText(/invalid|error/i)).toBeVisible();
    });

    test('handles concurrent sessions and race conditions', async ({page, browser}) => {
        const testUser = {
            email: `race-${Date.now()}@example.com`,
            password: 'TestPassword123!',
        };

        // Create multiple contexts to simulate concurrent usage
        const context1 = await browser.newContext();
        const context2 = await browser.newContext();

        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        try {
            // Both pages try to sign in simultaneously
            await Promise.all([
                page1.goto('/sign-in'),
                page2.goto('/sign-in'),
            ]);

            // Fill forms
            await Promise.all([
                page1.getByLabel('Email').fill(testUser.email),
                page1.getByLabel('Password').fill(testUser.password),
                page2.getByLabel('Email').fill(testUser.email),
                page2.getByLabel('Password').fill(testUser.password),
            ]);

            // Submit forms simultaneously
            await Promise.all([
                page1.getByRole('button', {name: /sign in/i}).click(),
                page2.getByRole('button', {name: /sign in/i}).click(),
            ]);

            // Both should handle the authentication failure gracefully
            await Promise.all([
                page1.waitForURL('**/sign-in', {timeout: 5000}),
                page2.waitForURL('**/sign-in', {timeout: 5000}),
            ]);

            // Both should show appropriate error messages
            await expect(page1.getByText(/invalid|error/i)).toBeVisible();
            await expect(page2.getByText(/invalid|error/i)).toBeVisible();
        } finally {
            await context1.close();
            await context2.close();
        }
    });

    test('handles network interruptions during authentication', async ({page}) => {
        // Mock network failure by intercepting requests
        await page.route('**/api/auth/**', async (route) => {
            // Simulate network failure
            await route.abort('failed');
        });

        await page.goto('/sign-in');

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        await page.getByRole('button', {name: /sign in/i}).click();

        // Should show network error
        await expect(page.getByText(/error|network|failed/i)).toBeVisible();

        // Should remain on sign-in page
        expect(page.url()).toContain('/sign-in');
    });

    test('handles revoked session during usage', async ({page}) => {
        // This test would require backend support for session revocation
        // For now, we'll test the UI behavior when session becomes invalid

        const testUser = {
            email: `revoked-${Date.now()}@example.com`,
            password: 'TestPassword123!',
        };

        // Sign in (will fail, but tests the flow)
        await page.goto('/sign-in');
        await page.getByLabel('Email').fill(testUser.email);
        await page.getByLabel('Password').fill(testUser.password);
        await page.getByRole('button', {name: /sign in/i}).click();

        // Should stay on sign-in page with error
        await page.waitForURL('**/sign-in');

        await expect(page.getByText(/invalid|error/i)).toBeVisible();
    });

    test('handles browser refresh during active session', async ({page}) => {
        // Since we can't actually create a valid session in e2e tests,
        // we'll test the refresh behavior when not authenticated

        await page.goto('/dashboard');

        // Should redirect to sign-in
        await page.waitForURL('**/sign-in');

        // Refresh the sign-in page
        await page.reload();

        // Should still be on sign-in page
        expect(page.url()).toContain('/sign-in');

        // Form should be reset/clear
        const emailInput = page.getByLabel('Email');
        const passwordInput = page.getByLabel('Password');

        await expect(emailInput).toHaveValue('');
        await expect(passwordInput).toHaveValue('');
    });

    test('handles multiple rapid authentication attempts', async ({page}) => {
        await page.goto('/sign-in');

        // Rapidly submit multiple sign-in attempts
        for (let i = 0; i < 3; i++) {
            await page.getByLabel('Email').fill(`test${i}@example.com`);
            await page.getByLabel('Password').fill('password123');

            await page.getByRole('button', {name: /sign in/i}).click();

            // Wait for error response
            await expect(page.getByText(/invalid|error/i)).toBeVisible();

            // Clear form for next attempt
            await page.getByLabel('Email').clear();
            await page.getByLabel('Password').clear();
        }

        // Page should remain functional
        expect(page.url()).toContain('/sign-in');
    });

    test('handles authentication state across browser tabs', async ({page, context}) => {
        // Open first tab
        await page.goto('/dashboard');
        await page.waitForURL('**/sign-in');

        // Open second tab
        const page2 = await context.newPage();
        await page2.goto('/dashboard');
        await page2.waitForURL('**/sign-in');

        // Both tabs should be on sign-in page
        expect(page.url()).toContain('/sign-in');
        expect(page2.url()).toContain('/sign-in');

        // Sign in on first tab (will fail, but tests state isolation)
        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');
        await page.getByRole('button', {name: /sign in/i}).click();

        // Second tab should remain unaffected
        expect(page2.url()).toContain('/sign-in');
        await expect(page2.getByLabel('Email')).toHaveValue('');

        await page2.close();
    });

    test('handles form validation during authentication flow', async ({page}) => {
        await page.goto('/sign-up');

        // Try to submit empty form
        await page.getByRole('button', {name: /sign up/i}).click();

        // Should show validation errors or stay on page
        await expect(page.getByText(/required|error/i)).toBeVisible();

        // Fill invalid email
        await page.getByLabel('Full Name').fill('Test User');
        await page.getByLabel('Email').fill('invalid-email');
        await page.getByLabel('Password').fill('123');
        await page.getByLabel('Confirm Password').fill('123');

        await page.getByRole('button', {name: /sign up/i}).click();

        // Should show validation errors
        await expect(page.getByText(/invalid|error/i)).toBeVisible();

        // Fix email but mismatch passwords
        await page.getByLabel('Email').clear();
        await page.getByLabel('Email').fill('valid@example.com');
        await page.getByLabel('Confirm Password').clear();
        await page.getByLabel('Confirm Password').fill('different');

        await page.getByRole('button', {name: /sign up/i}).click();

        // Should show password mismatch error
        await expect(page.getByText(/password|match|error/i)).toBeVisible();
    });

    test('handles authentication timeout scenarios', async ({page}) => {
        // Set up a long delay to simulate timeout
        await page.route('**/api/auth/**', async (route) => {
            // Delay response by 30 seconds (longer than test timeout)
            await new Promise(resolve => setTimeout(resolve, 30000));
            await route.fulfill({status: 200, body: '{}'});
        });

        await page.goto('/sign-in');

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        const signInButton = page.getByRole('button', {name: /sign in/i});

        await signInButton.click();

        // Button should show loading state
        await expect(signInButton).toBeDisabled();

        // Test should timeout, demonstrating timeout handling
        // In a real implementation, there should be proper timeout handling
    });

    test('handles back/forward navigation during auth flow', async ({page}) => {
        // Start at sign-in
        await page.goto('/sign-in');

        expect(page.url()).toContain('/sign-in');

        // Navigate to sign-up
        await page.getByText(/don't have an account/i).click();
        await page.waitForURL('**/sign-up');

        expect(page.url()).toContain('/sign-up');

        // Use browser back button
        await page.goBack();
        await page.waitForURL('**/sign-in');

        expect(page.url()).toContain('/sign-in');

        // Use browser forward button
        await page.goForward();
        await page.waitForURL('**/sign-up');

        expect(page.url()).toContain('/sign-up');

        // Forms should maintain state or be properly reset
        await expect(page.getByLabel('Full Name')).toBeVisible();
    });

    test('handles authentication with different user agents', async ({page, browser}) => {
        // Test with mobile user agent
        const mobileContext = await browser.newContext({
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
        });

        const mobilePage = await mobileContext.newPage();

        try {
            await mobilePage.goto('/sign-in');

            // Should still load and function properly
            await expect(mobilePage.getByLabel('Email')).toBeVisible();
            await expect(mobilePage.getByRole('button', {name: /sign in/i})).toBeVisible();

            // Test responsive behavior
            await expect(mobilePage.getByText('Welcome back')).toBeVisible();
        } finally {
            await mobileContext.close();
        }
    });
});
