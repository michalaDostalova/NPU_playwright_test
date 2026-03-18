import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EventsPage extends BasePage {
    static readonly BASE_URL = 'https://www.npu.cz/cs';
    static readonly EVENTS_URL = 'https://www.npu.cz/cs/akce';
    private static readonly LOAD_MORE_LINK_NAME = '7AC46ED7-0EE7-42C3-A2F4-DEAB1D8B167F dalších 97';

    readonly eventItems: Locator;

    constructor(page: Page) {
        super(page);
        this.eventItems = page.locator('.events__item');
    }

    async goto(): Promise<void> {
        await this.navigate(EventsPage.BASE_URL);
    }

    async gotoEvents(): Promise<void> {
        await this.navigate(EventsPage.EVENTS_URL);
    }

    async openAllEvents(): Promise<void> {
        await this.page.getByRole('button', { name: 'Všechny akce' }).click();
        await this.page.getByRole('link', { name: EventsPage.LOAD_MORE_LINK_NAME }).click();
        await this.page.waitForLoadState('networkidle');
    }

    async extractEventDates(count: number): Promise<string[]> {
        const extractedDates: string[] = [];
        const singleDayPattern = /^\d{1,2}\.\s*\d{1,2}\.\s*\d{4}$/;

        for (let i = 0; i < count; i++) {
            const event = this.eventItems.nth(i);
            const dateLocator = event.locator('.events__item-info span').nth(5);
            const text = await dateLocator.textContent();
            if (text) {
                const cleaned = text.trim();
                if (singleDayPattern.test(cleaned)) {
                    extractedDates.push(cleaned);
                    console.log(`Single-day event: ${cleaned}`);
                } else {
                    console.log(`Multi-day or invalid format skipped: ${cleaned}`);
                }
            }
        }
        return extractedDates;
    }

    sortDatesChrono(dates: string[]): string[] {
        return [...dates].sort((a, b) => {
            const [dayA, monthA, yearA] = a.split('.').map(Number);
            const [dayB, monthB, yearB] = b.split('.').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateA.getTime() - dateB.getTime();
        });
    }
}
