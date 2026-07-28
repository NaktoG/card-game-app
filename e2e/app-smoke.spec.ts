import { expect, test } from '@playwright/test';

const cardImage =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 120 168%22%3E%3Crect width=%22120%22 height=%22168%22 rx=%2212%22 fill=%22white%22/%3E%3Ctext x=%2260%22 y=%2288%22 text-anchor=%22middle%22 font-size=%2232%22%3EA%3C/text%3E%3C/svg%3E';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('card-game-language', 'en');
  });
});

test('onboarding accepts a nickname and reaches the game surface', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'How to play' })).toBeVisible();
  await expect(page.getByText('Win more cards than the CPU before the deck runs out.')).toBeVisible();

  await page.getByLabel('Nickname').fill('Smoke Player');
  await page.getByRole('button', { name: /enter the arena/i }).click();

  await expect(page.getByText('Smoke Player')).toBeVisible();
  await expect(page.getByRole('button', { name: /new game/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /draw cards/i })).toBeDisabled();
});

test('gameplay can create a deck and draw a deterministic hand', async ({ page }) => {
  await page.route('**/api/deck/new/shuffle/**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: { success: true, deck_id: 'smoke-deck', shuffled: true, remaining: 52 },
    });
  });
  await page.route('**/api/deck/smoke-deck/draw/**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        success: true,
        deck_id: 'smoke-deck',
        remaining: 50,
        cards: [
          {
            code: 'AS',
            image: cardImage,
            images: { svg: cardImage, png: cardImage },
            value: 'ACE',
            suit: 'SPADES',
          },
          {
            code: '2H',
            image: cardImage,
            images: { svg: cardImage, png: cardImage },
            value: '2',
            suit: 'HEARTS',
          },
        ],
      },
    });
  });

  await page.goto('/');
  await page.getByLabel('Nickname').fill('Smoke Player');
  await page.getByRole('button', { name: /enter the arena/i }).click();
  await page.getByRole('button', { name: /new game/i }).click();

  await expect(page.getByText('Status: deck ready')).toBeVisible();
  await page.getByRole('button', { name: /draw cards/i }).click();

  await expect(page.getByLabel('Player card: ACE of SPADES')).toBeVisible();
  await expect(page.getByLabel('CPU card: 2 of HEARTS')).toBeVisible();
  await expect(page.getByText('You won the hand').first()).toBeVisible();
});

test('PWA static assets are served by the production preview server', async ({ request }) => {
  for (const path of ['/manifest.webmanifest', '/offline.html', '/sw.js']) {
    const response = await request.get(path);
    expect(response.status(), `${path} should be served successfully`).toBeGreaterThanOrEqual(200);
    expect(response.status(), `${path} should be served successfully`).toBeLessThan(300);
  }
});
