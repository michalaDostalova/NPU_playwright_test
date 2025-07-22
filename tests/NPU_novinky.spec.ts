import { describe } from "node:test";
import { test, expect } from '@playwright/test';

test.describe('NPU Novinky Tests', () => {
  test('should display the latest news', async ({ page }) => {
    await page.goto('https://www.npu.cz/cs/novinky');
    await expect(page.getByRole('heading', { name: 'Novinky' })).toBeVisible();
  });

test('test search', async ({ page }) => {


    

});

});


