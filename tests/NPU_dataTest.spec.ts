import { test, expect } from '@playwright/test';
import { EventsPage } from '../pages/EventsPage';

test.describe('dataTest', () => {
    test('DataTest', async ({ page }) => {
        const eventsPage = new EventsPage(page);
        await eventsPage.goto();
        await eventsPage.openAllEvents();

        const extractedDates = await eventsPage.extractEventDates(5);
        const chronologicalDates = eventsPage.sortDatesChrono(extractedDates);

        console.log('=== CHRONOLOGICALLY SORTED DATES ===');
        chronologicalDates.forEach((date, index) => {
            console.log(`${index + 1}. ${date}`);
        });

        expect(chronologicalDates.length).toBeGreaterThan(0);
    });
});









