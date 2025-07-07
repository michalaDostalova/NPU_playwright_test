import{test, expect} from '@playwright/test';
import { describe } from 'node:test';

test.describe('homepage', () => {
    test('title', async ({ page }) => {
        await page.goto('https://www.npu.cz');
        await expect(page).toHaveTitle(/Národní památkový ústav/i);
    });
    test('search', async ({ page }) => {
        await page.goto('https://www.npu.cz');
        const searchBox = page.getByRole('textbox', { name: 'Search' });
        await searchBox.fill('hrad');
        await searchBox.press('Enter');
        await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
    const resultHeading = page.getByRole('heading', { name: 'hrad', exact: true });
    await expect(resultHeading).toBeVisible();
});

 test('FB link', async ({ page, context }) => {
        await page.goto('https://www.npu.cz');
        const fbLink = page.locator('ul.socials li.socials-item a[href*="facebook.com"]');
        const [fbPage] = await Promise.all([
            context.waitForEvent('page'),
            fbLink.click()
        ]);
        await expect(fbPage).toHaveURL(/facebook\.com/);
    await fbPage.close();
    })

    // Instagram link test
test('Instagram link', async ({ page, context }) => {
    await page.goto('https://www.npu.cz');
    const instaLink = page.locator('ul.socials li.socials-item a[href*="instagram.com"]');
    const [instaPage] = await Promise.all([
        context.waitForEvent('page'),
        instaLink.click()
    ]);
    await expect(instaPage).toHaveURL(/instagram\.com/);
    await instaPage.close();
})
test('YT link', async ({ page, context }) => {
    await page.goto('https://www.npu.cz');
    const ytLink = page.locator('ul.socials li.socials-item a[href*="youtube.com"]');
    const [ytPage] = await Promise.all([
        context.waitForEvent('page'),
        ytLink.click()
    ]);
    await expect(ytPage).toHaveURL(/youtube\.com/);
    await ytPage.close();

})
test('Linkedin link', async ({ page, context }) => {
    await page.goto('https://www.npu.cz');
    const linkedinLink = page.locator('ul.socials li.socials-item a[href*="linkedin.com"]');
    const [linkedinPage] = await Promise.all([
        context.waitForEvent('page'),
        linkedinLink.click()
    ]);
    await expect(linkedinPage).toHaveURL(/linkedin\.com/);
    await linkedinPage.close();

})

test('login via UI', async ({ page }) => {
    await page.goto('https://npu.cz/en/shop/account/my-account'); // upravte URL dle skutečné stránky
    await page.getByLabel('E-MAIL').fill('dostalova.michala@seznam.cz'); // nebo getByRole('textbox', { name: 'Uživatelské jméno' })
    await page.getByLabel('PASSWORD').fill('jarmilka');
    await page.getByRole('button', { name: /sign in/i }).click();
    
await expect(page.getByRole('heading', { level: 1, name: 'My account' })).toBeVisible();
})

})

test.describe('main_navigation ', () => {
    test('hrady_zamky', async ({ page, context }) => {
        await page.goto('https://www.npu.cz/cs');
        const navLink = page.locator('ul.main-navigation__list--highlight li.main-navigation__list-item > a[href$="/hrady-a-zamky"]');
        await navLink.click();
        await expect(page).toHaveURL(/hrady-a-zamky/);
    })
test('hrady_zamky', async ({ page }) => {
    await page.goto('https://www.npu.cz/cs');
    const navLink = page.locator('ul.main-navigation__list--highlight li.main-navigation__list-item > a[href$="/hrady-a-zamky"]');
    await expect(navLink).toHaveCount(1); // Ověří, že odkaz existuje
    const href = await navLink.getAttribute('href');
    if (href) {
        await page.goto(href.startsWith('http') ? href : `https://www.npu.cz${href}`);
        await expect(page).toHaveURL(/hrady-a-zamky/);
    } else {
        throw new Error('Navigation link not found');
    }
})
test('hrady_zamky', async ({ page }) => {
    await page.goto('https://www.npu.cz/cs');
    const navLink = page.locator('ul.main-navigation__list--highlight li.main-navigation__list-item > a[href$="/hrady-a-zamky"]');
    await expect(navLink).toHaveCount(1); // Ověří, že odkaz existuje
    const href = await navLink.getAttribute('href');
    if (href) {
        await page.goto(href.startsWith('http') ? href : `https://www.npu.cz${href}`);
        await expect(page).toHaveURL(/hrady-a-zamky/);
    } else {
        throw new Error('Navigation link not found');
    }
});

});
