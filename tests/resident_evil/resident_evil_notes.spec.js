// @ts-check
const { test, expect } = require('@playwright/test')

test('should store note', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil.html')
  await page.getByLabel('Notes').click();
  await page.getByLabel('Notes').fill('Test');
  await page.locator('#characterHealth1').click();
  await expect(page.getByLabel('Notes')).toHaveValue('Test');
  await page.reload();
  await expect(page.locator('xpath=//*[@id="gameNotes"]')).toHaveValue('Test');
})