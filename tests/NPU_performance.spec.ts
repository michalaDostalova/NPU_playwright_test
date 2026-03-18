import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { EventsPage } from '../pages/EventsPage';

test.describe('NPU load test', () => {
    test('NPU nacteni homepage', async ({ page }) => {
        const homePage = new HomePage(page);
        const loadTest = Date.now();
        await homePage.goto();
        await expect(page).toHaveTitle(/Národní památkový ústav/i);
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - loadTest;
        expect(loadTime).toBeLessThan(5000);
        console.log(loadTime);
    });

    test('NPU nacteni akce', async ({ page }) => {
        const eventsPage = new EventsPage(page);
        const loadTestAkce = Date.now();
        await eventsPage.gotoEvents();
        await expect(page).toHaveTitle(/Akce/i);
        await page.waitForLoadState('networkidle');
        const loadTimeAkce = Date.now() - loadTestAkce;
        expect(loadTimeAkce).toBeLessThan(5000);
        console.log(loadTimeAkce);
    });
});