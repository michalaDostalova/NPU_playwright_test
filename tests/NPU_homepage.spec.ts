import{test, expect} from '@playwright/test';

test.describe('homepage', () => {
    test('title', async ({ page }) => {
        await page.goto('https://www.npu.cz');
        await expect(page).toHaveTitle(/Národní památkový ústav/i);
    });
    test('search', async ({ page }) => {
        await page.goto('https://www.npu.cz');
        const searchBox = page.getByRole('textbox', { name: 'Search' });
        await searchBox.fill('hrad');
        await searchBox.click();

    });
});
