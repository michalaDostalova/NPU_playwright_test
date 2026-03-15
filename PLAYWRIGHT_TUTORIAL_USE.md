# Playwright Tutor: Možnost `use` v konfiguraci

**FOCUS**: Playwright  
**ÚROVEŇ**: Mírně pokročilý / Pokročilý  
**CÍL UČENÍ**: Pochopit, co dělá blok `use` v `playwright.config.ts`, jak se nastavení dědí a přebíjí mezi globální a projektovou úrovní, a využít `baseURL` pro kratší a přehlednější testy.

---

## 1. Stručné vysvětlení

Blok `use` v `playwright.config.ts` je místo, kde definuješ **sdílená nastavení pro všechny testy** — např. `baseURL`, jak sbírat trace soubory, nebo zda pořizovat screenshoty při selhání.
Existují dvě úrovně: **globální** `use` (platí pro všechny projekty) a `use` **uvnitř projektu** (přebíjí globální jen pro daný projekt).
Nejdůležitější vlastnosti jsou `baseURL`, `trace`, `screenshot`, `video`, `headless`, `viewport`, `storageState`, `locale` a `timezoneId`.
Nastavení `baseURL` ti umožňuje psát `page.goto('/cs/novinky')` místo celé URL — testy jsou kratší a přenositelné mezi prostředími.
Každý test nebo `test.describe` blok může globální nastavení lokálně přebít pomocí `test.use({})`.
Playwright při spuštění sloučí globální `use`, projektový `use` a lokální `test.use()` — projektové a lokální hodnoty vždy vítězí.

---

## 2. Minimální příklad (izolovaný, bez závislosti na tomto repozitáři)

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    // ✅ Všechny page.goto('/...') volají budou relativní k této URL
    baseURL: 'https://www.example.com',

    // Sbírej trace pouze při prvním opakování selhávajícího testu
    trace: 'on-first-retry',

    // Pořiď screenshot pouze když test selže
    screenshot: 'only-on-failure',

    // Nahraj video pouze při selhání
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        // Projektový use přebíjí globální pro tento projekt
        ...devices['Desktop Chrome'],
        // Chceme vidět prohlížeč při lokálním ladění
        headless: false,
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      // Firefox dědí globální use výše beze změny
    },
  ],
});
```

```typescript
// tests/homepage.spec.ts
import { test, expect } from '@playwright/test';

test('načtení homepage', async ({ page }) => {
  // Díky baseURL stačí relativní cesta místo 'https://www.example.com/'
  await page.goto('/');
  await expect(page).toHaveTitle(/Example Domain/);
});

test.describe('Mobilní pohled', () => {
  // Lokální přebití: pouze pro testy v tomto bloku
  test.use({ viewport: { width: 375, height: 812 } });

  test('navbar je viditelný na mobilu', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
```

> **Klíčový princip**: `baseURL` globálně → `use` v projektu přebíjí globál → `test.use()` přebíjí vše.

---

## 3. Tři časté chyby / omyly

### ❌ Chyba 1 – Hardcoded celá URL v testech navzdory nastaveném `baseURL`

```typescript
// ŠPATNĚ – ztratíš výhodu baseURL
await page.goto('https://www.example.com/login');

// SPRÁVNĚ – relativní cesta využije baseURL z konfigurace
await page.goto('/login');
```

**Jak ji poznám**: `baseURL` máš nastavené v configu, ale testy stále obsahují plné URL. Když změníš prostředí (staging → produkce), musíš měnit každý test zvlášť místo jednoho řádku v configu.

---

### ❌ Chyba 2 – `headless: false` zůstane v configu při pushování na CI

```typescript
// ŠPATNĚ – zapomeneš vrátit před commitem
use: {
  headless: false, // ← CI nemá display, testy selžou nebo se přeskočí
}
```

**Jak ji poznám**: Testy ti lokálně procházejí, ale na CI (GitHub Actions, Azure Pipelines) selhávají s chybou `Error: spawn ENOENT` nebo vůbec nespustí prohlížeč. Řešení: buď `headless: false` nedávej do configu vůbec (výchozí je `true`), nebo podmíněně: `headless: !process.env.HEADED`.

---

### ❌ Chyba 3 – Záměna globálního `use` s projektovým `use`

```typescript
// POZOR – toto nastavení platí POUZE pro projekt 'chromium'
projects: [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      screenshot: 'only-on-failure', // ← Firefox ho nedostane!
    },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
    // Firefox screenshoty dělat nebude
  },
],
```

**Jak ji poznám**: Screenshoty nebo traces vznikají jen pro některé projekty. Chceš-li nastavení pro všechny projekty, dej ho do globálního `use`, nikoli do projektového.

---

## 4. Tři kontrolní otázky

1. **Máš `baseURL: 'https://www.npu.cz'` v globálním `use`. Jak napíšeš `page.goto()` pro stránku `https://www.npu.cz/cs/novinky`?**

2. **Co se stane, když nastavíš `trace: 'on'` místo `trace: 'on-first-retry'`? Kdy jsou trace soubory větší a proč?**

3. **Chceš, aby Firefox testy běžely s viewport `1280 × 720`, ale Chrome s `1920 × 1080`. Kam dáš příslušná nastavení viewport — do globálního `use` nebo do projektového `use`? Proč?**

---

## 5. Mini-cvičení (10–15 minut)

Uprav `playwright.config.ts` v tomto repozitáři tak, aby:

**Krok 1** – Nastav `baseURL: 'https://www.npu.cz'` v globálním `use`.

**Krok 2** – Přidej `screenshot: 'only-on-failure'` a `video: 'retain-on-failure'` do globálního `use`.

**Krok 3** – Otevři `tests/NPU_performance.spec.ts`. Soubor momentálně obsahuje konstantu `URL` a volání `page.goto` s absolutními adresami. Změň je na relativní cesty:
```typescript
// PŘED — absolutní URL, ignoruje baseURL z configu
const URL = 'https://www.npu.cz/cs';
await page.goto(URL);           // v prvním testu
await page.goto(`${URL}/akce`); // ve druhém testu

// PO — relativní cesty, využívají baseURL: 'https://www.npu.cz'
// (konstantu URL smaž nebo ji přejmenuj, aby nedošlo ke konfliktu s globálním URL)
await page.goto('/cs');
await page.goto('/cs/akce');
```

**Krok 4** – Spusť upravený test a ověř, že stále prochází:
```bash
npx playwright test NPU_performance.spec.ts --project=chromium
```

**Bonus**: Přidej do globálního `use` `locale: 'cs-CZ'` a `timezoneId: 'Europe/Prague'`. Zkus zjistit, co tato nastavení ovlivňují (nápověda: `new Date().toLocaleString()` v testu).

> 📁 Aktuální `playwright.config.ts` v tomto repozitáři je vzorová ukázka — podívej se na komentáře u jednotlivých možností.

---

## 6. Další krok (1)

Přidej do globálního `use` v `playwright.config.ts` řádek `screenshot: 'only-on-failure'`. Pak záměrně uprav jeden test tak, aby selhal (např. změň očekávaný titulek), spusť ho a v adresáři `test-results/` najdi automaticky pořízený screenshot. Vrať test do původního stavu.

---

## Poznámka mimo rozsah

Vlastnost `storageState` v bloku `use` umožňuje přihlásit se jednou a sdílet session mezi testy bez opakovaného login flow — to je téma na `fixtures` a globální `setup`, které se v tomto tutoriálu neprobírá.
