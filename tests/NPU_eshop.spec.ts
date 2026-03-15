//cesta z homepage do detailu produktu
//vyhledavani podle jmena
//filtr podle roku
//filtr podle vydavatele
//filtr podle dostupnosti
//filtr podle  typ knihy
//ražení podle ceny
//do kose a smazat


import { test, expect } from '@playwright/test';
const URL = 'https://eshop.npu.cz/cs/';

test.describe('NPU Eshop Tests', () => {

    // cesta z homepage do detailu produktu
    test('cesta k detailu produktu', async ({ page }) => {
        await page.goto(URL);
        await expect(page).toHaveTitle(/NPÚ/i);
        const firstProduct = page.locator('.product-list .product-item, .products .product, article.product').first();
        await expect(firstProduct).toBeVisible();
        await firstProduct.click();
        await expect(page).not.toHaveURL(URL);
        const productName = page.locator('h1').first();
        await expect(productName).toBeVisible();
    });

    // vyhledavani podle jmena
    test('vyhledavani podle jmena', async ({ page }) => {
        await page.goto(URL);
        const searchInput = page.locator('input[type="search"], input[name="q"], input[placeholder*="hled" i]').first();
        await expect(searchInput).toBeVisible();
        await searchInput.fill('hrad');
        await searchInput.press('Enter');
        await page.waitForLoadState('networkidle');
        const results = page.locator('.product-list .product-item, .products .product, article.product');
        const count = await results.count();
        expect(count).toBeGreaterThan(0);
    });

    // ražení podle ceny
    test('razeni podle ceny', async ({ page }) => {
        await page.goto(URL);
        const sortSelect = page.locator('select[name*="sort" i], select[name*="order" i], select[id*="sort" i]').first();
        await expect(sortSelect).toBeVisible();
        await sortSelect.selectOption({ label: /cen/i });
        await page.waitForLoadState('networkidle');
        const products = page.locator('.product-list .product-item, .products .product, article.product');
        await expect(products.first()).toBeVisible();
    });

    // do kose a smazat
    test('vlozit do kosiku a odebrat', async ({ page }) => {
        await page.goto(URL);
        const firstProduct = page.locator('.product-list .product-item, .products .product, article.product').first();
        await expect(firstProduct).toBeVisible();
        await firstProduct.click();
        await page.waitForLoadState('networkidle');
        const addToCartBtn = page.getByRole('button', { name: /do košíku|přidat|koupit|add to cart/i });
        await expect(addToCartBtn).toBeVisible();
        await addToCartBtn.click();
        await page.waitForLoadState('networkidle');
        const cartLink = page.locator('a[href*="cart"], a[href*="kosik"], a[href*="košík"]').first();
        await cartLink.click();
        await page.waitForLoadState('networkidle');
        const removeBtn = page.locator('button[title*="odebrat" i], button[title*="remove" i], a[title*="odebrat" i], .cart-item__remove, input[name*="delete"]').first();
        await expect(removeBtn).toBeVisible();
        await removeBtn.click();
        await page.waitForLoadState('networkidle');
        const emptyCartMsg = page.locator('text=/košík je prázdný|prázdný košík|your cart is empty/i');
        await expect(emptyCartMsg).toBeVisible();
    });

});