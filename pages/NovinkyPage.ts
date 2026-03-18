import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NovinkyPage extends BasePage {
    static readonly URL = 'https://www.npu.cz/cs/novinky';

    readonly heading: Locator;
    readonly searchLink: Locator;
    readonly searchBox: Locator;
    readonly searchButton: Locator;
    readonly filterLink: Locator;
    readonly filterButton: Locator;
    readonly regionSelect: Locator;
    readonly newsItems: Locator;
    readonly loadMoreLink: Locator;

    constructor(page: Page) {
        super(page);
        this.heading = page.getByRole('heading', { name: 'Novinky' });
        this.searchLink = page.getByRole('link', { name: 'hledat' });
        this.searchBox = page.getByRole('searchbox', { name: 'Hledaný výraz' });
        this.searchButton = page.getByRole('button', { name: 'Vyhledej' });
        this.filterLink = page.getByRole('link', { name: 'Filtr' });
        this.filterButton = page.getByRole('button', { name: 'Filtruj' });
        this.regionSelect = page.locator('select[name="region"]');
        this.newsItems = page.locator('.news-item');
        this.loadMoreLink = page.getByRole('link', { name: 'Načíst další' });
    }

    async goto(): Promise<void> {
        await this.navigate(NovinkyPage.URL);
    }

    async searchNews(term: string): Promise<void> {
        await this.searchLink.click();
        await this.searchBox.fill(term);
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async filterByRegion(region: string): Promise<void> {
        await this.filterLink.click();
        await this.regionSelect.selectOption(region);
        await this.filterButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getNewsCount(): Promise<number> {
        return this.newsItems.count();
    }

    async loadMore(): Promise<void> {
        const countBefore = await this.newsItems.count();
        await this.loadMoreLink.click();
        await this.page.waitForFunction(
            (n: number) => document.querySelectorAll('.news-item').length > n,
            countBefore
        );
    }
}
