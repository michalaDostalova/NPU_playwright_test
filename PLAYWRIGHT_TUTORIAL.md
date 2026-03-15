# Playwright Tutor: Page Object Model (POM)

**FOCUS**: Playwright  
**ÚROVEŇ**: Mírně pokročilý / Pokročilý  
**CÍL UČENÍ**: Naučit se organizovat Playwright testy pomocí vzoru Page Object Model (POM) tak, aby byly přehledné, snadno udržovatelné a znovupoužitelné.

---

## 1. Stručné vysvětlení

Page Object Model (POM) je návrhový vzor, který **odděluje popis stránek od samotných testů**.
Každá stránka (nebo logická část UI) je reprezentována vlastní třídou obsahující lokátory a metody pro interakci.
Testy pak volají metody z těchto tříd místo přímého psaní `page.locator(...)` a `page.fill(...)` uvnitř testu.
Výsledkem je kód, který je **přehlednější, kratší a snáze udržovatelný**.
Pokud se změní selektor nebo flow stránky, stačí opravit **jednu třídu**, nikoli všechny testy.
Playwright nemá vestavěnou podporu POM, ale plně ho podporuje díky čistému TypeScriptu.

---

## 2. Minimální příklad (izolovaný, bez závislosti na tomto repozitáři)

```typescript
// pages/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
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
```

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('přihlášení platného uživatele', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('uzivatel@example.com', 'spravneHeslo');
  await expect(page.getByRole('heading', { name: 'Vítejte!' })).toBeVisible();
});
```

> **Klíčový princip**: Page Object drží lokátory + akce. Test drží aserce (`expect`).

---

## 3. Tři časté chyby / omyly

### ❌ Chyba 1 – Aserce (`expect`) uvnitř Page Object třídy

```typescript
// ŠPATNĚ
async login(email: string, password: string) {
  await this.emailInput.fill(email);
  await this.passwordInput.fill(password);
  await this.submitButton.click();
  await expect(this.page.getByText('Vítejte!')).toBeVisible(); // ← nepatří sem
}
```

**Jak ji poznám**: Metoda Page Objectu selže s chybou asserce, ale nevím, jestli selhala akce nebo ověření výsledku. Testovací framework hlásí chybu na jiném místě, než bych čekal.

---

### ❌ Chyba 2 – Příliš granulární metody (one-liner methods)

```typescript
// ŠPATNĚ – tři metody místo jedné
async fillEmail(email: string) { await this.emailInput.fill(email); }
async fillPassword(password: string) { await this.passwordInput.fill(password); }
async clickSubmit() { await this.submitButton.click(); }
```

**Jak ji poznám**: V testu volám 3–5 metod Page Objectu jen pro jeden logický krok uživatele. Test je stejně dlouhý, jako by byl bez POM.

---

### ❌ Chyba 3 – Sdílená instance Page Objectu mezi testy

```typescript
// ŠPATNĚ
const loginPage = new LoginPage(page); // ← definováno mimo test

test('test A', async ({ page }) => { ... });
test('test B', async ({ page }) => { ... }); // page zde je JINÁ instance
```

**Jak ji poznám**: Testy procházejí jednotlivě, ale při souběžném spuštění selhávají nebo se chovají nepředvídatelně. Playwright dává každému testu vlastní `page` — Page Object musí vzniknout uvnitř testu nebo v `beforeEach`.

---

## 4. Tři kontrolní otázky

1. **Proč by metoda `login(email, password)` měla být v Page Object třídě, ale `expect(page).toHaveURL(...)` by mělo zůstat v testu?**

2. **Kde (v jaké části kódu) vytvoříš instanci Page Object třídy, aby byl každý test izolovaný? Proč to není správné udělat na úrovni modulu (mimo `test(...)` nebo `beforeEach`)?**

3. **Máš Page Object s lokátory definovanými v konstruktoru (jako `Locator` vlastnosti). Jaká je výhoda oproti volání `page.getByLabel(...)` přímo uvnitř každé metody pokaždé znovu?**

---

## 5. Mini-cvičení (10–15 minut)

Vytvoř Page Object pro vyhledávací stránku `https://www.npu.cz/cs`:

**Krok 1** – Vytvoř soubor `pages/SearchPage.ts`:
- Třída `SearchPage` s konstruktorem přijímajícím `page: Page`
- Vlastnost `searchInput` (textbox pro hledaný výraz)
- Metoda `goto()` – naviguje na `https://www.npu.cz/cs`
- Metoda `search(query: string)` – vyplní pole a stiskne `Enter`
- Metoda `getResultsHeading()` – vrátí `Locator` na nadpis výsledků

**Krok 2** – Vytvoř soubor `tests/search.spec.ts`:
- Importuj `SearchPage`
- Vytvoř instanci uvnitř testu
- Zavolej `goto()` a `search('hrad')`
- Pomocí `expect(searchPage.getResultsHeading()).toBeVisible()` ověř, že se výsledky zobrazily

**Bonus**: Přidej druhý test, který ověří prázdné vyhledávání a zkontroluje, zda se zobrazí relevantní zpráva.

> 📁 Vzorová implementace je v tomto repozitáři: `pages/SearchPage.ts` a `tests/examples/pom-example.spec.ts`.

---

## 6. Další krok (1)

Otevři existující test `tests/NPU_homepage.spec.ts` a přesuň test `'login via UI'` do nové Page Object třídy `pages/AccountPage.ts` (metody `goto()` a `login(email, password)`). Spusť test a ověř, že stále prochází (`npx playwright test NPU_homepage.spec.ts --project=chromium`).

---

## Poznámka mimo rozsah

Pokud tě zajímá testování API endpointů (bez UI), Playwright na to má `request` fixture — to patří do tématu `/API-tests` a v tomto tutoriálu se jím nezabýváme.
