// @ts-check
const { test, expect } = require('@playwright/test')

test('adding and removing card from tension deck', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await page.getByRole('tab', { name: 'Decks' }).click()
  await page.locator('#tensionCardSelect').selectOption('all_clear')
  await page.getByRole('button', { name: 'Add' }).first().click()
  await expect(page.locator('#tensionDeck')).toContainText('All Clear')
  await expect(page.locator('#tensionDeck').getByPlaceholder('Quantity')).toHaveValue('1')
  await page.locator('#tensionDeck').getByRole('button', { name: '' }).click()
  await expect(page.locator('#tensionDeck')).not.toContainText('All Clear')
})

test('adding and removing card from narrative deck', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await page.getByRole('tab', { name: 'Decks' }).click()
  await page.getByLabel('Narrative Select').selectOption('explosion');
  await page.getByRole('button', { name: 'Add' }).nth(1).click();
  await expect(page.getByRole('paragraph')).toContainText('Explosion');
  await page.locator('#narrativeDeck').getByRole('button', { name: '' }).click()
  await expect(page.locator('#narrativeDeck')).not.toContainText('Explosion')
})

