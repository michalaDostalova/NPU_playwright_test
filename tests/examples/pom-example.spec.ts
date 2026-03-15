/**
 * Izolovaný příklad Page Object Model (POM) pro Playwright.
 * Tento soubor slouží jako ukázka k tutoriálu PLAYWRIGHT_TUTORIAL.md.
 *
 * Příklad nepoužívá žádné specifické lokátory tohoto repozitáře –
 * demonstruje vzor na obecném přihlašovacím formuláři.
 *
 * Poznámka: Testy níže jsou záměrně označeny jako `test.skip`, protože
 * cílová URL (example.com) neobsahuje reálný přihlašovací formulář.
 * Odstraň `.skip` a doplň reálnou URL pro vlastní experimentování.
 */

import { test, expect, type Page, type Locator } from '@playwright/test';

// ---------------------------------------------------------------------------
// Page Object
// ---------------------------------------------------------------------------

class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput    = page.getByLabel('E-mail');
    this.passwordInput = page.getByLabel('Heslo');
    this.submitButton  = page.getByRole('button', { name: 'Přihlásit' });
  }

  async goto() {
    await this.page.goto('https://example.com/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// ---------------------------------------------------------------------------
// Testy
// ---------------------------------------------------------------------------

test.describe('POM příklad – přihlašovací stránka', () => {
  test.skip('přihlášení platného uživatele', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('uzivatel@example.com', 'spravneHeslo');
    // Aserce patří do testu, nikoli do Page Objectu
    await expect(page.getByRole('heading', { name: 'Vítejte!' })).toBeVisible();
  });

  test.skip('neplatné přihlášení zobrazí chybovou zprávu', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('chybny@example.com', 'spatneHeslo');
    await expect(page.getByText('Neplatné přihlašovací údaje')).toBeVisible();
  });
});
