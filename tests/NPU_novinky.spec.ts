import { test, expect } from '@playwright/test';
import { NovinkyPage } from '../pages/NovinkyPage';

test.describe('NPU Novinky Tests', () => {
    test('vyhledavani novinek', async ({ page }) => {
        const novinkyPage = new NovinkyPage(page);
        await novinkyPage.goto();
        await expect(novinkyPage.heading).toBeVisible();
        await novinkyPage.searchNews('hrad');
        await expect(novinkyPage.searchBox).toHaveValue('hrad');
        const resultsCount = await novinkyPage.getNewsCount();
        for (let i = 0; i < resultsCount; i++) {
            const item = novinkyPage.newsItems.nth(i);
            await expect(item).toContainText(/hrad/i);
        }
    });

    test('filtr_novinky', async ({ page }) => {
        const novinkyPage = new NovinkyPage(page);
        await novinkyPage.goto();
        await novinkyPage.filterByRegion('Praha');
        const count = await novinkyPage.getNewsCount();
        expect(count).toBeGreaterThan(0);
        await expect(novinkyPage.loadMoreLink).toBeVisible();
        await novinkyPage.loadMore();
        const newCount = await novinkyPage.getNewsCount();
        expect(newCount).toBeGreaterThan(count);
    });
});


