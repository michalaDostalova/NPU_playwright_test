import{test, expect} from '@playwright/test';
import { networkInterfaces } from 'os';
const URL = 'https://www.npu.cz/cs';

test.describe('NPU load test', () =>{
    test('NPU nacteni homepage', async  ({page}) => {
        const loadTest = Date.now()

        await page.goto(URL);
        await expect(page).toHaveTitle(/Národní památkový ústav/i)  
        await page.waitForLoadState('networkidle');
        const LoadTime = Date.now() - loadTest

        expect(LoadTime).toBeLessThan(5000); // Očekáváme, že načtení stránky bude trvat méně než 5 sekund
        console.log(LoadTime)
       
})
test('NPU nacteni akce', async  ({page}) => {
        const loadTestAkce = Date.now()

        await page.goto(`${URL}/akce`);
        await  expect(page).toHaveTitle(/Akce/i)  
        await page.waitForLoadState('networkidle');
        const LoadTimeAkce = Date.now() - loadTestAkce

        expect(LoadTimeAkce).toBeLessThan(5000); // Očekáváme, že načtení stránky bude trvat méně než 5 sekund
        console.log(LoadTimeAkce)
       


})
})