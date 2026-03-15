import { test, expect } from '@playwright/test';

const URL = 'https://www.npu.cz/cs';

test.describe('Responsive layout tests', () => {

    test('desktop layout – navigace viditelna', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto(URL);
        await expect(page).toHaveTitle(/Národní památkový ústav/i);
        const mainNav = page.locator('ul.main-navigation__list--highlight');
        await expect(mainNav).toBeVisible();
    });

    test('tablet layout – stranky se nacte', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto(URL);
        await expect(page).toHaveTitle(/Národní památkový ústav/i);
        const header = page.locator('header');
        await expect(header).toBeVisible();
    });

    test('mobilni layout – hamburger menu', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(URL);
        await expect(page).toHaveTitle(/Národní památkový ústav/i);
        const hamburger = page.locator(
            'button[aria-label*="menu" i], button[aria-label*="navigace" i], .hamburger, .nav-toggle, button.menu-toggle'
        ).first();
        await expect(hamburger).toBeVisible();
        await hamburger.click();
        const mobileNav = page.locator('nav, ul.main-navigation__list--highlight, .mobile-menu').first();
        await expect(mobileNav).toBeVisible();
    });

    test('mobilni layout – logo viditelne', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(URL);
        const logo = page.locator('a.page-header__logo, a[aria-label*="NPÚ" i], a[href="/cs"] img, header img').first();
        await expect(logo).toBeVisible();
    });

    test('desktop layout – paticka viditelna', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto(URL);
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

});
