import{test, expect} from '@playwright/test';
const URL = 'https://www.npu.cz/cs'

test.describe('dataTest', () => {
  test('DataTest', async ({ page }) => {
    await page.goto(URL);
     const extractedDates: string[] = [];
     await page.getByRole('button', { name: 'Všechny akce' }).click();
     expect(page).toHaveURL(/.*akce/);
     await page.getByRole('link', { name: '7AC46ED7-0EE7-42C3-A2F4-DEAB1D8B167F dalších 97' }).click();
      await page.waitForLoadState('networkidle');

    for (let i = 0; i < 5; i++) {
      const event = page.locator('.events__item').nth(i);
      await expect(event).toBeVisible();
      //console.log(await event.textContent());

      const dateEvent = event.locator('.events__item-info span').nth(5);
      const textEvent = await dateEvent.textContent();
      console.log(textEvent)
      if(textEvent) {
     const cleaned = textEvent.trim();
        
     
        const singleDayPattern = /^\d{1,2}\.\s*\d{1,2}\.\s*\d{4}$/;

        if (singleDayPattern.test(cleaned)) {
          extractedDates.push(cleaned);
          console.log(`Single-day event: ${cleaned}`);
        } else {
          console.log(`Multi-day or invalid format skipped: ${cleaned}`);
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









