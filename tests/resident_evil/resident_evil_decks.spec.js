// @ts-check
const { test, expect } = require('@playwright/test')

test('removing card from tension deck does not remove from removed tension deck', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html')
  await page.getByRole('tab', { name: 'Decks' }).click()
  await page.locator('#tensionCardSelect').selectOption('all_clear')
  await page.getByRole('button', { name: 'Add Tension Card' }).first().click()
  await page.locator('#removedTensionCardSelect').selectOption('all_clear')
  await page.getByRole('button', { name: 'Add Tension Card' }).nth(1).click()
  await expect(page.locator('#tensionDeck')).toContainText('All Clear')
  await expect(page.locator('#removedTensionDeck')).toContainText('All Clear')
  await expect(page.locator('#tensionDeck').getByPlaceholder('Quantity')).toHaveValue('1')
  await expect(page.locator('#removedTensionDeck').getByPlaceholder('Quantity')).toHaveValue('1')
  await page.locator('#tensionDeck').getByRole('button', { name: '' }).click()
  await expect(page.locator('#removedTensionDeck')).toContainText('All Clear')
  await expect(page.getByPlaceholder('Quantity')).toHaveValue('1')
  await expect(page.locator('#tensionDeck')).not.toContainText('All Clear')
})

test('removing card from removed tension deck does not remove from tension deck', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html')
  await page.getByRole('tab', { name: 'Decks' }).click()
  await page.locator('#tensionCardSelect').selectOption('all_clear')
  await page.getByRole('button', { name: 'Add Tension Card' }).first().click()
  await page.locator('#removedTensionCardSelect').selectOption('all_clear')
  await page.getByRole('button', { name: 'Add Tension Card' }).nth(1).click()
  await expect(page.locator('#tensionDeck')).toContainText('All Clear')
  await expect(page.locator('#removedTensionDeck')).toContainText('All Clear')
  await expect(page.locator('#tensionDeck').getByPlaceholder('Quantity')).toHaveValue('1')
  await expect(page.locator('#removedTensionDeck').getByPlaceholder('Quantity')).toHaveValue('1')
  await page.locator('#removedTensionDeck').getByRole('button', { name: '' }).click()
  await expect(page.locator('#tensionDeck')).toContainText('All Clear')
  await expect(page.getByPlaceholder('Quantity')).toHaveValue('1')
  await expect(page.locator('#removedTensionDeck')).not.toContainText('All Clear')
})

test('removing card from added narrative deck does not remove from narrative deck', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html')
  await page.getByRole('tab', { name: 'Decks' }).click()
  await page.locator('#narrativeCardSelect').selectOption('animosity')
  await page.getByLabel('Decks').locator('div').filter({ hasText: 'Add the played narratives' }).getByRole('button').click()
  await page.locator('#addedNarrativeCardSelect').selectOption('animosity')
  await page.getByRole('button', { name: 'Add Narrative Card' }).nth(1).click()
  await expect(page.locator('#narrativeDeck')).toContainText('Animosity')
  await expect(page.locator('#addedNarrativeDeck')).toContainText('Animosity')
  await page.locator('#addedNarrativeDeck').getByRole('button', { name: '' }).click()
  await expect(page.locator('#narrativeDeck')).toContainText('Animosity')
  await expect(page.locator('#addedNarrativeDeck')).not.toContainText('Animosity')
})

test('removing card from narrative deck does not remove from added narrative deck', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html')
  await page.getByRole('tab', { name: 'Decks' }).click()
  await page.locator('#narrativeCardSelect').selectOption('animosity')
  await page.getByLabel('Decks').locator('div').filter({ hasText: 'Add the played narratives' }).getByRole('button').click()
  await page.locator('#addedNarrativeCardSelect').selectOption('animosity')
  await page.getByRole('button', { name: 'Add Narrative Card' }).nth(1).click()
  await expect(page.locator('#narrativeDeck')).toContainText('Animosity')
  await expect(page.locator('#addedNarrativeDeck')).toContainText('Animosity')
  await page.locator('#narrativeDeck').getByRole('button', { name: '' }).click()
  await expect(page.locator('#narrativeDeck')).not.toContainText('Animosity')
  await expect(page.locator('#addedNarrativeDeck')).toContainText('Animosity')
})
