import{test, expect} from '@playwright/test';
const URL = 'https://www.npu.cz/cs'

test.describe('dataTest', () => {
  test('title', async ({ page }) => {
    await page.goto(URL);
     const extractedDates: string[] = [];
    for (let i = 0; i < 5; i++) {
      const event = page.locator('.events__item').nth(i);
      await expect(event).toBeVisible();
      //console.log(await event.textContent());

      const dateEvent = event.locator('.events__item-info span').nth(5);
      const textEvent = await dateEvent.textContent();
      console.log(textEvent)
      if(textEvent) {
        const dataMatch = textEvent.match(/\d{1,2}\.\s*\d{1,2}\.\s*\d{4}/)
        if(dataMatch) {
          extractedDates.push(dataMatch[0].trim());
        }
      }
 }
 const chronologicalDates = extractedDates.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('.').map(Number);
      const [dayB, monthB, yearB] = b.split('.').map(Number);
      
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      
      return dateA.getTime() - dateB.getTime();
    });
    
    // Výpis seřazených dat
    console.log('=== CHRONOLOGICALLY SORTED DATES ===');
    chronologicalDates.forEach((date, index) => {
      console.log(`${index + 1}. ${date}`);
    });
    
    // Validace
    expect(chronologicalDates.length).toBeGreaterThan(0);
  });
  });









