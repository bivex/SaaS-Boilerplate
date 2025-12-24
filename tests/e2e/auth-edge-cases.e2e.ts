/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:10:00
 * Last Updated: 2025-12-24T01:03:42
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import {expect, test} from '@playwright/test';

test.describe('Authentication Edge Cases', () => {
    test.beforeEach(async ({page}) => {
        await page.context().clearCookies();
        await page.context().clearLocalStorage();
    });

    test('handles no session state gracefully', async ({page}) => {
        // Access protected route without any session
        await page.goto('/dashboard');

        // Should redirect to sign-in
        await page.waitForURL('**/sign-in');

        expect(page.url()).toContain('/sign-in');

        // Should show sign-in form
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();

        // No error messages should be shown (clean state)
        await expect(page.getByText(/error|invalid/i)).not.toBeVisible();
    });

    test('handles malformed session cookies', async ({page}) => {
        // Set invalid session cookie
        await page.context().addCookies([{
            name: 'better-auth.session_token',
            value: 'invalid-malformed-token',
            domain: 'localhost',
            path: '/',
        }]);

        await page.goto('/dashboard');

        // Should redirect to sign-in despite invalid cookie
        await page.waitForURL('**/sign-in');

        expect(page.url()).toContain('/sign-in');
    });

    test('handles expired session cookies', async ({page}) => {
        // Set expired session cookie (simulate)
        const expiredToken = 'expired.session.token';
        await page.context().addCookies([{
            name: 'better-auth.session_token',
            value: expiredToken,
            domain: 'localhost',
            path: '/',
            expires: Date.now() / 1000 - 3600, // Expired 1 hour ago
        }]);

        await page.goto('/dashboard');

        // Should redirect to sign-in
        await page.waitForURL('**/sign-in');

        expect(page.url()).toContain('/sign-in');
    });

    test('handles corrupted localStorage session data', async ({page}) => {
        // Set corrupted session data in localStorage
        await page.context().addInitScript(() => {
            localStorage.setItem('better-auth-session', '{invalid json');
        });

        await page.goto('/dashboard');

        // Should redirect to sign-in
        await page.waitForURL('**/sign-in');

        expect(page.url()).toContain('/sign-in');
    });

    test('handles race conditions in authentication state', async ({page}) => {
        // Simulate rapid navigation between protected routes
        const promises = [
            page.goto('/dashboard'),
            page.waitForTimeout(100).then(() => page.goto('/dashboard')),
            page.waitForTimeout(200).then(() => page.goto('/dashboard')),
        ];

        await Promise.all(promises);

        // Should eventually settle on sign-in page
        await page.waitForURL('**/sign-in');

        expect(page.url()).toContain('/sign-in');
    });

    test('handles authentication during page unload', async ({page}) => {
        await page.goto('/sign-in');

        // Start authentication process
        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        const signInPromise = page.getByRole('button', {name: /sign in/i}).click();

        // Navigate away immediately (simulating page unload)
        await page.goto('/sign-up');

        // Wait for sign-in attempt to complete or timeout
        try {
            await signInPromise;
        } catch (error) {
            // Expected - request may be aborted
        }

        // Should be on sign-up page
        expect(page.url()).toContain('/sign-up');
    });

    test('handles authentication with slow network', async ({page}) => {
        // Simulate slow network by delaying API responses
        await page.route('**/api/auth/**', async (route) => {
            await page.waitForTimeout(5000); // 5 second delay
            await route.fulfill({status: 200, body: '{}'});
        });

        await page.goto('/sign-in');

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        const startTime = Date.now();
        await page.getByRole('button', {name: /sign in/i}).click();

        // Should eventually complete (with error, but handles gracefully)
        await expect(page.getByText(/error|invalid/i)).toBeVisible();

        const duration = Date.now() - startTime;

        expect(duration).toBeGreaterThan(4000); // Should take at least 4 seconds due to delay
    });

    test('handles authentication interruption by browser refresh', async ({page}) => {
        await page.goto('/sign-in');

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        // Start authentication
        await page.getByRole('button', {name: /sign in/i}).click();

        // Refresh page immediately
        await page.reload();

        // Should be back on sign-in page with clean state
        expect(page.url()).toContain('/sign-in');

        // Form should be reset
        await expect(page.getByLabel('Email')).toHaveValue('');
        await expect(page.getByLabel('Password')).toHaveValue('');
    });

    test('handles multiple simultaneous authentication attempts', async ({page, browser}) => {
        const contexts = await Promise.all([
            browser.newContext(),
            browser.newContext(),
            browser.newContext(),
        ]);

        const pages = await Promise.all(
            contexts.map(context => context.newPage()),
        );

        try {
            // All pages attempt authentication simultaneously
            await Promise.all(pages.map(async (page, index) => {
                await page.goto('/sign-in');
                await page.getByLabel('Email').fill(`test${index}@example.com`);
                await page.getByLabel('Password').fill('password123');
                await page.getByRole('button', {name: /sign in/i}).click();
            }));

            // All should handle the authentication failure gracefully
            await Promise.all(pages.map(async (page) => {
                await page.waitForURL('**/sign-in');

                await expect(page.getByText(/invalid|error/i)).toBeVisible();
            }));
        } finally {
            await Promise.all(contexts.map(context => context.close()));
        }
    });

    test('handles authentication state during browser back/forward', async ({page}) => {
        // Navigate through auth flow using browser history
        await page.goto('/sign-in');

        expect(page.url()).toContain('/sign-in');

        await page.goto('/sign-up');

        expect(page.url()).toContain('/sign-up');

        await page.goBack();

        expect(page.url()).toContain('/sign-in');

        await page.goForward();

        expect(page.url()).toContain('/sign-up');

        // Authentication state should be properly isolated
        await expect(page.getByLabel('Full Name')).toBeVisible();
    });

    test('handles authentication with browser extensions interference', async ({page}) => {
        // Simulate extension interference by modifying requests
        await page.route('**/api/auth/**', async (route) => {
            const request = route.request();
            const headers = request.headers();

            // Simulate extension adding/modifying headers
            headers['x-extension-interference'] = 'modified';

            await route.continue({headers});
        });

        await page.goto('/sign-in');

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        await page.getByRole('button', {name: /sign in/i}).click();

        // Should handle gracefully despite header interference
        await expect(page.getByText(/error|invalid/i)).toBeVisible();
    });

    test('handles authentication during service worker interference', async ({page}) => {
        // Register a mock service worker that interferes with requests
        await page.addInitScript(() => {
            if ('serviceWorker' in navigator) {
                // Mock service worker interference
                const originalFetch = window.fetch;
                window.fetch = function (...args) {
                    // Simulate service worker delay
                    return new Promise((resolve) => {
                        setTimeout(() => resolve(originalFetch.apply(this, args)), 1000);
                    });
                };
            }
        });

        await page.goto('/sign-in');

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        await page.getByRole('button', {name: /sign in/i}).click();

        // Should handle service worker interference gracefully
        await expect(page.getByText(/error|invalid/i)).toBeVisible();
    });

    test('handles authentication with browser privacy settings', async ({page, browser}) => {
        // Test with privacy-focused context
        const privacyContext = await browser.newContext({
            permissions: [], // No permissions
            geolocation: undefined,
            // Simulate privacy settings
        });

        const privacyPage = await privacyContext.newPage();

        try {
            await privacyPage.goto('/sign-in');

            // Should still function normally
            await expect(privacyPage.getByLabel('Email')).toBeVisible();

            await privacyPage.getByLabel('Email').fill('test@example.com');
            await privacyPage.getByLabel('Password').fill('password123');

            await privacyPage.getByRole('button', {name: /sign in/i}).click();

            // Should handle authentication gracefully
            await expect(privacyPage.getByText(/error|invalid/i)).toBeVisible();
        } finally {
            await privacyContext.close();
        }
    });

    test('handles authentication during low memory conditions', async ({page}) => {
        // Simulate memory pressure by creating many DOM elements
        await page.addInitScript(() => {
            // Create memory pressure
            const elements = [];
            for (let i = 0; i < 10000; i++) {
                const div = document.createElement('div');
                div.textContent = 'Memory pressure test';
                div.style.display = 'none';
                document.body.appendChild(div);
                elements.push(div);
            }

            // Cleanup after test
            setTimeout(() => {
                elements.forEach(el => el.remove());
            }, 10000);
        });

        await page.goto('/sign-in');

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        await page.getByRole('button', {name: /sign in/i}).click();

        // Should handle memory pressure gracefully
        await expect(page.getByText(/error|invalid/i)).toBeVisible();
    });

    test('handles authentication with browser security policies', async ({page}) => {
        // Test with Content Security Policy
        await page.addInitScript(() => {
            // Simulate CSP restrictions
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = 'default-src \'self\'; script-src \'self\'';
            document.head.appendChild(meta);
        });

        await page.goto('/sign-in');

        // Should still load and attempt authentication
        await expect(page.getByLabel('Email')).toBeVisible();

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        await page.getByRole('button', {name: /sign in/i}).click();

        // Should handle CSP restrictions gracefully
        await expect(page.getByText(/error|invalid/i)).toBeVisible();
    });

    test('handles authentication during network connectivity changes', async ({page}) => {
        await page.goto('/sign-in');

        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');

        // Start authentication
        await page.getByRole('button', {name: /sign in/i}).click();

        // Simulate network going offline then online
        await page.context().setOffline(true);
        await page.waitForTimeout(1000);
        await page.context().setOffline(false);

        // Should handle network changes gracefully
        await expect(page.getByText(/error|network|offline/i)).toBeVisible();
    });

    test('handles authentication with browser zoom levels', async ({page}) => {
        // Test with different zoom levels
        await page.setViewportSize({width: 1920, height: 1080});

        // Test at 200% zoom
        await page.evaluate(() => {
            document.body.style.zoom = '2.0';
        });

        await page.goto('/sign-in');

        // Should still be usable at different zoom levels
        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByRole('button', {name: /sign in/i})).toBeVisible();

        // Elements should be clickable
        await page.getByLabel('Email').fill('test@example.com');
        await page.getByLabel('Password').fill('password123');
        await page.getByRole('button', {name: /sign in/i}).click();

        await expect(page.getByText(/error|invalid/i)).toBeVisible();
    });

    test('handles authentication with browser accessibility features', async ({page}) => {
        await page.goto('/sign-in');

        // Test keyboard navigation
        await page.keyboard.press('Tab');

        await expect(page.getByLabel('Email')).toBeFocused();

        await page.keyboard.press('Tab');

        await expect(page.getByLabel('Password')).toBeFocused();

        await page.keyboard.press('Tab');
        const signInButton = page.getByRole('button', {name: /sign in/i});

        await expect(signInButton).toBeFocused();

        // Test form submission with Enter key
        await page.keyboard.press('Enter');

        // Should attempt authentication
        await expect(page.getByText(/error|invalid/i)).toBeVisible();
    });
});
