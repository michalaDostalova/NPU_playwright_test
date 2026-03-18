import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class EshopPage extends BasePage {
    static readonly URL = 'https://eshop.npu.cz/cs/';

    constructor(page: Page) {
        super(page);
    }

    async goto(): Promise<void> {
        await this.navigate(EshopPage.URL);
    }
}
