// @ts-check
const { test, expect } = require('@playwright/test')

test('should keep the status of scenarios', async ({ page }) => {
  await page.goto('http://localhost:3000/pages/boardgame/residentevil3.html')
  await page.getByRole('tab', { name: 'Scenarios' }).click()
  await expect(page.locator('#scenario_downtown_1_completed')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).not.toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).not.toBeChecked()
  await page.locator('#scenario_downtown_1_completed').check()
  await page.locator('#scenario_downtown_1_itemC').check()
  await page.locator('#scenario_downtown_2_discovered').check()
  await expect(page.locator('#scenario_downtown_1_completed')).toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).toBeChecked()
  await page.reload()
  await page.getByRole('tab', { name: 'Scenarios' }).click()
  await expect(page.locator('#scenario_downtown_1_completed')).toBeChecked()
  await expect(page.locator('#scenario_downtown_1_itemC')).toBeChecked()
  await expect(page.locator('#scenario_downtown_2_discovered')).toBeChecked()
})

