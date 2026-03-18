import { test } from '@playwright/test';
import { EshopPage } from '../pages/EshopPage';

// cesta z homepage do detailu produktu
// vyhledavani podle jmena
// filtr podle roku
// filtr podle vydavatele
// filtr podle dostupnosti
// filtr podle typ knihy
// razeni podle ceny
// do kose a smazat

test.describe('NPU Eshop Tests', () => {
    test('workflow', async ({ page }) => {
        const eshopPage = new EshopPage(page);
        await eshopPage.goto();
    });
});