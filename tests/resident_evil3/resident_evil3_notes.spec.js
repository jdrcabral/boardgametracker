// @ts-check
const { test, expect } = require('@playwright/test')

test('should store note', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await page.getByLabel('Notes').click()
  await page.getByLabel('Notes').fill('Test')
  await page.locator('#characterHealth1').click()
  await expect(page.getByLabel('Notes')).toHaveValue('Test')
  await page.reload()
  await expect(page.locator('xpath=//*[@id="gameNotes"]')).toHaveValue('Test')
})

test('should keep notes when change campaign', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await page.getByLabel('Notes').click()
  await page.getByLabel('Notes').fill('Test')
  await page.getByLabel('Notes').press('Tab')
  await expect(page.getByLabel('Notes')).toHaveValue('Test')
  await page.reload()
  await expect(page.locator('xpath=//*[@id="gameNotes"]')).toHaveValue('Test')
  await page.getByRole('button', { name: 'New Campaign' }).click()
  await page.getByLabel('Notes').click()
  await page.getByLabel('Notes').fill('New Campaign')
  await page.getByLabel('Notes').press('Tab')
  await page.reload()
  await page.getByLabel('Campaign Select').selectOption('New Campaign')
  await expect(page.getByLabel('Notes')).toHaveValue('New Campaign')
  await page.getByLabel('Campaign Select').selectOption('Game Campaign')
  await expect(page.getByLabel('Notes')).toHaveValue('Test')
})
