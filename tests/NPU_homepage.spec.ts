import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('homepage', () => {
    test('title', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await expect(page).toHaveTitle(/Národní památkový ústav/i);
    });

    test('search', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.searchFor('hrad');
        await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'hrad', exact: true })).toBeVisible();
    });

    test('FB link', async ({ page, context }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        const fbPage = await homePage.openSocialLink(context, homePage.facebookLink);
        await expect(fbPage).toHaveURL(/facebook\.com/);
        await fbPage.close();
    });

    test('Instagram link', async ({ page, context }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        const instaPage = await homePage.openSocialLink(context, homePage.instagramLink);
        await expect(instaPage).toHaveURL(/instagram\.com/);
        await instaPage.close();
    });

    test('YT link', async ({ page, context }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        const ytPage = await homePage.openSocialLink(context, homePage.youtubeLink);
        await expect(ytPage).toHaveURL(/youtube\.com/);
        await ytPage.close();
    });

    test('Linkedin link', async ({ page, context }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        const linkedinPage = await homePage.openSocialLink(context, homePage.linkedinLink);
        await expect(linkedinPage).toHaveURL(/linkedin\.com/);
        await linkedinPage.close();
    });

    test('login via UI', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.login('dostalova.michala@seznam.cz', 'jarmilka');
        await expect(page.getByRole('heading', { level: 1, name: 'My account' })).toBeVisible();
    });
});

test.describe('main_navigation', () => {
    test('hrady_zamky', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await expect(homePage.hradyZamkyNavLink).toHaveCount(1);
        await homePage.clickHradyZamky();
        await expect(page).toHaveURL(/hrady-a-zamky/);
    });

    test('online_vstupenky', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.clickSeznamPamatekDirect();
    });

    test('online_vstupenky2', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await expect(homePage.seznamPamatekParentItem).toBeVisible();
        await expect(homePage.seznamPamatekParentItem).toHaveCount(1);
        await homePage.openSeznamPamatekSubmenu();
        await expect(page).toHaveURL(/seznam-pamatek/);
    });

    // základní 3 sekce NPU.cz (Hrady a zámky, Památková péče, O nás)
    test('first_box', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.navstivteNasLink.click();
        await expect(page).toHaveURL(/hrady-a-zamky/);
        await page.getByRole('link', { name: 'Seznam památek' }).click();
        await expect(page).toHaveURL(/seznam-pamatek/);
    });

    test('second_box', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.poznajteNasiPraciLink.click();
        await expect(page).toHaveURL(/pamatkova-pece/);
        await page.getByRole('button', { name: 'Všechny novinky' }).click();
        await expect(page).toHaveURL(/novinky/);
    });

    test('3box', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.kdoJsmeLink.click();
        await expect(page).toHaveURL(/o-nas/);
        await page.getByRole('link', { name: 'Instituce' }).click();
        await expect(page).toHaveURL(/instituce/);
        await page.getByRole('link', { name: 'Vedení NPÚ' }).first().click();
        await expect(page).toHaveURL(/vedeni/);
        const vedeni = page.getByRole('heading', { name: 'Ing. arch. Naděžda Goryczková' });
        await expect(vedeni).toBeVisible();
        await expect(vedeni).toHaveCount(1);
    });
});
