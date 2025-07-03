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