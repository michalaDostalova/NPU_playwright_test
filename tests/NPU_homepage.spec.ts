import{test, expect} from '@playwright/test';
import { describe } from 'node:test';

const URL = 'https://www.npu.cz/cs'

test.describe('homepage', () => {
    test('title', async ({ page }) => {
        await page.goto(URL);
        await expect(page).toHaveTitle(/Národní památkový ústav/i);
    });
    test('search', async ({ page }) => {
        await page.goto(URL);
        const searchBox = page.getByRole('textbox', { name: 'Search' });
        await searchBox.fill('hrad');
        await searchBox.press('Enter');
        await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
    const resultHeading = page.getByRole('heading', { name: 'hrad', exact: true });
    await expect(resultHeading).toBeVisible();
});

 test('FB link', async ({ page, context }) => {
        await page.goto(URL);
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
    await page.goto(URL);
    const instaLink = page.locator('ul.socials li.socials-item a[href*="instagram.com"]');
    const [instaPage] = await Promise.all([
        context.waitForEvent('page'),
        instaLink.click()
    ]);
    await expect(instaPage).toHaveURL(/instagram\.com/);
    await instaPage.close();
})
test('YT link', async ({ page, context }) => {
    await page.goto(URL);
    const ytLink = page.locator('ul.socials li.socials-item a[href*="youtube.com"]');
    const [ytPage] = await Promise.all([
        context.waitForEvent('page'),
        ytLink.click()
    ]);
    await expect(ytPage).toHaveURL(/youtube\.com/);
    await ytPage.close();

})
test('Linkedin link', async ({ page, context }) => {
    await page.goto(URL);
    const linkedinLink = page.locator('ul.socials li.socials-item a[href*="linkedin.com"]');
    const [linkedinPage] = await Promise.all([
        context.waitForEvent('page'),
        linkedinLink.click()
    ]);
    await expect(linkedinPage).toHaveURL(/linkedin\.com/);
    await linkedinPage.close();

})

test('login via UI', async ({ page }) => {
    await page.goto('https://npu.cz/en/shop/account/my-account'); 
    await page.getByLabel('E-MAIL').fill('dostalova.michala@seznam.cz'); 
    await page.getByLabel('PASSWORD').fill('jarmilka');
    await page.getByRole('button', { name: /sign in/i }).click();
    
await expect(page.getByRole('heading', { level: 1, name: 'My account' })).toBeVisible();
})
})




test.describe('main_navigation ', () => {
   
test('hrady_zamky', async ({ page }) => {
    await page.goto(URL);
    const navLink = page.locator('ul.main-navigation__list--highlight li.main-navigation__list-item > a[href$="/hrady-a-zamky"]');
    await expect(navLink).toHaveCount(1); 
    const href = await navLink.getAttribute('href');
    if (href) {
        await page.goto(href.startsWith('http') ? href : `https://www.npu.cz${href}`);
        await expect(page).toHaveURL(/hrady-a-zamky/);
    } else {
        throw new Error('Navigation link not found');
    }
});
test("online_vstupenky", async({ page }) => {
    await page.goto(URL);
  
    const parentMenuItem = page.locator('ul.main-navigation__list--highlight li.main-navigation__list-item:has(a[href$="/seznam-pamatek"])');
 
    await parentMenuItem.hover();
  
    const submenuLink = parentMenuItem.locator('a[href$="/seznam-pamatek"]');
    await expect(submenuLink).toBeVisible();
    await submenuLink.click();
})
test("online_vstupenky2", async({ page }) => {
    await page.goto(URL);
   const parentMenuItem = page.locator('ul.main-navigation__list--highlight li.main-navigation__list-item:has(a[href$="/seznam-pamatek"])');
  
    await page.waitForTimeout(500)
    await parentMenuItem.hover();
    await expect(parentMenuItem).toBeVisible();
    await expect(parentMenuItem).toHaveCount(1);
    await parentMenuItem.click();
    
    const submenuContainer = parentMenuItem.locator('ul.dropdown-list');
await expect(submenuContainer).toBeVisible();
  
const submenuLink = parentMenuItem.locator('a.main-navigation__list-link[href$="/seznam-pamatek"]');

   
    await page.waitForTimeout(600)
    await expect(submenuLink).toBeVisible();
    await expect(submenuLink).toHaveCount(1);
    
    await submenuLink.click();
   
    await expect(page).toHaveURL(/seznam-pamatek/);
});
// základní 3 sekce NPU.cz(Hrady a zámk, pamatková péče, O nás)
test('first_box', async( { page }) => {await page.getByRole('link', { name: 'CZ', exact: true }).click();
await page.getByRole('button', { name: 'Všechny novinky' }).click();
    await page.goto(URL);
    await page.getByRole('link', { name: 'Navštivte nás' }).click();
    await expect(page).toHaveURL(/hrady-a-zamky/);
    await page.getByRole('link', { name: 'Seznam památek' }).click();
    await expect(page).toHaveURL(/seznam-pamatek/);

});



test('second_box', async( { page }) => {
    await page.goto(URL);
    await page.getByRole('link', { name: 'Poznejte naši práci' }).click();
    await expect(page).toHaveURL(/pamatkova-pece/);
    await page.getByRole('button', { name: 'Všechny novinky' }).click();
    await expect(page).toHaveURL(/novinky/);

});
test('3box', async( { page }) => {
    await page.goto(URL);
    await page.getByRole('link', { name: 'Kdo jsme' }).click();
    await expect(page).toHaveURL(/o-nas/);
    await page.getByRole('link', { name: 'Instituce' }).click();
    await expect(page).toHaveURL(/instituce/);
    await page.getByRole('link', { name: 'Vedení NPÚ' }).first().click();  
    await expect(page).toHaveURL(/vedeni/);
    const vedeni = page.getByRole('heading', { name: 'Ing. arch. Naděžda Goryczková' })
    await expect(vedeni).toBeVisible();
    await expect(vedeni).toHaveCount(1);


});
 



})
