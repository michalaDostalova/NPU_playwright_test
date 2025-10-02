import { describe } from "node:test";
import { test, expect } from '@playwright/test';

test.describe('NPU Novinky Tests', () => {
  test('vyhledavani novinek', async ({ page }) => {
    await page.goto('https://www.npu.cz/cs/novinky');
    await expect(page.getByRole('heading', { name: 'Novinky' })).toBeVisible();
    await page.getByRole('link', { name: "hledat" }).click();
    const search = page.getByRole('searchbox', { name: 'Hledaný výraz' })
    await expect(search).toBeVisible();
    await search.fill('hrad');
    await page.getByRole('button', { name: 'Vyhledej' }).click();
    await page.waitForLoadState('networkidle');
    await expect(search).toHaveValue('hrad');
    const count = page.locator('.news-item');
    const resultsCount = await count.count();
    for(let i = 0; i < resultsCount; i++) {
      const item = count.nth(i);
      await expect(item).toContainText(/hrad/i);
    }

  });

test('filtr_novinky', async({page}) => {
    await page.goto('https://www.npu.cz/cs/novinky')
    const filtr = page.getByRole('link', { name: 'Filtr' });
    await expect(filtr).toBeVisible();
    await filtr.click();
    const buttonFiltr = page.getByRole('button', { name: 'Filtruj' });
    await expect(buttonFiltr).toBeVisible();
    const select = page.locator('select[name="region"]');
    await expect(select).toBeVisible();
    await select.selectOption('Praha');
    await buttonFiltr.click();
    await page.waitForLoadState('networkidle');
    const results = page.locator('.news-item')
    const count = await results.count();
    expect(count).toBeGreaterThan(0) 
    const link =  page.getByRole('link', { name: 'Načíst další' })
    expect(link).toBeVisible();
    await link.click();
     await page.waitForTimeout(1000);
    const newCount = await results.count();
    expect(newCount).toBeGreaterThan(count);




});

});


