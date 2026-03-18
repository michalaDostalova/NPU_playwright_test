import { Page, Locator, BrowserContext } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    static readonly URL = 'https://www.npu.cz/cs';

    // Search
    readonly searchBox: Locator;

    // Social links
    readonly facebookLink: Locator;
    readonly instagramLink: Locator;
    readonly youtubeLink: Locator;
    readonly linkedinLink: Locator;

    // Main navigation
    readonly hradyZamkyNavLink: Locator;
    readonly seznamPamatekParentItem: Locator;

    // Homepage section boxes
    readonly navstivteNasLink: Locator;
    readonly poznajteNasiPraciLink: Locator;
    readonly kdoJsmeLink: Locator;

    constructor(page: Page) {
        super(page);
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
        this.facebookLink = page.locator('ul.socials li.socials-item a[href*="facebook.com"]');
        this.instagramLink = page.locator('ul.socials li.socials-item a[href*="instagram.com"]');
        this.youtubeLink = page.locator('ul.socials li.socials-item a[href*="youtube.com"]');
        this.linkedinLink = page.locator('ul.socials li.socials-item a[href*="linkedin.com"]');
        this.hradyZamkyNavLink = page.locator('ul.main-navigation__list--highlight li.main-navigation__list-item > a[href$="/hrady-a-zamky"]');
        this.seznamPamatekParentItem = page.locator('ul.main-navigation__list--highlight li.main-navigation__list-item:has(a[href$="/seznam-pamatek"])');
        this.navstivteNasLink = page.getByRole('link', { name: 'Navštivte nás' });
        this.poznajteNasiPraciLink = page.getByRole('link', { name: 'Poznejte naši práci' });
        this.kdoJsmeLink = page.getByRole('link', { name: 'Kdo jsme' });
    }

    async goto(): Promise<void> {
        await this.navigate(HomePage.URL);
    }

    async searchFor(term: string): Promise<void> {
        await this.searchBox.fill(term);
        await this.searchBox.press('Enter');
    }

    async openSocialLink(context: BrowserContext, link: Locator): Promise<Page> {
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ]);
        return newPage;
    }

    async login(email: string, password: string): Promise<void> {
        await this.navigate('https://npu.cz/en/shop/account/my-account');
        await this.page.getByLabel('E-MAIL').fill(email);
        await this.page.getByLabel('PASSWORD').fill(password);
        await this.page.getByRole('button', { name: /sign in/i }).click();
    }

    async clickHradyZamky(): Promise<void> {
        const href = await this.hradyZamkyNavLink.getAttribute('href');
        if (href) {
            await this.navigate(href.startsWith('http') ? href : `https://www.npu.cz${href}`);
        } else {
            throw new Error('Navigation link not found');
        }
    }

    async openSeznamPamatekSubmenu(): Promise<void> {
        await this.seznamPamatekParentItem.hover();
        const submenuLink = this.seznamPamatekParentItem.locator('a.main-navigation__list-link[href$="/seznam-pamatek"]');
        await submenuLink.waitFor({ state: 'visible' });
        await submenuLink.click();
    }

    async clickSeznamPamatekDirect(): Promise<void> {
        await this.seznamPamatekParentItem.hover();
        const submenuLink = this.seznamPamatekParentItem.locator('a[href$="/seznam-pamatek"]');
        await submenuLink.click();
    }
}
