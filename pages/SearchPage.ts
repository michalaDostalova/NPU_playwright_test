import { type Page, type Locator } from '@playwright/test';

const BASE_URL = 'https://www.npu.cz/cs';

/**
 * Page Object pro vyhledávání na webu npu.cz.
 * Viz PLAYWRIGHT_TUTORIAL.md – sekce "Mini-cvičení".
 */
export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
  }

  async goto() {
    await this.page.goto(BASE_URL);
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  getResultsHeading() {
    return this.page.getByRole('heading', { name: 'Search results' });
  }
}
